import React from "react";
import styled from "styled-components";

const ButtonWrapper = styled.button`
  display: inline;
  background: ${props =>
    props.secondary
      ? props.theme.colors.border1
      : props.danger
      ? props.theme.colors.error
      : props.theme.colors.primary};
  color: ${props =>
    props.secondary
      ? props.theme.colors.process
      : props.theme.colors.background1};
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
  max-width: 182px;
  z-index: 2;
  > img {
    display: block;
    width: 15px;
  }
`;

function Button({ text, onClick, secondary, danger, icon }) {
  return (
    <ButtonWrapper onClick={onClick} secondary={secondary} danger={danger}>
      {icon === "pen" && <img src={icon + ".png"} alt="editar" />}
      {icon === "trash" && <img src={icon + ".png"} alt="borrar" />}
      {text}
    </ButtonWrapper>
  );
}

export default Button;
