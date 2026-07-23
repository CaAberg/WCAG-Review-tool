import { describe, expect, it } from "vitest";
import {
  injectViewerBootstrap,
  rewriteHtmlForProxy,
} from "@/lib/a11y/proxy/rewrite-html";

describe("rewriteHtmlForProxy", () => {
  it("rewrites same-page links through the proxy route", () => {
    const html = `<html><body><a href="/about">About</a><img src="/logo.png" /></body></html>`;
    const rewritten = rewriteHtmlForProxy("https://example.com/home", html);

    expect(rewritten).toContain(
      'href="/page-analyzer/proxy?url=https%3A%2F%2Fexample.com%2Fabout"',
    );
    expect(rewritten).toContain(
      'src="/page-analyzer/proxy?url=https%3A%2F%2Fexample.com%2Flogo.png"',
    );
  });

  it("injects the viewer bootstrap script", () => {
    const html = "<html><body><p>Hello</p></body></html>";
    const injected = injectViewerBootstrap(html, "/page-analyzer/viewer-bootstrap.js");

    expect(injected).toContain('<script src="/page-analyzer/viewer-bootstrap.js" defer></script>');
  });
});
