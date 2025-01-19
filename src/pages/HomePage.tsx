import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopicSelector } from '../components/TopicSelector';
import { LeaderBoard } from '../components/LeaderBoard';
import { Brain } from 'lucide-react';
import NameInputComponent from '../components/NameInputComponent';
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [questionCount, setQuestionCount] = useState(5);

  const handleStartTest = () => {
    if (!selectedTopic) {
      alert('Please select a topic');
      return;
    }
    navigate('/test', {
      state: { topic: selectedTopic, difficulty, questionCount },
    });
  };

  return (
    <>
    <div>
    <NameInputComponent>
    </NameInputComponent>

    </div>
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Brain className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Coding Practice Platform
          </h1>
          <p className="text-lg text-gray-600">
            Select your topic, set your preferences, and start coding!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4">Select Topic</h2>
              <TopicSelector
                selectedTopic={selectedTopic}
                onSelectTopic={setSelectedTopic}
              />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4">Test Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <button
                  onClick={handleStartTest}
                  className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Start Test
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <LeaderBoard />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};