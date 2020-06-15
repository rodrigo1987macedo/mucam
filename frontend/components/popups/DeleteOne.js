import axios from "axios";
import React, { useState } from "react";
import { Cookies } from "react-cookie";
import Button from "../common/Button";
import Title from "../common/Title";
import SafeGuard from "../common/SafeGuard";
import Loader from "../common/Loader";
import { trackPromise } from "react-promise-tracker";

const cookies = new Cookies();

const process = {
  FINISHED: "Funcionario eliminado",
  ERROR: "Ha ocurrido un error",
};

function DeleteOne({ id, onUpdate, api }) {
  const [successMessage, setSuccessMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  function deleteOne() {
    trackPromise(
      axios
        .delete(`${api}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${cookies.get("guards")}`
          }
        })
        .then(() => {
          setErrorMessage(null);
          setSuccessMessage(process.FINISHED);
          onUpdate();
        })
        .catch(() => {
          setErrorMessage(process.ERROR);
          setSuccessMessage(null);
        }),
      "delete-one"
    );
  }

  return (
    <>
      <Title
        text="Eliminar Funcionario"
        explanation="Este proceso eliminará el funcionario del sistema de manera definitiva"
        tag="h1"
        danger={true}
      />
      <SafeGuard>
        <Button
          onClick={() => deleteOne()}
          danger={true}
          text="Eliminar funcionario"
        />
        <Loader
          area="delete-one"
          success={successMessage}
          error={errorMessage}
        />
      </SafeGuard>
    </>
  );
}

export default DeleteOne;
