"use client";

import MonacoEditor, { OnChange, OnMount } from "@monaco-editor/react";
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
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#101620', // A dark color that fits the theme
      },
    });
    monaco.editor.setTheme('custom-dark');
    editor.focus();
  };

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-input focus-within:ring-2 focus-within:ring-ring">
      <MonacoEditor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
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
          background: "transparent",
        }}
      />
    </div>
  );
};
