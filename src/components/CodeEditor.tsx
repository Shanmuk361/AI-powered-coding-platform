import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  output: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  output,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b p-4 flex justify-between items-center">
          <h3 className="font-semibold">C++ Code Editor</h3>
          <button
            onClick={onRun}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            Run Code
          </button>
        </div>
        <Editor
          height="400px"
          language="cpp"  // Set language to C++
          value={code}
          onChange={(value) => onChange(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            autoClosingBrackets: 'always',
            autoIndent: true,
          }}
        />
      </div>
      <div className="bg-gray-900 text-white p-4 rounded-lg">
        <h3 className="text-sm text-gray-400 mb-2">Output:</h3>
        <pre className="font-mono text-sm">{output || 'No output yet'}</pre>
      </div>
    </div>
  );
};
