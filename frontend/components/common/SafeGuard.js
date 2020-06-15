import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import Loader from "./Loader";
import { trackPromise } from "react-promise-tracker";

const SafeGuardWrapper = styled.div`
  input {
    margin: 0 0 15px 0;
  }
`;

function SafeGuard({ children }) {
  const [isSure, setIsSure] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

const response = {
  ERROR_PASSWORD: "Clave incorrecta",
  ERROR_SERVER: "Ha ocurrido un error",
};

  function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    trackPromise(
      axios
        .post(`${process.env.API_URL}/auth/local`, {
          identifier: "gonzalo2510@adinet.com.uy",
          password: userPassword
        })
        .then(() => {
          setIsSure(true);
        })
        .catch(err => {
          if (err.response.status === 400) {
            setErrorMessage(response.ERROR_PASSWORD);
          } else {
            setErrorMessage(response.ERROR_SERVER);
          }
        }),
      "safe-guard"
    );
  }

  const handlePasswordChange = e => {
    e.persist();
    setUserPassword(e.target.value);
  };

  return (
    <SafeGuardWrapper>
      {isSure ? (
        children
      ) : (
        <form onSubmit={e => handleSubmit(e)}>
          <Input
            badge="Contraseña"
            type="password"
            id="password"
            name="password"
            onChange={handlePasswordChange}
            value={userPassword}
          />
          <br />
          <Button text="Aceptar" />
          <Loader error={errorMessage} area="safe-guard" />
        </form>
      )}
    </SafeGuardWrapper>
  );
}

export default SafeGuard;
