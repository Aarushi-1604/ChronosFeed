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
  // If the text starts with any characters before the first [, strips everything before the first [
  const firstBracket = cleaned.indexOf('[');
  if (firstBracket !== -1) {
    cleaned = cleaned.substring(firstBracket);
  }
  // If the text ends with any characters after the last ], strips everything after the last ]
  const lastBracket = cleaned.lastIndexOf(']');
  if (lastBracket !== -1) {
    cleaned = cleaned.substring(0, lastBracket + 1);
  }
  return cleaned;
}

function validatePersonaSchema(arr) {
  const errors = [];
  if (!Array.isArray(arr)) {
    errors.push('Output is not a valid JSON array');
    return { valid: false, errors };
  }
  if (arr.length !== 5) {
    errors.push(`Expected exactly 5 persona objects, got ${arr.length}`);
  }
  arr.forEach((persona, index) => {
    const prefix = `Persona [${index}]`;
    if (!persona || typeof persona !== 'object') {
      errors.push(`${prefix}: is not an object`);
      return;
    }
    
    // Required keys
    const requiredKeys = [
      'name', 'handle', 'bio', 'role', 
      'followers_count', 'following_count', 
      'influence_score', 'interests', 'personality'
    ];
    requiredKeys.forEach(key => {
      if (persona[key] === undefined) {
        errors.push(`${prefix}: missing key '${key}'`);
      }
    });

    // Handle validation
    if (typeof persona.handle === 'string') {
      if (persona.handle !== persona.handle.toLowerCase()) {
        errors.push(`${prefix}: handle '${persona.handle}' is not lowercase`);
      }
      if (!/^[a-z0-9_]+$/.test(persona.handle)) {
        errors.push(`${prefix}: handle '${persona.handle}' contains invalid characters (must be lowercase letters, numbers, and underscores only)`);
      }
      if (persona.handle.includes('@')) {
        errors.push(`${prefix}: handle '${persona.handle}' contains '@' symbol`);
      }
      if (persona.handle.length > 20) {
        errors.push(`${prefix}: handle '${persona.handle}' exceeds 20 characters`);
      }
    } else if (persona.handle !== undefined) {
      errors.push(`${prefix}: handle is not a string`);
    }

    // Role validation
    const allowedRoles = ['INFLUENCER', 'SCIENTIST', 'POLITICIAN', 'BRAND'];
    if (persona.role !== undefined && !allowedRoles.includes(persona.role)) {
      errors.push(`${prefix}: role '${persona.role}' is invalid, must be one of: ${allowedRoles.join(', ')}`);
    }

    // Followers count validation
    if (persona.followers_count !== undefined) {
      if (!Number.isInteger(persona.followers_count) || persona.followers_count < 500 || persona.followers_count > 500000) {
        errors.push(`${prefix}: followers_count (${persona.followers_count}) must be an integer between 500 and 500000`);
      }
    }

    // Following count validation
    if (persona.following_count !== undefined) {
      if (!Number.isInteger(persona.following_count) || persona.following_count < 50 || persona.following_count > 2000) {
        errors.push(`${prefix}: following_count (${persona.following_count}) must be an integer between 50 and 2000`);
      }
    }

    // Influence score validation
    if (persona.influence_score !== undefined) {
      if (!Number.isInteger(persona.influence_score) || persona.influence_score < 1 || persona.influence_score > 100) {
        errors.push(`${prefix}: influence_score (${persona.influence_score}) must be an integer between 1 and 100`);
      }
    }

    // Interests validation
    if (persona.interests !== undefined) {
      if (!Array.isArray(persona.interests)) {
        errors.push(`${prefix}: interests is not an array`);
      } else {
        if (persona.interests.length < 3 || persona.interests.length > 5) {
          errors.push(`${prefix}: interests array must contain 3 to 5 items, got ${persona.interests.length}`);
        }
        persona.interests.forEach((interest, i) => {
          if (typeof interest !== 'string') {
            errors.push(`${prefix}: interest [${i}] is not a string`);
          }
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

async function main() {
  try {
    // 1. Read the prompt template
    const templatePath = path.join(__dirname, 'prompts', 'persona.txt');
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Prompt file not found at ${templatePath}`);
    }
    const promptTemplate = fs.readFileSync(templatePath, 'utf8');

    // 2. Read world context from world_genesis_latest.json if it exists, otherwise use fallback
    let worldContext = '';
    const worldGenesisPath = path.join(__dirname, 'mock_data', 'samples', 'world_genesis_latest.json');
    if (fs.existsSync(worldGenesisPath)) {
      worldContext = fs.readFileSync(worldGenesisPath, 'utf8');
    } else {
      // Find any file in mock_data/samples matching *_output.json
      const samplesDir = path.join(__dirname, 'mock_data', 'samples');
      let foundFile = false;
      if (fs.existsSync(samplesDir)) {
        const files = fs.readdirSync(samplesDir);
        const outputJson = files.find(f => f.endsWith('_output.json'));
        if (outputJson) {
          worldContext = fs.readFileSync(path.join(samplesDir, outputJson), 'utf8');
          foundFile = true;
        }
      }
      if (!foundFile) {
        worldContext = JSON.stringify({
          name: "Steam-powered Internet in 1890",
          summary: "An alternate-history world where Babbage's analytical engines were mass-produced in 1890, leading to a steam-powered global information grid.",
          era: "1890s",
          tech_level: "High-tech mechanical and steam computing.",
          gov_type: "Imperial monarchy",
          events: []
        });
      }
    }

    // 3. Replace the {{WORLD_CONTEXT}} placeholder
    const completedPrompt = promptTemplate.replace('{{WORLD_CONTEXT}}', worldContext);

    // 4. Call the Gemini API with the completed prompt
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const result = await model.generateContent(completedPrompt);
    const responseText = result.response.text();

    // 5. Attempt to parse the response as JSON (using cleanJSON first)
    const cleanedText = cleanJSON(responseText);
    let parsed;
    let parseFailed = false;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (e) {
      parseFailed = true;
    }

    if (!parseFailed) {
      console.log('✓ Valid JSON');
      console.log('Persona count:', Array.isArray(parsed) ? parsed.length : 0);

      const validation = validatePersonaSchema(parsed);
      if (!validation.valid) {
        validation.errors.forEach(err => {
          console.log(`Missing: ${err}`);
        });
      } else {
        console.log('✓ Schema valid');
      }

      // Save the cleaned response to: mock_data/samples/persona_latest.json
      const outputPath = path.join(__dirname, 'mock_data', 'samples', 'persona_latest.json');
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, cleanedText, 'utf8');
      console.log(`Saved output to ${outputPath}`);

    } else {
      console.log('✗ Invalid JSON - parsing failed');
      console.log('Raw response:', responseText.slice(0, 500));
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
