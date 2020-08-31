import * as vscode from "vscode";
import * as path from "path";

const initialData = {
  lanes: [
    {
      id: "lane1",
      title: "Planned Tasks",
      label: "2/2",
      cards: [
        {
          note: "**Write Blog**\n\nCan AI make memes",
        },
        {
          note: "**Pay Rent**\n\nTransfer via NEFT",
        },
      ],
    },
    {
      id: "lane2",
      title: "Completed",
      label: "0/0",
      cards: [],
    },
  ],
};

class WebviewPanel {
  panel: vscode.WebviewPanel;

  constructor(context: vscode.ExtensionContext) {
    const buildPath = path.join(context.extensionPath, "webview", "build");
    this.panel = vscode.window.createWebviewPanel(
      "codeboardPanel",
      "Codeboard",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(buildPath)],
      }
    );
    this.panel.webview.html = getWebviewContent(buildPath);

    this.panel.webview.onDidReceiveMessage(
      (message) => this.onMessageFromWebview(message),
      undefined,
      context.subscriptions
    );
  }

  public sendUpdate(data: any) {
    this.panel.webview.postMessage(data);
  }

  onMessageFromWebview(message: any) {
    switch (message.type) {
      case "webview_status":
        if (message.data.status === "ready") {
          this.sendUpdate(initialData);
        }
        break;
      case "data_changed":
        console.log(message.data);
        break;
    }
  }
}

function getWebviewContent(buildPath: string) {
  const manifest = require(path.join(buildPath, "asset-manifest.json"));
  const entrypoints = manifest["entrypoints"];
  const stylePath = entrypoints.find((e: string) => e.endsWith(".css"));
  const styleUri = vscode.Uri.file(path.join(buildPath, stylePath)).with({
    scheme: "vscode-resource",
  });
  const scriptPaths = entrypoints.filter((e: string) => e.endsWith(".js"));
  const scriptUris = scriptPaths.map((p: string) =>
    vscode.Uri.file(path.join(buildPath, p)).with({ scheme: "vscode-resource" })
  );
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <meta http-equiv="Content-Security-Policy"
        content="default-src 'none';
        img-src https: vscode-webview-resource: vscode-resource:;
        script-src-elem 'unsafe-inline' https: vscode-webview-resource:;
        style-src-elem 'unsafe-inline' https: vscode-webview-resource:;
        script-src 'unsafe-inline' https: vscode-resource:;
        style-src 'unsafe-inline' https: vscode-resource:;"/>

    <title>React App</title>

    <link rel="stylesheet" type="text/css" href="${styleUri}">
    <base href="${vscode.Uri.file(buildPath).with({
      scheme: "vscode-resource",
    })}/">
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>

    <script src="${scriptUris[0]}"></script>
    <script src="${scriptUris[1]}"></script>
    <script src="${scriptUris[2]}"></script>
  </body>
</html>`;
}

export default WebviewPanel;
