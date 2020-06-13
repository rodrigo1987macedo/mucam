import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { Cookies } from "react-cookie";
import Button from "../common/Button";
import Title from "../common/Title";
import PopUp from "../common/PopUp";
import Input from "../common/Input";
import { trackPromise } from "react-promise-tracker";
import Loader from "../common/Loader";
import Guards from "../common/Guards";

const cookies = new Cookies();

const Form = styled.form`
  @media (max-width: 1200px) {
    display: flex;
    flex-direction: column;
  }
  padding: 10px 0 0 0;
  button {
    width: 80px;
  }
  input {
    width: 130px;
    @media (max-width: 1000px) {
      margin: 0 0 30px 0;
    }
  }
  > span > span {
    @media (max-width: 1000px) {
      top: -15px;
    }
  }
`;

const EmptyMessage = styled.div`
  color: ${props => props.theme.colors.process};
`;

const process = {
  FINISHED: "Funcionario modificado con éxito",
  ERROR: "Ha ocurrido un error",
  RUNNING: "Modificando..."
};

function Edit({ id, onUpdate, api }) {
  const [user, setUser] = useState();
  const [successEditMessage, setSuccessEditMessage] = useState();
  const [errorEditMessage, setErrorEditMessage] = useState();
  const [successDeleteMessage, setSuccessDeleteMessage] = useState();
  const [errorDeleteMessage, setErrorDeleteMessage] = useState();

  function resetState() {
    setErrorEditMessage(null);
    setSuccessEditMessage(null);
    setErrorDeleteMessage(null);
    setSuccessDeleteMessage(null);
  }

  function fetchUser() {
    resetState();
    axios
      .get(`http://localhost:1337/users/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.get("guards")}`
        }
      })
      .then(res => {
        let data = {
          number: res.data.number,
          username: res.data.username,
          email: res.data.email,
          ci: res.data.ci,
          files: res.data.file
        };
        setUser(data);
      });
  }

  function deleteGuard(id) {
    resetState();
    trackPromise(
      axios
        .delete(`${api}/upload/files/${id}`, {
          headers: {
            Authorization: `Bearer ${cookies.get("guards")}`
          }
        })
        .then(() => {
          setErrorDeleteMessage(null);
          setSuccessDeleteMessage(process.FINISHED);
          onUpdate();
          fetchUser();
        })
        .catch(() => {
          setErrorDeleteMessage(process.ERROR);
          setSuccessDeleteMessage(null);
        }),
      "delete"
    );
  }

  function edit(e, user) {
    console.log("user id: ", id);
    resetState();
    e.preventDefault();
    trackPromise(
      axios
        .put(`${api}/users/${id}`, user, {
          headers: {
            Authorization: `Bearer ${cookies.get("guards")}`
          }
        })
        .then(() => {
          setSuccessEditMessage(process.FINISHED);
          setErrorEditMessage(null);
          onUpdate();
        })
        .catch(() => {
          setErrorEditMessage(process.ERROR);
          setSuccessEditMessage(null);
        }),
      "edit"
    );
  }

  function handleUserEdit(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  }

  return (
    <PopUp onOpen={() => fetchUser()} buttonIcon="pen">
      <Title
        text="Editar Funcionario"
        explanation="Este proceso modificará los datos editados del funcionario en sistema de manera definitiva"
        tag="h1"
      />
      {user ? (
        <>
          <Title text="Datos" tag="h2" />
          <Form onSubmit={e => edit(e, user)}>
            <Input
              badge="Nombre"
              autocomplete="on"
              name="username"
              type="text"
              value={user.username}
              onChange={handleUserEdit}
              rightMargin={true}
            />
            <Input
              badge="Email"
              autocomplete="on"
              name="email"
              type="text"
              value={user.email}
              onChange={handleUserEdit}
              rightMargin={true}
            />
            <Input
              badge="Número"
              autocomplete="on"
              name="number"
              type="text"
              value={user.number}
              onChange={handleUserEdit}
              rightMargin={true}
            />
            <Input
              badge="Cédula"
              autocomplete="on"
              name="ci"
              type="text"
              value={user.ci}
              onChange={handleUserEdit}
              rightMargin={true}
            />
            <Button text="Modificar" />
          </Form>
          <Loader
            area="edit"
            success={successEditMessage}
            error={errorEditMessage}
          />
          <Title text="Guardias" tag="h2" />
          {user.files.length !== 0 ? (
            <Guards guardsArr={user.files} canDelete={id => deleteGuard(id)} />
          ) : (
            <EmptyMessage>No hay guardias</EmptyMessage>
          )}
          <Loader
            area="delete"
            success={successDeleteMessage}
            error={errorDeleteMessage}
          />
        </>
      ) : (
        <>Procesando...</>
      )}
    </PopUp>
  );
}

export default Edit;
