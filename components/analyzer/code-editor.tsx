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
      <p className="text-gray-300 bg-white">Hard to read summary</p>
      <div onClick={() => alert("clicked")}>Click me</div>
      <button className="h-4 w-4"><CloseIcon /></button>
      <input type="text" placeholder="Email" />
    </div>
  );
}`;

const codeMirrorLayoutExtension = EditorView.theme({
  "&": { width: "100%", maxWidth: "100%" },
  ".cm-scroller": { overflow: "auto" },
});

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
        "h-[min(400px,50vh)] w-full min-w-0 overflow-hidden rounded-md border border-border",
        className,
      )}
    >
      <CodeMirror
        value={value || defaultSample}
        height="100%"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        extensions={[
          javascript({ jsx: true, typescript: true }),
          codeMirrorLayoutExtension,
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

export { defaultSample, codeMirrorLayoutExtension };
