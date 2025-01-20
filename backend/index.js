const express = require('express');
const cors = require('cors'); 
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const mongoose = require('mongoose');
const User = require('./models/Users'); 

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY);

app.use(cors());

app.use(express.json());

app.get('/api/top-users', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ score: -1 })
      .limit(5); 

    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top users', error: error.message });
  }
});

app.post('/add-user', async (req, res) => {
  const { name } = req.body;
  let { score } =req.body;
  // Check if name is provided
  if (score === undefined) {
    score = 0;
  }
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const newUser = new User({ name ,score });
    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/runcode', async (req, res) => {
    const { script } = req.body;

    if (!script || typeof script !== 'string') {
        return res.status(400).json({ success: false, error: "'script' is required and should be a valid string." });
    }

    const requestData = {
        clientId: "98f3dea44343f343f4b8bcfa2dafd63a",
        clientSecret: "9f10f70ac88318b617258bfde56a1f2e58ec20dec9f96e2b6bc3546eebf9ece8",
        script,
        language: "python3",
        compileOnly: false,
    };
    try {
        const response = await fetch("https://api.jdoodle.com/v1/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`JDoodle API error: ${errorText}`);
        }

        const data = await response.json();
        if (data.output) {
            res.status(200).json({ success: true, output: data.output });
        } else {
            res.status(200).json({ success: false, error: data.error || data.exception });
        }
    } catch (error) {
        console.error("Error while executing code:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Set up the model configuration
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' });

app.post('/generate-mock-questions', async (req, res) => {
    const {number, difficulty,category} = req.body;
    const prompt = `
      Generate a list of mock coding questions in JSON format string form. Each question should have:
      - id: unique integer
      - title: string (name of the problem)
      - description: string (detailed problem statement)
      - difficulty: string (Easy, Medium, Hard)
      - category: string (e.g., Arrays, Strings, Graphs)
      - testCases: array of strings (example inputs)
      - expectedOutputs: array of strings (expected outputs for the test cases)
      
      Example:
      [
        {
          id: 1,
          title: "Two Sum",
          description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          difficulty: "Easy",
          category: "Arrays",
          testCases: ["[2,7,11,15], target = 9"],
          expectedOutputs: ["[0,1]"]
        }
      ]
      
      Generate ${number} such questions with ${difficulty} difficulty and ${category} category.
    `;
  
    try {
      const result = await model.generateContent(prompt);
      const jsonText = result.response.candidates[0].content.parts[0].text;
        
        // Remove the markdown code block markers and parse JSON
        const cleanJson = jsonText.replace(/```json\n|\n```/g, '');
        const questions = JSON.parse(cleanJson);
        
        // Send the parsed questions array
        res.send(questions);
        console.log(jsonText);

      
      // Send the generated questions back to the client
      // res.send(result);
      // console.log(result);
      // res.json(result.response.text());
      // console.log(result.response.text())
    } catch (error) {
      console.error("Failed to fetch mock questions:", error);
      res.status(500).json({ error: "Failed to generate questions", message: error.message });
    }
  });

// analyse code and response api through gemini api
app.post('/analysescore', async (req, res) => {
  const {script,currentQuestion} = req.body;
  const prompt = `
  Analyze this programming solution:
  STUDENT CODE:
  ${script}

  PROBLEM:
  Title: ${currentQuestion.title}
  Description: ${currentQuestion.description}
  Expected Output: ${currentQuestion.expectedOutputs.join('\n')}

  Provide a concise analysis in this exact format:
  Analysis: Evaluate the solution's correctness, implementation quality, and potential issues.
  timecomplexity: State the current time complexity using Big O notation. If suboptimal, specify a better approach.
  hint: Provide one specific, actionable improvement suggestion.

  Rules for analysis:
  - Keep feedback constructive and specific
  - Focus on algorithmic efficiency and code quality
  - If optimal solution exists, mention it briefly
  - Highlight both strengths and areas for improvement
  - Suggest practical optimization techniques

  Example response format:
  Analysis: The solution correctly handles edge cases but uses excessive memory.
  timecomplexity: Current O(n²) can be optimized to O(n log n) using heap.
  hint: Consider using a min-heap to reduce sorting overhead`;

  
  try {
    // Generate content using the Gemini model
    const result = await model.generateContent(prompt);

    // Send the generated questions back to the client
    res.json(result.response.text());
    console.log(result.response.text())
  } catch (error) {
    console.error("Failed to fetch mock questions:", error);
    res.status(500).json({ error: "Failed to generate questions", message: error.message });
  }
});

// analyse code and response api through gemini api
app.post('/updateaiscore', async (req, res) => {
  const { difficulty, name, script, currentQuestion } = req.body;

  // Validate request body
  if (!name || !script || !currentQuestion) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Name, script, and currentQuestion are required'
    });
  }

  const prompt = `
Evaluate the following code solution and return a JSON response with scores and feedback.

STUDENT CODE:
${script}

PROBLEM:
${currentQuestion}

Evaluate the solution based on these criteria and return a JSON object with the following structure:
{
  "overallScore": number (0-100)
}

Scoring criteria:
- Based on ${difficulty}
- Absolute zero score if code is incomplete or doesn't return an expected answer
- Correctness (25pts): Does it produce the expected output?
- Efficiency (25pts): How optimal is the time/space complexity?
- Code Quality (25pts): Is the code clean, readable, and well-structured?
- Problem Solving (25pts): Does it demonstrate good problem-solving approach?

Return ONLY the JSON object with no additional text or explanation.`;

  try {
    // Generate AI score
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response and extract score
    let score;
    try {
      const jsonResponse = JSON.parse(response);
      score = jsonResponse.overallScore;
    } catch (parseError) {
      // Attempt regex extraction if JSON parse fails
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const extractedJson = JSON.parse(jsonMatch[0]);
        score = extractedJson.overallScore;
      } else {
        throw new Error('Failed to parse score from AI response');
      }
    }

    // Validate score
    if (typeof score !== 'number' || score < 0 || score > 100) {
      throw new Error('Invalid score value received from AI');
    }

    try {
      // Try to find existing user
      let user = await User.findOne({ name });

      if (user) {
        // Update existing user's score
        user.score += score;
        await user.save();
      } else {
        // Create new user if doesn't exist
        user = new User({
          name,
          score
        });
        await user.save();
      }

      // Return updated user data
      res.json({
        success: true,
        user: {
          name: user.name,
          score: user.score,
          createdAt: user.createdAt
        },
        addedScore: score
      });

    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      res.status(500).json({
        error: 'Database operation failed',
        message: dbError.message
      });
    }

  } catch (error) {
    console.error('Score generation failed:', error);
    res.status(500).json({
      error: 'Score generation failed',
      message: error.message
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});

