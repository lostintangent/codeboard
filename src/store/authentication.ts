import * as vscode from "vscode";
import { graphql } from "@octokit/graphql";

const GITHUB_AUTH_PROVIDER_ID = "github";
const SCOPES = ["repo"];

export class AuthProvider {
  private graphql: typeof graphql | undefined;

  async initialize(context: vscode.ExtensionContext): Promise<void> {
    context.subscriptions.push(
      vscode.authentication.onDidChangeSessions(async (e) => {
        if (e.provider.id === GITHUB_AUTH_PROVIDER_ID) {
          await this.setGraphQL();
        }
      })
    );

    this.setGraphQL();
  }

  private async setGraphQL() {
    const session = await vscode.authentication.getSession(
      GITHUB_AUTH_PROVIDER_ID,
      SCOPES,
      { createIfNone: false }
    );

    if (session) {
      this.graphql = graphql.defaults({
        headers: {
          authorization: `token ${session.accessToken}`,
        },
      });

      return;
    }

    this.graphql = undefined;
  }

  async getOctokit(): Promise<typeof graphql> {
    if (this.graphql) {
      return this.graphql;
    }

    const session = await vscode.authentication.getSession(
      GITHUB_AUTH_PROVIDER_ID,
      SCOPES,
      { createIfNone: true }
    );
    this.graphql = graphql.defaults({
      headers: {
        authorization: `token ${session.accessToken}`,
      },
    });

    return this.graphql;
  }
}
