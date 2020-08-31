import * as vscode from "vscode";
import WebviewPanel from "./webView";
import { AuthProvider } from "./store/authentication";

export function activate(context: vscode.ExtensionContext) {
  const provider = new AuthProvider();
  provider.initialize(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("extension.openCodeboard", async () => {
      const octokit = await provider.getOctokit();
      const data = await octokit(`{
      viewer {
        projects(first: 100) {
      	nodes {
          id
          name
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
      // @ts-ignore
      const projects = data.viewer.projects.nodes.map((project: any) => ({
        title: project.name,
        description: project.body,
        label: "",
        lanes: project.columns.nodes.map((column: any) => ({
          title: column.name,
          label: "",
          cards: column.cards.nodes.map((card: any) => ({
            note: card.note,
          })),
        })),
      }));

      const projectItems = projects.map((project: any) => {
        return {
          label: `$(project) ${project.title}`,
          description: project.description,
          project,
        };
      });

      const response = await vscode.window.showQuickPick(
        projectItems as vscode.QuickPickItem[],
        {
          placeHolder: "Select the project board to open",
        }
      );

      if (!response) {
        return;
      }

      // @ts-ignore
      new WebviewPanel(context, response.project);
    })
  );
}
