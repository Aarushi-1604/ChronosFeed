const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load GEMINI_API_KEY from .env file in the same folder
require('dotenv').config({ path: path.join(__dirname, '.env') });

function cleanJSON(text) {
  let cleaned = text.trim();
  // Remove markdown fences
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\n?\s*```$/, '').trim();
  }
  // Find first [
  const firstBracket = cleaned.indexOf('[');
  if (firstBracket !== -1) {
    cleaned = cleaned.substring(firstBracket);
  }
  // Find last ]
  const lastBracket = cleaned.lastIndexOf(']');
  if (lastBracket !== -1) {
    cleaned = cleaned.substring(0, lastBracket + 1);
  }
  return cleaned;
}

function validatePosts(parsed, personaHandles) {
  const errors = [];
  if (!Array.isArray(parsed)) {
    errors.push("Not an array");
    return { valid: false, errors };
  }
  if (parsed.length !== 10) {
    errors.push(`Expected exactly 10 posts, got ${parsed.length}`);
  }
  
  const handleCounts = {};
  personaHandles.forEach(h => { handleCounts[h] = 0; });

  parsed.forEach((post, i) => {
    const prefix = `Post [${i}]`;
    if (!post || typeof post !== 'object') {
      errors.push(`${prefix}: is not an object`);
      return;
    }
    // Check keys
    const requiredKeys = ['handle', 'content', 'media_type', 'likes_count', 'reposts_count'];
    requiredKeys.forEach(k => {
      if (post[k] === undefined) {
        errors.push(`${prefix}: missing key '${k}'`);
      }
    });

    if (post.handle !== undefined) {
      if (!personaHandles.includes(post.handle)) {
        errors.push(`${prefix}: handle '${post.handle}' is not in allowed persona handles list`);
      } else {
        handleCounts[post.handle] = (handleCounts[post.handle] || 0) + 1;
      }
    }

    if (post.media_type !== undefined && post.media_type !== 'TEXT') {
      errors.push(`${prefix}: media_type must be 'TEXT', got '${post.media_type}'`);
    }

    if (post.likes_count !== undefined) {
      if (!Number.isInteger(post.likes_count) || post.likes_count < 10 || post.likes_count > 50000) {
        errors.push(`${prefix}: likes_count (${post.likes_count}) must be an integer between 10 and 50000`);
      }
    }

    if (post.reposts_count !== undefined) {
      if (!Number.isInteger(post.reposts_count) || post.reposts_count < 1 || post.reposts_count > 5000) {
        errors.push(`${prefix}: reposts_count (${post.reposts_count}) must be an integer between 1 and 5000`);
      }
    }

    if (post.content !== undefined) {
      if (typeof post.content !== 'string') {
        errors.push(`${prefix}: content must be a string`);
      } else {
        const sentences = post.content.split(/[.!?]+(?:\s|$)/).filter(s => s.trim().length > 0);
        if (sentences.length < 1 || sentences.length > 4) {
          errors.push(`${prefix}: content must be 1-4 sentences, got ${sentences.length}`);
        }
      }
    }
  });

  // Verify no single persona has more than 4 posts
  Object.keys(handleCounts).forEach(h => {
    if (handleCounts[h] > 4) {
      errors.push(`Handle '${h}' has more than 4 posts (${handleCounts[h]} posts)`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

async function main() {
  try {
    // 3. Reads ai-lab/mock_data/samples/persona_latest.json
    const personaPath = path.join(__dirname, 'mock_data', 'samples', 'persona_latest.json');
    if (!fs.existsSync(personaPath)) {
      throw new Error(`Persona file not found at ${personaPath}`);
    }
    const personasText = fs.readFileSync(personaPath, 'utf8');

    // 4. Parses it to get an array of personas
    const personas = JSON.parse(personasText);

    // 5. Builds: const personaHandles = personas.map(p => p.handle)
    const personaHandles = personas.map(p => p.handle);

    // 6. Reads ai-lab/prompts/post.txt
    const templatePath = path.join(__dirname, 'prompts', 'post.txt');
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Prompt file not found at ${templatePath}`);
    }
    const promptTemplate = fs.readFileSync(templatePath, 'utf8');

    // 7. Replaces {{WORLD_CONTEXT}}
    let completedPrompt = promptTemplate.replace(
      '{{WORLD_CONTEXT}}',
      "World: The Victorian Web. Era: Victorian Cyberpunk. Prompt: What if the internet was invented in 1890?"
    );

    // 8. Replaces {{PERSONA_HANDLES}} (using replace all or split/join)
    completedPrompt = completedPrompt.split('{{PERSONA_HANDLES}}').join(personaHandles.join(', '));

    // 9. Calls Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    const result = await model.generateContent(completedPrompt);
    const responseText = result.response.text();

    // 10. Cleans response
    const cleanedText = cleanJSON(responseText);

    // 11. JSON.parse the result
    const parsed = JSON.parse(cleanedText);

    // 12. If valid
    console.log("✓ Valid JSON array");
    console.log("Post count: " + parsed.length);

    parsed.forEach(post => {
      console.log("@" + post.handle + ": " + post.content.slice(0, 60) + "...");
    });

    // Verify every post.handle exists in personaHandles
    let allHandlesValid = true;
    parsed.forEach((post, i) => {
      if (!personaHandles.includes(post.handle)) {
        allHandlesValid = false;
        console.log(`✗ Post [${i}] handle '${post.handle}' is invalid`);
      }
    });

    if (allHandlesValid) {
      console.log("✓ All handles valid");
    }

    // Verify schema
    const validation = validatePosts(parsed, personaHandles);
    if (validation.valid) {
      console.log("✓ Schema valid");
    } else {
      console.log("✗ Schema validation failed:");
      validation.errors.forEach(err => console.log(` - ${err}`));
    }

    // 13. Save output to: mock_data/samples/posts_latest.json
    const outputPath = path.join(__dirname, 'mock_data', 'samples', 'posts_latest.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, cleanedText, 'utf8');
    console.log(`Saved output to ${outputPath}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
