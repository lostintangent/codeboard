import React from "react";
import ReactDOM from "react-dom";
import Board from "react-trello";
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
        draggable
        onDataChange={this.onDataChange}
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
