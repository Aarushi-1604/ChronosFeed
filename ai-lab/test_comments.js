require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function main() {
  try {
    // STEP 1 — Load test data
    const personasRaw = fs.readFileSync(
      path.join(__dirname, 'mock_data', 'samples', 'chain_personas.json'),
      'utf-8'
    );
    const personas = JSON.parse(personasRaw);
    const personaHandles = personas.map((p) => p.handle);

    const postsRaw = fs.readFileSync(
      path.join(__dirname, 'mock_data', 'samples', 'chain_posts.json'),
      'utf-8'
    );
    const posts = JSON.parse(postsRaw);
    const testPost = { handle: posts[0].handle, content: posts[0].content };

    console.log(`Testing with post by @${testPost.handle}`);
    console.log(`Post: "${testPost.content.slice(0, 100)}..."`);
    console.log(`Available personas: ${personaHandles.length}`);
    console.log('---');

    // STEP 2 — Build the prompt
    let prompt = fs.readFileSync(
      path.join(__dirname, 'prompts', 'comment.txt'),
      'utf-8'
    );
    prompt = prompt.replace(
      '{{WORLD_CONTEXT}}',
      'World: The Victorian Web. Era: Victorian Cyberpunk. Prompt: What if the internet was invented in 1890?'
    );
    prompt = prompt.replace('{{POST_CONTENT}}', testPost.content);
    prompt = prompt.replace('{{POST_AUTHOR_HANDLE}}', testPost.handle);
    prompt = prompt.replace(
      '{{PERSONA_HANDLES}}',
      personaHandles.filter((h) => h !== testPost.handle).join(', ')
    );

    // STEP 3 — Call Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    console.log('Calling Gemini...');
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // STEP 4 — Clean and parse
    let cleaned = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');

    let parsed;
    let parseSuccess = false;

    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      cleaned = cleaned.substring(firstBracket, lastBracket + 1);
      try {
        parsed = JSON.parse(cleaned);
        parseSuccess = true;
      } catch (e) {
        parseSuccess = false;
      }
    }

    // STEP 5 — Validate
    if (!parseSuccess) {
      console.log('✗ Invalid JSON');
      console.log(responseText.slice(0, 500));
      return;
    }

    console.log('✓ Valid JSON array');
    console.log('Comment count: ' + parsed.length);

    for (const comment of parsed) {
      console.log('  @' + comment.handle + ': ' + comment.content.slice(0, 80) + '...');
    }

    let allValid = true;

    for (let i = 0; i < parsed.length; i++) {
      const comment = parsed[i];

      if (!comment.handle || !comment.content || comment.likes_count === undefined) {
        console.log(`✗ Comment ${i} missing required field (handle, content, or likes_count)`);
        allValid = false;
      }

      if (comment.handle === testPost.handle) {
        console.log(`✗ Comment ${i} handle @${comment.handle} is the same as post author (self-comment)`);
        allValid = false;
      }

      if (!personaHandles.includes(comment.handle)) {
        console.log(`✗ Comment ${i} handle @${comment.handle} not found in persona handles`);
        allValid = false;
      }
    }

    if (allValid) {
      console.log('✓ Schema valid');
    }

    // STEP 6 — Save
    const outputPath = path.join(__dirname, 'mock_data', 'samples', 'comments_latest.json');
    fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2), 'utf-8');
    console.log('Saved to mock_data/samples/comments_latest.json');
  } catch (err) {
    console.log('Fatal error: ' + err.message);
  }
}

main();
