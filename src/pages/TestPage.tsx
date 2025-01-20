import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CodeEditor } from '../components/CodeEditor';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const TestPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, difficulty, questionCount } = location.state || {};
  
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

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Question Area */}
        {questions.length > 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h1>
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

            <h2 className="text-xl font-semibold mb-2">{currentQuestion.title}</h2>
            <p className="text-gray-600 mb-4">{currentQuestion.description}</p>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Test Cases:</h3>
              <pre className="text-sm">{currentQuestion.testCases.join('\n')}</pre>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Expected Outputs:</h3>
              <pre className="text-sm">{currentQuestion.expectedOutputs.join('\n')}</pre>
            </div>
          </div>
        ) : (
          <p>Loading questions...</p>
        )}

        {/* Code Editor Component */}
        <CodeEditor
          code={code}
          onChange={setCode}
          onRun={handleRunCode}
          output={output}
          clickanalyse={analysefunction}
          assessed={assess}
        />

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {/* <button
            onClick={() => {
              setCode(`class Solution:\n  def main(input):\n    #code here`);
              setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button> */}

          <button
            onClick={() => {
              setCode(`class Solution:\n  def main(input):\n    #code here`);
              setAssess('');
              setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}}
            disabled={currentQuestionIndex === questions.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm disabled:opacity-50"
          >
            Submit and Next
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex-grow"></div>
          <button
            onClick={handleRunCode}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md shadow-sm"
          >
            END
          </button>
        </div>
      </div>
    </div>
  );
};
