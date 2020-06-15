import axios from "axios";
import React, { useState } from "react";
import { Cookies } from "react-cookie";
import Button from "../common/Button";
import Title from "../common/Title";
import Loader from "../common/Loader";
import { trackPromise } from "react-promise-tracker";
import SafeGuard from "../common/SafeGuard";

const cookies = new Cookies();

const process = {
  FINISHED: "Proceso terminado",
  ERROR:
    "Error en el servidor. Algunas guardias no han sido borradas, intente correr el proceso de nuevo una vez terminado",
  RUNNING: "Eliminando"
};

function DeleteAll({ api }) {
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  function recursiveDeletionChain() {
    trackPromise(
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
                setSuccessMessage(`${process.RUNNING}: ${deleted.data.name}`);
              })
              .catch(() => {
                setErrorMessage(process.ERROR);
              })
              .finally(() => recursiveDeletionChain());
          } else {
            setSuccessMessage(process.FINISHED);
          }
        })
        .catch(() => setErrorMessage(process.ERROR)),
      "delete-all"
    );
  }

  return (
    <>
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
        <Loader area="delete-all" success={successMessage} />
        {errorMessage}
      </SafeGuard>
    </>
  );
}

export default DeleteAll;
