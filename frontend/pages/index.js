import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { trackPromise } from "react-promise-tracker";
import styled from "styled-components";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";
import Title from "../components/common/Title";
import Layout from "../components/common/Layout";

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100vw;
  height: 100vh;
  input {
    margin: 0 0 10px 0;
  }
  > div {
    text-align: center;
    width: 400px;
    padding: 30px 14px;
    border-radius: 4px;
    border: 1px solid ${props => props.theme.colors.border2};
    @media (max-width: 600px) {
      border: none;
    }
  }
`;

const Logo = styled.img`
  width: 180px;
`;

const Forgot = styled.div`
  margin: 10px 0 0 0;
  text-decoration: underline;
  font-size: 12px;
  z-index: 2;
  cursor: pointer;
`;

export default () => {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["guards"]);
  const [userIdentifier, setUserIdentifier] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailSent, setEmailSent] = useState("");

  function forgotPassword() {
    setErrorMessage("");
    setEmailSent("");
    trackPromise(
      axios
        .post(`${process.env.API_URL}/auth/forgot-password`, {
          email: userIdentifier
        })
        .then(() => {
          setEmailSent("Se ha enviado un mail a tu casilla de correo");
        })
        .catch(err => {
          // console.log("err: ", err.response.status);
          setErrorMessage("Error en el servidor");
        })
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setEmailSent("");
    trackPromise(
      axios
        .post(`${process.env.API_URL}/auth/local`, {
          identifier: userIdentifier,
          password: userPassword
        })
        .then(res => {
          if (res.data) {
            setCookie("guards", res.data.jwt, { path: "/" });
            router.push("/admin");
          }
        })
        .catch(err => {
          if (err.response.status === 400) {
            setErrorMessage("Usuario o clave incorrectos");
          } else {
            setErrorMessage("Error en el servidor");
          }
        })
    );
  }

  const handleIdentifierChange = e => {
    e.persist();
    setUserIdentifier(e.target.value);
  };

  const handlePasswordChange = e => {
    e.persist();
    setUserPassword(e.target.value);
  };

  return (
    <Layout
      title="Ingresar a Gestión de guardias | Médica Uruguaya"
      description="Ingresar sistema de gestión de guardias"
      whiteBackground
    >
      <FormWrapper>
        <div>
          <Title text="Ingresar" tag="h1" />
          <form onSubmit={e => handleSubmit(e)}>
            <div>
              <Input
                type="email"
                autocomplete="on"
                badge="Email"
                id="email"
                name="email"
                onChange={handleIdentifierChange}
                value={userIdentifier}
              />
            </div>
            <br />
            <div>
              <Input
                type="password"
                autocomplete="on"
                badge="Contraseña"
                id="password"
                name="password"
                onChange={handlePasswordChange}
                value={userPassword}
              />
            </div>
            <br />
            <Button text="Ingresar" />
            <Forgot onClick={() => forgotPassword()}>
              Olvidé mi contraseña
            </Forgot>
          </form>
          <Loader error={errorMessage} success={emailSent} centered={true} />
          <Logo src="logo.png" />
        </div>
      </FormWrapper>
    </Layout>
  );
};
