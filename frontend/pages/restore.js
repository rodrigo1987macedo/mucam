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
    border: 1px solid ${props => props.theme.colors.border2};
    border-radius: 4px;
    padding: 30px 14px;
  }
`;

const Logo = styled.img`
  width: 180px;
`;

function Restore({ privateCode }) {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["guards"]);
  const [newUserPassword, setNewUserPassword] = useState("");
  const [confirmedNewUserPassword, setConfirmedNewUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    trackPromise(
      axios
        .post(`${process.env.API_URL}/auth/reset-password`, {
          code: privateCode,
          password: newUserPassword,
          passwordConfirmation: confirmedNewUserPassword
        })
        .then(res => {
          if (res.data) {
            setCookie("guards", res.data.jwt, { path: "/" });
            router.push("/admin");
          }
        })
        .catch(() => {
          setErrorMessage("Error en el servidor");
        })
    );
  }

  const handleNewPasswordChange = e => {
    e.persist();
    setNewUserPassword(e.target.value);
  };

  const handleNewConfirmedPasswordChange = e => {
    e.persist();
    setConfirmedNewUserPassword(e.target.value);
  };

  return (
    <Layout
      title="Cambiar contraseña de Gestión de guardias | Médica Uruguaya"
      description="Cambiar contraseña de sistema de gestión de guardias"
      whiteBackground
    >
      <FormWrapper>
        <div>
          <Title text="Cambiar contraseña" tag="h1" />
          <form onSubmit={e => handleSubmit(e)}>
            <div>
              <Input
                type="password"
                badge="Nueva contraseña"
                id="password"
                name="password"
                onChange={handleNewPasswordChange}
                value={newUserPassword}
              />
            </div>
            <br />
            <div>
              <Input
                type="password"
                badge="Confirmar contraseña"
                id="password"
                name="password"
                onChange={handleNewConfirmedPasswordChange}
                value={confirmedNewUserPassword}
              />
            </div>
            <Button text="Cambiar" />
          </form>
          <Loader error={errorMessage} centered={true} />
          <Logo src="logo.png" />
        </div>
      </FormWrapper>
    </Layout>
  );
}

Restore.getInitialProps = async ctx => {
  return {
    privateCode: ctx.query.code
  };
};

export default Restore;
