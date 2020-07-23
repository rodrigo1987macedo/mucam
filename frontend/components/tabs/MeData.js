import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Cookies } from "react-cookie";
import Guards from "../common/Guards";
import { trackPromise } from "react-promise-tracker";
import Loader from "../common/Loader";
import { status } from "../../constants/status";

const cookies = new Cookies();

const MeDataWrapper = styled.div`
  display: grid;
  grid-gap: 5px;
  > div:nth-child(1) {
    font-family: "Alright";
    font-size: 20px;
    text-transform: uppercase;
    color: ${props => props.theme.colors.primary};
  }
`;

const EmptyMessage = styled.div`
  color: ${props => props.theme.colors.process};
`;

const Forgot = styled.div`
  margin: 10px 0 0 0;
  text-decoration: underline;
  font-size: 12px;
  z-index: 2;
  cursor: pointer;
`;

function MeData({ data }) {
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailSent, setEmailSent] = useState("");
  const [userIdentifier, setUserIdentifier] = useState("");

  let now = new Date();

  useEffect(() => {
    setUserIdentifier(data.email)
  })

  useEffect(() => {
    axios.put(
      `${process.env.API_URL}/updateseen/`,
      {
        seen: now.toISOString()
      },
      {
        headers: {
          Authorization: `Bearer ${cookies.get("guards")}`
        }
      }
    );
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.API_URL}/myfiles`, {
        headers: {
          Authorization: `Bearer ${cookies.get("guards")}`
        }
      })
      .then(res => setFiles(res.data));
  }, []);

  function forgotPassword() {
    setErrorMessage("");
    setEmailSent("");
    trackPromise(
      axios
        .post(`${process.env.API_URL}/auth/forgot-password`, {
          email: userIdentifier
        })
        .then(() => {
          setEmailSent(status.SENT_EMAIL);
        })
        .catch(err => {
          if (err.response.status === 400) {
            setErrorMessage(status.ERROR_EMAIL_ENTRY);
          } else {
            setErrorMessage(status.ERROR_SERVER);
          }
        })
    );
  }

  return (
    <MeDataWrapper>
      <div onClick={() => click()}>#{data.number ? data.number : "-"}</div>
      <div>{data.name ? data.name : "-"}</div>
      <div>{data.email ? data.email : "-"}</div>
      {files !== [] ? (
        <Guards guardsArr={files} />
      ) : (
        <EmptyMessage>No hay guardias</EmptyMessage>
      )}
      <Forgot onClick={() => forgotPassword()}>Cambiar contraseña</Forgot>
      <Loader error={errorMessage} success={emailSent} />
    </MeDataWrapper>
  );
}

export default MeData;
