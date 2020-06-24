import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Button from "./Button";
import Input from "./Input";
import Loader from "./Loader";
import { trackPromise } from "react-promise-tracker";
import { status } from "../../constants/status";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const SafeGuardWrapper = styled.div`
  input {
    margin: 0 0 15px 0;
  }
`;

function SafeGuard({ children }) {
  const [isSure, setIsSure] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userIdentifier, setUserIdentifier] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${cookies.get("guards")}`
        }
      })
      .then(res => {
        setUserIdentifier(res.data.email);
      });
  });

  function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    trackPromise(
      axios
        .post(`${process.env.API_URL}/auth/local`, {
          identifier: userIdentifier,
          password: userPassword
        })
        .then(() => {
          setIsSure(true);
        })
        .catch(err => {
          if (err.response.status === 400) {
            setErrorMessage(status.ERROR_DATA);
          } else {
            setErrorMessage(status.ERROR_SERVER);
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
