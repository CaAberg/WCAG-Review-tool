declare module "@babel/standalone" {
  import type { TransformOptions, TransformResult } from "@babel/core";

  export function transform(
    code: string,
    options?: TransformOptions,
  ): TransformResult;
}

declare module "@babel/core" {
  export type PluginObj = {
    visitor?: Record<string, unknown>;
    name?: string;
  };

  export type TransformOptions = {
    presets?: string[];
    plugins?: unknown[];
    filename?: string;
  };

  export type TransformResult = {
    code?: string | null;
    map?: unknown;
  };
}
