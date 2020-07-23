import React from "react";
import styled from "styled-components";

const RadioWrapper = styled.div`
  display: flex;
  font-size: 12px;
  margin: 12px 14px 0 0;
  > input {
    padding: 0;
    margin: 0 4px 0 0;
  }
  > span {
    line-height: 17px;
  }
`;

function Radio({ value, name, badge, defaultChecked }) {
  return (
    <RadioWrapper>
      <input
        type="radio"
        value={value}
        name={name}
        defaultChecked={defaultChecked}
      />
      <span>{badge}</span>
    </RadioWrapper>
  );
}

export default Radio;
