import React from "react";
import ReactDOM from "react-dom";
import Board from "react-trello";
import MarkdownCard from "./MarkdownCard";
import "./index.css";

declare var acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();

class App extends React.Component {
  state = { data: { lanes: [] } };

  componentDidMount() {
    vscode.postMessage({
      type: "webview_status",
      data: { status: "ready" },
    });
    window.addEventListener("message", (event) => {
      console.log("Message received", event.data);
      this.setState({ data: event.data });
    });
  }

  onDataChange(data: any) {
    vscode.postMessage({
      type: "data_changed",
      data,
    });
  }

  render() {
    return (
      <Board
        data={this.state.data}
        editable
        draggable
        canAddLanes
        onLaneAdd={({ title }) =>
          vscode.postMessage({ type: "lane_added", title })
        }
        onLaneDelete={(laneId) =>
          vscode.postMessage({ type: "lane_deleted", id: laneId })
        }
        components={{ Card: MarkdownCard }}
      />
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
