import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** Instructions for loading the WCAG Access browser extension. */
export function ExtensionInstallCard() {
  return (
    <Card id="extension">
      <CardHeader>
        <CardTitle>Browser extension</CardTitle>
        <CardDescription>
          Scan pages you are already viewing — including localhost, staging, and
          login-protected sites — without sending the URL to our server.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Build the extension:{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              npm run build:extension
            </code>
          </li>
          <li>
            Open{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              chrome://extensions
            </code>{" "}
            in Chrome or Edge.
          </li>
          <li>Enable Developer mode.</li>
          <li>
            Click <strong>Load unpacked</strong> and select the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              extension/dist
            </code>{" "}
            folder from this repository.
          </li>
          <li>
            Open any page, click the WCAG Access extension icon, and choose{" "}
            <strong>Scan this page</strong>.
          </li>
        </ol>
        <p className="mt-4 text-sm text-muted-foreground">
          See <code className="text-xs">extension/README.md</code> for details.
        </p>
      </CardContent>
    </Card>
  );
}
