import React from 'react';

const topics = [
  { id: 1, name: 'Arrays' },
  { id: 2, name: 'Dynamic Programming' },
  { id: 3, name: 'Data Structures'},
  { id: 4, name: 'Algorithms'},
  { id: 5, name: 'Graphs' },
  { id: 6, name: 'String Manipulation'},
];

interface TopicSelectorProps {
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  selectedTopic,
  onSelectTopic,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {topics.map(({ id, name}) => (
        <button
          key={id}
          onClick={() => onSelectTopic(name)}
          className={`p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all
            ${
              selectedTopic === name
                ? 'bg-indigo-600 text-white'
                : 'bg-white hover:bg-indigo-50'
            }`}
        > 
          <span className="font-medium">{name}</span>
        </button>
      ))}
    </div>
  );
};