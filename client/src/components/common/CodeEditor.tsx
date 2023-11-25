import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { useState } from 'react';
import { copilot, copilotInit } from '@uiw/codemirror-theme-copilot';

type Props = {
  value: string;
  handleChange: (value: string) => void;
};
function CodeEditor({ value, handleChange }: Props) {
  // console.log("🚀 ===== CodeEditor ===== value:", value);
  return (
    <CodeMirror
      value={value}
      height="200px"
      extensions={[json()]}
      theme={copilot}
      onChange={(_value: string) => handleChange(_value)}
    />
  );
}
export default CodeEditor;
