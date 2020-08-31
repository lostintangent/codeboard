import React from "react";
import { components } from "react-trello";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

// lifted from https://github.com/rcdexta/react-trello/blob/master/src/styles/Base.js
const CardWrapper = styled.article`
  border-radius: 3px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  position: relative;
  padding: 10px;
  cursor: pointer;
  max-width: 250px;
  margin-bottom: 7px;
  min-width: 230px;
`;
const MovableCardWrapper = styled(CardWrapper)`
  &:hover {
    background-color: #f0f0f0;
    color: #000;
  }
`;
const Detail = styled.div`
  font-size: 12px;
  color: #4d4d4d;
  white-space: pre-wrap;
`;

class MarkdownCard extends components.Card {
  render() {
    return (
      <MovableCardWrapper>
        <Detail>
          <ReactMarkdown source={this.props.note} />
        </Detail>
      </MovableCardWrapper>
    );
  }
}
export default MarkdownCard;
