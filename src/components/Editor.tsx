"use client";

import MonacoEditor, { OnChange, OnMount } from "@monaco-editor/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Loader2 } from "lucide-react";
import type { editor } from "monaco-editor";

interface CodeEditorProps {
  value: string;
  onChange: OnChange;
  language?: string;
}

export interface EditorRef {
  getValue: () => string;
}

export const Editor = forwardRef<EditorRef, CodeEditorProps>(
  ({ value, onChange, language = "plaintext" }, ref) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
      monaco.editor.defineTheme('custom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#101620',
        },
      });
      monaco.editor.setTheme('custom-dark');
      editor.focus();
    };

    useImperativeHandle(ref, () => ({
      getValue: () => {
        return editorRef.current?.getValue() || "";
      },
    }));

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
            quickSuggestions: false,
            hover: {
              enabled: false
            },
            parameterHints: {
              enabled: false
            },
            renderValidationDecorations: 'off',
            suggestOnTriggerCharacters: false,
          }}
        />
      </div>
    );
  }
);
Editor.displayName = "Editor";
