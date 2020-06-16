import axios from "axios";
import React, { useState } from "react";
import { Cookies } from "react-cookie";
import Button from "../common/Button";
import Title from "../common/Title";
import Loader from "../common/Loader";
import { trackPromise } from "react-promise-tracker";
import SafeGuard from "../common/SafeGuard";
import { status } from '../../constants/status'

const cookies = new Cookies();

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
                setSuccessMessage(`${status.PROCESS_DELETING}: ${deleted.data.name}`);
              })
              .catch(() => {
                setErrorMessage(status.ERROR_GUARDS_DELETION);
              })
              .finally(() => recursiveDeletionChain());
          } else {
            setSuccessMessage(status.PROCESS_GUARDS_DELETION_FINISHED);
          }
        })
        .catch(() => setErrorMessage(status.ERROR_GUARDS_DELETION)),
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
