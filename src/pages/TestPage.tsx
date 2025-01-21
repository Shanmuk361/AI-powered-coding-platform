import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CodeEditor } from '../components/CodeEditor';
import {  ChevronRight } from 'lucide-react';
// ChevronLeft,
export const TestPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, topic, difficulty, questionCount } = location.state || {};

  const endHandle = async () => {
    const requestData = { difficulty, name, script: code, currentQuestion };
    try {
      const response = await fetch('http://localhost:3000/updateaiscore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      const output = await response.json();
      console.log(output);
    } catch (error) {
      console.error('Error analyzing code:', error);
    }
    // Navigate to the root page
    navigate('/');
  };
  useEffect(() => {
    if (!topic) {
      navigate('/'); 
    }
  }, [topic, navigate]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [code, setCode] = useState<string>(`class Solution:\n  def main(input):\n    #code here`);
  const [output, setOutput] = useState('');
  const [assess, setAssess] = useState('');

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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
        const result = await response.json();
        setQuestions(result); // Set questions state
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [topic, difficulty, questionCount]);

  const currentQuestion = questions[currentQuestionIndex];
  const [score, setScore] = useState(0);
  
  
  
useEffect(() => {
  const fetchScore = async () => {
    
    try {
      const response = await fetch(`http://localhost:3000/userscore/${name}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch score');
      }

      const result = await response.json();
      setScore(result.score);
    } catch (error) {
      console.error('Error fetching score:', error);
    } 
  };

  fetchScore();
}, [currentQuestion, name]);

  // Analyze code function
  const analysefunction = async () => {
    const requestData = { script: code, currentQuestion };
    try {
      const response = await fetch('http://localhost:3000/analysescore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      const output = await response.json();
      setAssess(output.replace(/^```|```$/g, ""));
    } catch (error) {
      console.error('Error analyzing code:', error);
    }
  };

  // Handle running the code
  const handleRunCode = async () => {
    try {
      const requestData = { script: code };
      const response = await fetch("http://localhost:3000/api/runcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "An error occurred");
      }

      const data = await response.json();
      setOutput(data.success ? data.output : `Error: ${data.error}`);
    } catch (err) {
      console.error("Error in handleRunCode:", err.message);
      setOutput(`Error: ${err.message}`);
    }
  };

  const handlesubmit = async () => {
    const requestData = { difficulty, name, script: code, currentQuestion };
    try {
      const response = await fetch('http://localhost:3000/updateaiscore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      const output = await response.json();
      console.log(output);
    } catch (error) {
      console.error('Error analyzing code:', error);
    }
    
    setCode(`class Solution:\n  def main(input):\n    #code here`);
    setAssess('');
    setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Coding Assessment</h1>
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-600">Current Score:</span>
            <span className="ml-2 text-xl font-bold text-blue-600">{score}</span>
          </div>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="flex-grow flex">
        {/* Left Panel - Question Details */}
        <div className="w-5/12 h-full bg-white shadow-sm flex flex-col">
          {questions.length > 0 ? (
            <div className="h-full overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 z-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gray-800">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      difficulty === 'Easy'
                        ? 'bg-green-100 text-green-800'
                        : difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{currentQuestion?.title}</h3>
              </div>
  
              <div className="p-4 space-y-6">
                <div>
                  <p className="text-gray-600 mb-4">{currentQuestion?.description}</p>
                </div>
  
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Test Cases:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {currentQuestion?.testCases.join('\n')}
                    </pre>
                  </div>
                </div>
  
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Expected Outputs:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {currentQuestion?.expectedOutputs.join('\n')}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Loading questions...</p>
            </div>
          )}
        </div>
  
        {/* Right Panel - Code Editor */}
        <div className="w-7/12 h-full bg-white shadow-sm flex flex-col">
          <div className="flex-grow">
            <CodeEditor
              code={code}
              onChange={setCode}
              onRun={handleRunCode}
              output={output}
              clickanalyse={analysefunction}
              assessed={assess}
            />
          </div>
  
          {/* Action Buttons */}
          <div className="p-4 flex justify-between items-center border-t">
            <button
              onClick={handlesubmit}
              disabled={currentQuestionIndex === questions.length - 1}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:hover:bg-blue-500 flex items-center gap-2"
            >
              Submit and Next
              <ChevronRight className="w-4 h-4" />
            </button>
  
            <button
              onClick={endHandle}
              className="px-6 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              END TEST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}  