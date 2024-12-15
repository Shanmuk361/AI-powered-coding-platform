import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CodeEditor } from '../components/CodeEditor';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

// Mock questions (replace with actual API call)
const mockQuestions = [
  {
    id: 1,
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    category: "Arrays",
    testCases: ["[2,7,11,15], target = 9"],
    expectedOutputs: ["[0,1]"]
  },
  // Add more mock questions...
];

export const TestPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, difficulty, questionCount } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState(mockQuestions);
  const [code, setCode] = useState<string>(`#include <iostream>\nusing namespace std;\n
int main(){
  //code here
  return 0;
}`);
  const [output, setOutput] = useState('');

  useEffect(() => {
    // Replace with actual API call
    setQuestions(mockQuestions.slice(0, questionCount));
  }, [questionCount]);

  const currentQuestion = questions[currentQuestionIndex];


  // {
  //   "script": "print('Hello')",
  //   "stdin": "Peter\n",
  //   "language": "python3",
  //   "versionIndex": 3,
  //   "compileOnly": false,
  //   "clientId": "98f3dea44343f343f4b8bcfa2dafd63a",
  //   "clientSecret": "9f10f70ac88318b617258bfde56a1f2e58ec20dec9f96e2b6bc3546eebf9ece8"
  // }

  

  const handleRunCode = async () => {
    // write all the below logic in express and integrate
    try {
  const requestData = {
    clientId: "98f3dea44343f343f4b8bcfa2dafd63a",
    clientSecret: "9f10f70ac88318b617258bfde56a1f2e58ec20dec9f96e2b6bc3546eebf9ece8",
    script: code, // Replace with your Python code string
    language: "python",
    versionIndex: "3", // Ensure you use the correct version index for Python
    compileOnly: false,
  };

  const response = await fetch("https://api.jdoodle.com/v1/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json(); // Correctly parse the JSON response
  console.log("Execution Response:", data);

  // Check if execution was successful
  if (data.output) {
    console.log("Output:", data.output);
  } else {
    console.error("Error/Exception:", data.error || data.exception);
  }
} catch (error) {
  console.error("Error while executing code:", error);
}

  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium
              ${difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'}`}>
              {difficulty}
            </span>
          </div>
          
          <h2 className="text-xl font-semibold mb-2">{currentQuestion?.title}</h2>
          <p className="text-gray-600 mb-4">{currentQuestion?.description}</p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Test Cases:</h3>
            <pre className="text-sm">{currentQuestion?.testCases.join('\n')}</pre>
          </div>
        </div>

        <CodeEditor
          code={code}
          onChange={setCode}
          onRun={handleRunCode}
          output={output}
        />

        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === questions.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};