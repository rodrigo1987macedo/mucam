import React from "react";
import styled from "styled-components";

const InputWrapper = styled.span`
  position: relative;
  margin-right: ${props => props.rightMargin && "15px"};
  margin-bottom: ${props => props.bottomMargin && "15px"};
  > span {
    position: absolute;
    top: -25px;
    left: 3px;
    font-size: 12px;
    color: ${props => props.theme.colors.process};
  }
  > input {
    padding: 8px;
    border: 1px solid ${props => props.theme.colors.border2};
  }
`;

function Input({
  placeholder,
  name,
  type,
  value,
  onChange,
  rightMargin,
  bottomMargin,
  badge
}) {
  return (
    <InputWrapper rightMargin={rightMargin} bottomMargin={bottomMargin}>
      {badge && <span>{badge}</span>}
      <input
        placeholder={placeholder}
        name={name}
        value={value}
        type={type}
        onChange={onChange}
      />
    </InputWrapper>
  );
}

export default Input;
