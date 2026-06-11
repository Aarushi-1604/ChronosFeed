const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load GEMINI_API_KEY from .env file in the same folder
require('dotenv').config({ path: path.join(__dirname, '.env') });

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function cleanJSONObject(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\n?\s*```$/, '').trim();
  }
  const firstBrace = cleaned.indexOf('{');
  if (firstBrace !== -1) {
    cleaned = cleaned.substring(firstBrace);
  }
  const lastBrace = cleaned.lastIndexOf('}');
  if (lastBrace !== -1) {
    cleaned = cleaned.substring(0, lastBrace + 1);
  }
  return cleaned;
}

function cleanJSONArray(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\n?\s*```$/, '').trim();
  }
  const firstBracket = cleaned.indexOf('[');
  if (firstBracket !== -1) {
    cleaned = cleaned.substring(firstBracket);
  }
  const lastBracket = cleaned.lastIndexOf(']');
  if (lastBracket !== -1) {
    cleaned = cleaned.substring(0, lastBracket + 1);
  }
  return cleaned;
}

function validateWorld(world) {
  const required = ['name', 'summary', 'era', 'tech_level', 'gov_type', 'events'];
  required.forEach(k => {
    if (world[k] === undefined) {
      throw new Error(`World missing required field: ${k}`);
    }
  });
  if (!Array.isArray(world.events)) {
    throw new Error('World events field must be an array');
  }
}

async function main() {
  try {
    const userPrompt = process.argv[2] || "What if the internet was invented in 1890?";
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      generationConfig: { responseMimeType: 'application/json' }
    });

    // ==========================================
    // STEP 1 — World Genesis
    // ==========================================
    const worldPromptPath = path.join(__dirname, 'prompts', 'world_genesis.txt');
    if (!fs.existsSync(worldPromptPath)) {
      throw new Error(`Prompt file not found at ${worldPromptPath}`);
    }
    const worldPromptTemplate = fs.readFileSync(worldPromptPath, 'utf8');
    const completedWorldPrompt = worldPromptTemplate.replace('{{USER_PROMPT}}', userPrompt);

    const worldResult = await model.generateContent(completedWorldPrompt);
    const worldResponseText = worldResult.response.text();

    const cleanedWorldText = cleanJSONObject(worldResponseText);
    const world = JSON.parse(cleanedWorldText);

    validateWorld(world);
    console.log(`✓ World generated: ${world.name}`);

    const worldOutputPath = path.join(__dirname, 'mock_data', 'samples', 'chain_world.json');
    fs.mkdirSync(path.dirname(worldOutputPath), { recursive: true });
    fs.writeFileSync(worldOutputPath, cleanedWorldText, 'utf8');

    // ==========================================
    // STEP 2 — Personas
    // ==========================================
    console.log("Waiting 10 seconds before generating personas...");
    await wait(10000);

    const worldContext = "World: " + world.name + ". Era: " + world.era + ". Prompt: " + userPrompt;

    const personaPromptPath = path.join(__dirname, 'prompts', 'persona.txt');
    if (!fs.existsSync(personaPromptPath)) {
      throw new Error(`Prompt file not found at ${personaPromptPath}`);
    }
    const personaPromptTemplate = fs.readFileSync(personaPromptPath, 'utf8');
    const completedPersonaPrompt = personaPromptTemplate.replace('{{WORLD_CONTEXT}}', worldContext);

    const personaResult = await model.generateContent(completedPersonaPrompt);
    const personaResponseText = personaResult.response.text();

    const cleanedPersonaText = cleanJSONArray(personaResponseText);
    const personas = JSON.parse(cleanedPersonaText);

    if (!Array.isArray(personas) || personas.length !== 5) {
      throw new Error(`Expected exactly 5 personas, got ${Array.isArray(personas) ? personas.length : 'non-array'}`);
    }

    console.log(`✓ Personas generated: 5`);
    personas.forEach(p => {
      console.log(`@${p.handle} (${p.role})`);
    });

    const personaOutputPath = path.join(__dirname, 'mock_data', 'samples', 'chain_personas.json');
    fs.mkdirSync(path.dirname(personaOutputPath), { recursive: true });
    fs.writeFileSync(personaOutputPath, cleanedPersonaText, 'utf8');

    // ==========================================
    // STEP 3 — Posts
    // ==========================================
    console.log("Waiting 10 seconds before generating posts...");
    await wait(10000);

    const personaHandles = personas.map(p => p.handle);

    const postPromptPath = path.join(__dirname, 'prompts', 'post.txt');
    if (!fs.existsSync(postPromptPath)) {
      throw new Error(`Prompt file not found at ${postPromptPath}`);
    }
    const postPromptTemplate = fs.readFileSync(postPromptPath, 'utf8');

    let completedPostPrompt = postPromptTemplate.replace('{{WORLD_CONTEXT}}', worldContext);
    completedPostPrompt = completedPostPrompt.split('{{PERSONA_HANDLES}}').join(personaHandles.join(', '));

    const postResult = await model.generateContent(completedPostPrompt);
    const postResponseText = postResult.response.text();

    const cleanedPostText = cleanJSONArray(postResponseText);
    const posts = JSON.parse(cleanedPostText);

    if (!Array.isArray(posts)) {
      throw new Error('Posts output is not a JSON array');
    }

    const validPosts = posts.filter(post => {
      return post && typeof post === 'object' && post.handle && personaHandles.includes(post.handle);
    });

    console.log(`✓ Posts generated: ${validPosts.length} valid out of ${posts.length}`);
    const postOutputPath = path.join(__dirname, 'mock_data', 'samples', 'chain_posts.json');
    fs.mkdirSync(path.dirname(postOutputPath), { recursive: true });
    fs.writeFileSync(postOutputPath, cleanedPostText, 'utf8');

    // ==========================================
    // STEP 4 — News (placeholder)
    // ==========================================

    // ==========================================
    // STEP 5 — Comment generation test
    // ==========================================
    const commentPromptPath = path.join(__dirname, 'prompts', 'comment.txt');
    if (!fs.existsSync(commentPromptPath)) {
      throw new Error(`Prompt file not found at ${commentPromptPath}`);
    }
    const commentPromptTemplate = fs.readFileSync(commentPromptPath, 'utf8');

    const testPosts = validPosts.slice(0, 2);
    console.log(`\nGenerating comments for first ${testPosts.length} posts (rate limit safe)...`);

    for (let i = 0; i < testPosts.length; i++) {
      const post = testPosts[i];

      console.log(`Waiting 8 seconds before comment call ${i + 1}...`);
      await wait(8000);

      let commentPrompt = commentPromptTemplate;
      commentPrompt = commentPrompt.replace('{{WORLD_CONTEXT}}', worldContext);
      commentPrompt = commentPrompt.replace('{{POST_CONTENT}}', post.content);
      commentPrompt = commentPrompt.replace('{{POST_AUTHOR_HANDLE}}', post.handle);
      commentPrompt = commentPrompt.replace(
        '{{PERSONA_HANDLES}}',
        personaHandles.filter(h => h !== post.handle).join(', ')
      );

      const commentResult = await model.generateContent(commentPrompt);
      const commentResponseText = commentResult.response.text();

      const cleanedCommentText = cleanJSONArray(commentResponseText);

      try {
        const parsedComments = JSON.parse(cleanedCommentText);
        console.log(`  ✓ Post ${i + 1} comments: ${parsedComments.length}`);

        const commentOutputPath = path.join(
          __dirname, 'mock_data', 'samples', `chain_comments_post_${i}.json`
        );
        fs.writeFileSync(commentOutputPath, JSON.stringify(parsedComments, null, 2), 'utf8');
      } catch (e) {
        console.log(`  ✗ Post ${i + 1} comments failed`);
      }
    }

    console.log(`Comments generated for 2/10 posts (rate limit safe test)`);

    // ==========================================
    // Final Summary
    // ==========================================
    console.log("================================");
    console.log("CHAIN COMPLETE");
    console.log("World: " + world.name);
    console.log("Era: " + world.era);
    console.log("Events: " + world.events.length);
    console.log("Personas: " + personas.length);
    console.log("Posts: " + validPosts.length);
    console.log("Comments tested: 2 posts");
    console.log("================================");

  } catch (error) {
    console.error("Fatal error: " + error.message);
    process.exit(1);
  }
}

main();
