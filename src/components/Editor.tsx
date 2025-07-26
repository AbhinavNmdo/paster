"use client";

import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { FC } from "react";
import { Loader2 } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: OnChange;
  language?: string;
}

export const Editor: FC<CodeEditorProps> = ({
  value,
  onChange,
  language = "plaintext",
}) => {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // You can add any custom editor configurations here
    editor.focus();
  };

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-input focus-within:ring-2 focus-within:ring-ring">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        loading={<Loader2 className="h-8 w-8 animate-spin text-primary" />}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 14,
          fontFamily: "'Source Code Pro', monospace",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          padding: {
            top: 16,
            bottom: 16,
          },
        }}
      />
    </div>
  );
};
