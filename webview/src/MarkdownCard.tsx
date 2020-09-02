import React from "react";
import { components, widgets } from "react-trello";
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
const CardForm = styled.div`
  background-color: #e3e3e3;
`;
const AddButton = styled.button`
  background: #5aac44;
  color: #fff;
  transition: background 0.3s ease;
  min-height: 32px;
  padding: 4px 16px;
  vertical-align: top;
  margin-top: 0;
  margin-right: 8px;
  font-weight: bold;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 0;
`;
const CancelButton = styled.button`
  background: #999999;
  color: #fff;
  transition: background 0.3s ease;
  min-height: 32px;
  padding: 4px 16px;
  vertical-align: top;
  margin-top: 0;
  font-weight: bold;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 0;
`;

export class MarkdownCard extends components.Card {
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

export class MarkdownEditableCard extends components.NewCardForm {
  render() {
    const { onCancel, t } = this.props;
    return (
      <CardForm>
        <CardWrapper>
          <Detail>
            <widgets.EditableLabel
              placeholder={t("placeholder.note")}
              onChange={(val) => this.updateField("note", val)}
            />
          </Detail>
        </CardWrapper>
        <AddButton onClick={this.handleAdd}>{t("button.Add card")}</AddButton>
        <CancelButton onClick={onCancel}>{t("button.Cancel")}</CancelButton>
      </CardForm>
    );
  }
}
