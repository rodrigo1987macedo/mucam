import React from "react";
import styled from "styled-components";
import { usePromiseTracker } from "react-promise-tracker";

const ResultWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.centered && "center"};
  min-height: 40px;
  border-bottom: 1px solid ${props => props.theme.colors.border1};
  margin: 0 0 40px 0;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.colors.success};
`;

const Loading = styled.div`
  color: ${props => props.theme.colors.process};
`;

function Loader({ success, error, area, centered }) {
  const { promiseInProgress } = usePromiseTracker({ area });
  return (
    <ResultWrapper centered={centered}>
      {promiseInProgress ? (
        <Loading>Cargando...</Loading>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : success ? (
        <SuccessMessage>{success}</SuccessMessage>
      ) : null}
    </ResultWrapper>
  );
}

export default Loader;
