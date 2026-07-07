"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  "aria-label"?: string;
};

const defaultSample = `export function BadExample() {
  return (
    <div>
      <h1>Dashboard</h1>
      <h3>Recent activity</h3>
      <img src="/chart.png" />
      <div onClick={() => alert("clicked")}>Click me</div>
      <button><CloseIcon /></button>
      <input type="text" placeholder="Email" />
    </div>
  );
}`;

/** CodeMirror editor for pasting TSX component code. */
export function CodeEditor({
  value,
  onChange,
  className,
  "aria-label": ariaLabel = "Component code editor",
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "overflow-hidden rounded-md border border-border",
        className,
      )}
    >
      <CodeMirror
        value={value || defaultSample}
        height="400px"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        extensions={[
          javascript({ jsx: true, typescript: true }),
          EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
        ]}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
        }}
      />
    </div>
  );
}

export { defaultSample };
