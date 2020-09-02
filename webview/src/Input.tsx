import React from "react";
import styled from "styled-components";

const TextArea = styled.textarea`
  font-size: 12px;
  color: rgb(77, 77, 77);
  width: 100%;
  resize: vertical;
  border: none;
`;

// Based on
// https://github.com/rcdexta/react-trello/blob/master/src/widgets/EditableLabel.js
class EditableLabel extends React.Component<any, any> {
  refDiv: any;
  state = { rows: 6 };

  onTextChange = (ev) => {
    const value: string = ev.target.value;
    this.props.onChange(value);

    const cols = this.refDiv.cols;
    const lineCount = value
      .split("\n")
      .reduce((acc, line) => acc + Math.ceil(line.length / cols), 0);
    if (this.state.rows < lineCount + 2) {
      this.setState({ rows: lineCount + 2 });
    }
  };

  componentDidMount() {
    if (this.props.autoFocus) {
      this.refDiv.focus();
    }
  }

  render() {
    const placeholder =
      this.props.value.length > 0 ? false : this.props.placeholder;
    return (
      <TextArea
        ref={(ref) => (this.refDiv = ref)}
        placeholder={placeholder}
        onChange={this.onTextChange}
        rows={this.state.rows}
      />
    );
  }
}

export default EditableLabel;
