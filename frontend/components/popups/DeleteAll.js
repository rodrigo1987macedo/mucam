import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { Cookies } from "react-cookie";
import Button from "../common/Button";
import Title from "../common/Title";
import PopUp from "../common/PopUp";
import SafeGuard from "../common/SafeGuard";

const cookies = new Cookies();

const Results = styled.div`
  min-height: 60px;
  > div {
    margin: 10px 0;
  }
`;

const Warning = styled.div`
  color: ${props => props.theme.colors.error};
`;

const Status = styled.div`
  color: ${props => props.theme.colors.success};
`;

const process = {
  FINISHED: "Proceso terminado",
  ERROR:
    "Error en el servidor. Algunas guardias no han sido borradas, intente correr el proceso de nuevo una vez terminado",
  RUNNING: "Eliminando"
};

function DeleteAll({ api }) {
  const [status, setStatus] = useState();
  const [error, setError] = useState();
  const [gettingFiles, setGettingFiles] = useState();

  function resetState() {
    setStatus(null);
    setError(null);
  }

  function recursiveDeletionChain() {
    setGettingFiles("Procesando...");
    axios
      .get(`${api}/upload/files`, {
        headers: {
          Authorization: `Bearer ${cookies.get("guards")}`
        }
      })
      .then(res => {
        if (res.data.length !== 0) {
          axios
            .delete(`${api}/upload/files/${res.data[0].id}`, {
              headers: {
                Authorization: `Bearer ${cookies.get("guards")}`
              }
            })
            .then(deleted => {
              setStatus(`${process.RUNNING}: ${deleted.data.name}`);
            })
            .catch(() => {
              setError(process.ERROR);
            })
            .finally(() => recursiveDeletionChain());
        } else {
          setGettingFiles(null);
          setStatus(process.FINISHED);
        }
      })
      .catch(() => setError(process.ERROR));
  }

  return (
    <
    >
      <Title
        text="Eliminar guardias"
        explanation="Este proceso borrará TODAS las guardias del sistema de manera definitiva"
        tag="h1"
        danger={true}
      />
      <SafeGuard>
        <Button
          onClick={() => recursiveDeletionChain()}
          text="Comenzar"
          danger={true}
        />
        <Results>
          <div>{gettingFiles}</div>
          <Status>{status}</Status>
          <Warning>{error}</Warning>
        </Results>
      </SafeGuard>
    </>
  );
}

export default DeleteAll;
