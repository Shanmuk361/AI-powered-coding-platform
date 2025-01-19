import React from 'react';
import Editor from '@monaco-editor/react';
import { Play } from 'lucide-react';


interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  clickanalyse: () => void;
  output: string;
  assessed: string
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  output,
  clickanalyse,
  assessed
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b p-4 flex flex-row justify-between items-center">
          <h3 className="font-semibold">Python Code Editor</h3>
          
          <button
            onClick={onRun}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            Run Code
          </button>
        </div>
        <div className="bg-gray-900 text-white p-4 rounded-lg md-5">
        <h3 className="text-sm text-gray-400 mb-2">Output:</h3>
        <pre className="font-mono text-sm">{output || 'Run the code to see the output'}</pre>        
        </div>

        <br />
        <Editor
          height="400px"
          language="python" 
          value={code}
          onChange={(value) => onChange(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            autoClosingBrackets: 'always',
            autoIndent: 'full',
          }}
        />
        <div className="flex justify-end m-4">
            <button
            onClick={clickanalyse}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                <Play className="w-4 h-4" />
                    Get Hint
          </button>
        </div>
      </div>
      <div className="bg-gray-300 text-white p-4 rounded-lg">
         <pre 
            className="font-mono text-sm overflow-x-auto whitespace-pre-wrap break-words"
              >
              {assessed || ''}
          </pre>        
      </div>

    </div>
  );
};
