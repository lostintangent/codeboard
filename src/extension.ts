import * as vscode from "vscode";
import WebviewPanel from "./webview";
import { AuthProvider } from "./store/authentication";

export function activate(context: vscode.ExtensionContext) {
  const provider = new AuthProvider();
  provider.initialize(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.openCodeboard", async () => {
      new WebviewPanel(context);
      const octokit = await provider.getOctokit();
      const {
        viewer: { projects },
      } = await octokit(`{
      viewer {
        projects(first: 100) {
      	nodes {
      	  body
      	  bodyHTML
      	  closed
      	  columns(first: 10) {
      		nodes {
      		  name
      		  cards(first: 50) {
      			nodes {
      			  note
      			}
      		  }
      		}
      	  }
      	}
        }
      }
      }`);
      console.log(projects);
    })
  );
}
