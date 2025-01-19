import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CodeEditor } from '../components/CodeEditor';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// const mockQuestions = [
//   {
//     id: 1,
//     title: "Two Sum",
//     description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
//     difficulty: "Easy",
//     category: "Arrays",
//     testCases: ["[2,7,11,15], target = 9"],
//     expectedOutputs: ["[0,1]"]
//   },
//   {
//     id: 2,
//     title: "Three Sum",
//     description: "Find all unique triplets in the array that sum up to zero.",
//     difficulty: "Medium",
//     category: "Arrays",
//     testCases: ["[-1, 0, 1, 2, -1, -4]"],
//     expectedOutputs: "[[-1, -1, 2], [-1, 0, 1]]"
//   },
//   // More mock questions...
// ];

export const TestPage: React.FC = () => {
  const location = useLocation();
  //const navigate = useNavigate();
  const { topic, difficulty, questionCount } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [code, setCode] = useState<string>(`def main(input):\n  #code here`);
  const [output, setOutput] = useState('');
  const [assess,setassessed]=useState('');
  // Fetching questions on initial load or dependency change
  useEffect(() => {
    const fetchQuestions = async () => {
      const requestData = {
        category: topic,
        difficulty: difficulty,
        number: questionCount,
      };

      try {
        const response = await fetch('http://localhost:3000/generate-mock-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }).then((res)=>{
          return res.json();
        });
        const extractJsonList = (str) => {
          // Match the JSON array (from [ to ])
          const match = str.match(/\[.*\]/s); // The 's' flag allows dot (.) to match newlines as well
          return match ? JSON.parse(match[0]) : [];  // Return the JSON list or an empty string if not found
        };
        
        const result = extractJsonList(response);
        console.log(result);
        setQuestions(result); // Update state with fetched questions
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [questionCount, difficulty, topic]);

  const currentQuestion = questions[currentQuestionIndex];

  const analysefunction = async () => {
    const requestData = {
      script: code,
      currentQuestion: currentQuestion
    };

    try {
      const response = await fetch('http://localhost:3000/analysescore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      }).then((res)=>{
        return res.json();
      });
      const output = response.replace(/^```|```$/g, "");
      
      setassessed(output);
      // Update state with fetched questions
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleRunCode = async () => {
    try {
        const requestData = { script: code }; // Pass the code string from user input
        
        const response = await fetch("http://localhost:3000/api/runcode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "An error occurred");
        }

        const data = await response.json();
        if (data.success) {
            setOutput(data.output); // Update the state with the output
        } else {
            setOutput(`Error: ${data.error}`); // Display error
        }
    } catch (err) {
        console.error("Error in handleRunCode:", err.message);
        setOutput(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {questions.length > 0 ? (
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
            
            <h2 className="text-xl font-semibold mb-2">{currentQuestion.title}</h2>
            <p className="text-gray-600 mb-4">{currentQuestion.description}</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Test Cases:</h3>
              <pre className="text-sm">{currentQuestion.testCases.join('\n')}</pre>
            </div>
          </div>
        ) : (
          <p>Loading questions...</p>
        )}

        <CodeEditor
          code={code}
          onChange={setCode}
          onRun={handleRunCode}
          output={output}
          clickanalyse={analysefunction}
          assessed={assess}
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
