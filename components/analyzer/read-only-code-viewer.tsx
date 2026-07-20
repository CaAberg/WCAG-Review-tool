"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { useTheme } from "next-themes";
import { codeMirrorLayoutExtension } from "@/components/analyzer/code-editor";
import { cn } from "@/lib/utils";

export type ReadOnlyCodeViewerProps = {
  value: string;
  className?: string;
  "aria-label"?: string;
};

/** Read-only CodeMirror viewer for saved audit code. */
export function ReadOnlyCodeViewer({
  value,
  className,
  "aria-label": ariaLabel = "Saved component code",
}: ReadOnlyCodeViewerProps) {
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
        value={value}
        height="100%"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        extensions={[
          javascript({ jsx: true, typescript: true }),
          codeMirrorLayoutExtension,
          EditorView.editable.of(false),
          EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
        ]}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: false,
          foldGutter: true,
        }}
      />
    </div>
  );
}
