import React from "react";
import { components } from "react-trello";
const ReactMarkdown = require("react-markdown");

const input = "# This is a header\n\nAnd this is a paragraph";

class MarkdownCard extends components.Card {
  render() {
    return <ReactMarkdown source={input} />;
  }
}
export default MarkdownCard;
