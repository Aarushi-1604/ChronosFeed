const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load GEMINI_API_KEY from .env file in the same folder
require('dotenv').config({ path: path.join(__dirname, '.env') });

function cleanJSON(text) {
  let cleaned = text.trim();
  // Removes markdown code fences: strips ```json and ``` from start/end
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\n?\s*```$/, '').trim();
  }
  // If the text starts with any characters before the first {, strips everything before the first {
  const firstBrace = cleaned.indexOf('{');
  if (firstBrace !== -1) {
    cleaned = cleaned.substring(firstBrace);
  }
  // If the text ends with any characters after the last }, strips everything after the last }
  const lastBrace = cleaned.lastIndexOf('}');
  if (lastBrace !== -1) {
    cleaned = cleaned.substring(0, lastBrace + 1);
  }
  return cleaned;
}

function validateWorldSchema(obj) {
  const errors = [];
  if (!obj || typeof obj !== 'object') {
    errors.push('valid JSON object');
    return { valid: false, errors };
  }

  const requiredTopKeys = ['name', 'summary', 'era', 'tech_level', 'gov_type', 'events'];
  requiredTopKeys.forEach(key => {
    if (obj[key] === undefined) {
      errors.push(`top-level key '${key}'`);
    }
  });

  if (!Array.isArray(obj.events)) {
    errors.push('events array');
  } else {
    if (obj.events.length === 0) {
      errors.push('at least 1 event item');
    } else {
      const firstEvent = obj.events[0];
      const requiredEventKeys = ['year', 'title', 'description', 'impact'];
      requiredEventKeys.forEach(key => {
        if (!firstEvent || firstEvent[key] === undefined) {
          errors.push(`event key '${key}'`);
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

async function main() {
  try {
    // 1. Read the prompt template
    const templatePath = path.join(__dirname, 'prompts', 'world_genesis.txt');
    const promptTemplate = fs.readFileSync(templatePath, 'utf8');

    // 2. Replace the {{USER_PROMPT}} placeholder
    const completedPrompt = promptTemplate.replace('{{USER_PROMPT}}', 'What if the internet was invented in 1890?');

    // 3. Call the Gemini API with the completed prompt
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(completedPrompt);
    const responseText = result.response.text();

    // 4. Print the raw response text to the console
    console.log(responseText);

    // 5. Attempt to parse the response as JSON (using cleanJSON first)
    const cleanedText = cleanJSON(responseText);
    let parsed;
    let parseFailed = false;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (e) {
      parseFailed = true;
    }

    // 6. If parsing succeeds / 7. If parsing fails
    if (!parseFailed) {
      console.log('✓ Valid JSON');
      console.log('Keys found:', Object.keys(parsed));
      console.log('Events count:', Array.isArray(parsed.events) ? parsed.events.length : 0);
      console.log('World name:', parsed.name);

      // After successful parse, call validateWorldSchema(parsed)
      const validation = validateWorldSchema(parsed);
      if (!validation.valid) {
        // If validation fails, print each error in the errors array prefixed with: "Missing: "
        validation.errors.forEach(err => {
          console.log(`Missing: ${err}`);
        });
      } else {
        // If validation passes, print: "✓ Schema valid"
        console.log('✓ Schema valid');
      }

      // Save the cleaned raw response to: ai-lab/mock_data/samples/world_genesis_latest.json
      const outputPath = path.join(__dirname, 'mock_data', 'samples', 'world_genesis_latest.json');
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, cleanedText, 'utf8');

    } else {
      console.log('✗ Invalid JSON - parsing failed');
      console.log('Raw response:', responseText.slice(0, 500));
    }
  } catch (error) {
    // 9. In the catch block, print "Error:" followed by the error message and exit with code 1
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
