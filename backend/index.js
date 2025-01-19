const express = require('express');
const cors = require('cors'); 
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY);

app.use(cors());

app.use(express.json());

app.post('/api/runcode', async (req, res) => {
    const { script } = req.body;

    if (!script || typeof script !== 'string') {
        return res.status(400).json({ success: false, error: "'script' is required and should be a valid string." });
    }

    const requestData = {
        clientId: "98f3dea44343f343f4b8bcfa2dafd63a",
        clientSecret: "9f10f70ac88318b617258bfde56a1f2e58ec20dec9f96e2b6bc3546eebf9ece8",
        script, // Pass the user's code from the request
        language: "python3", // Default to Python
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
app.post('/analysescore', async (req, res) => {
  const {script,currentQuestion} = req.body;
  const prompt = `
    Analyse the ${script} written by the student with the ${currentQuestion}, and give score out of 100 
    
    Example output string:
        timecomplexity: the time complexity if around O(n) you can do in better way with this method(tell some optimized hint here),
        hint: (give some hint)
        score: 52 (out of 100)
    
    output should be plain string
      
  `;

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

app.listen(3000, () => {
    console.log("Server Running on port 3000");
});
