import React, { useState, useEffect } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import styled from "styled-components";
import Title from "../common/Title";
import { trackPromise } from "react-promise-tracker";
import Loader from "../common/Loader";
import Table from "../common/Table";
import { table } from "../../constants/table";
import PopUp from "../common/PopUp";

const cookies = new Cookies();

const Result = styled.div`
  margin: 0 0 30px 0;
`;

const ReachedUsersBar = styled.div`
  position: relative;
  width: 300px;
  height: 20px;
  overflow: hidden;
  background: ${props => props.theme.colors.border1};
  border-radius: 4px;
  ::after {
    content: "";
    position: absolute;
    left: 0;
    background: ${props => props.theme.colors.primary};
    transition: width 2s;
    transition-timing-function: ease;
    width: ${props => (props.reached ? props.reached : 0)}%;
    height: 100%;
  }
`;

function Reach({ api }) {
  const [reached, setReached] = useState([]);
  const [unreached, setUnreached] = useState([]);
  const [unreachedUsers, setUnrechedUsers] = useState({
    unreachedNumbersArr: undefined,
    undefinedUsernameArr: undefined,
    undefinedEmailArr: undefined
  });
  const [forgotenUsers, setForgotenUsers] = useState({
    forgotenNumberArr: undefined,
    forgotenUsernameArr: undefined,
    forgotenEmailArr: undefined
  });
  const [resultMessage, setResultMessage] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);

  const forgotenThresholdModifier = 1;

  // Get a date object for the current time
  let forgotenThreshold = new Date();

  // Set it to one month ago
  forgotenThreshold.setMinutes(
    forgotenThreshold.getMinutes() - forgotenThresholdModifier
  );

  useEffect(() => {
    trackPromise(
      axios
        .get(`${api}/users`, {
          headers: {
            Authorization: `Bearer ${cookies.get("guards")}`
          }
        })
        .then(res => {
          let reachedArr = [];
          let unreachedArr = [];
          //
          let unreachedNumbersArr = [];
          let unreachedUsernamesArr = [];
          let unreachedEmailsArr = [];
          //
          let forgotenNumbersArr = [];
          let forgotenUsernamesArr = [];
          let forgotenEmailsArr = [];
          res.data.map(item => {
            if (
              item.file &&
              Date.parse(forgotenThreshold) > Date.parse(item.file.createdAt)
            ) {
              forgotenNumbersArr.push(item.number);
              forgotenUsernamesArr.push(item.username);
              forgotenEmailsArr.push(item.email);
            }
            if (
              (item.file && item.seen < item.file.createdAt) ||
              item.seen === null
            ) {
              unreachedArr.push(item);
              //
              unreachedNumbersArr.push(item.number);
              unreachedUsernamesArr.push(item.username);
              unreachedEmailsArr.push(item.email);
            }
            if (item.file && item.seen > item.file.createdAt) {
              reachedArr.push(item);
            }
          });
          setReached(reachedArr);
          setUnreached(unreachedArr);
          setForgotenUsers({
            forgotenNumbersArr,
            forgotenUsernamesArr,
            forgotenEmailsArr
          });
          setUnrechedUsers({
            unreachedNumbersArr,
            unreachedUsernamesArr,
            unreachedEmailsArr
          });
          setResultMessage(
            `${reachedArr.length} de ${reachedArr.length + unreachedArr.length}`
          );
        })
        .catch(() => {
          // console.log("error");
        }),
      "reach"
    );
  }, []);

  return (
    <PopUp buttonText="Verificar alcance">
      <Title text="Alcance de guardias" tag="h1" />
      <ReachedUsersBar
        reached={Math.round(
          (reached.length / (reached.length + unreached.length)) * 100
        )}
      />
      <Loader success={resultMessage} area="reach" />
      <Result>
        <Title
          text="Funcionarios no enterados"
          explanation="No han entrado a su perfil después de que se les haya actualizado la última guardia"
          tag="h2"
        />
        <Table
          data={[
            {
              heading: table.NUMBER,
              content: unreachedUsers.unreachedNumbersArr
            },
            {
              heading: table.NAME,
              content: unreachedUsers.unreachedUsernamesArr
            },
            { heading: table.MAIL, content: unreachedUsers.unreachedEmailsArr }
          ]}
        />
      </Result>
      <Result>
        <Title
          text="Funcionarios inactivos"
          explanation={`No se les ha cargado una guardia hace más de ${forgotenThresholdModifier} minuto`}
          tag="h2"
        />
        <Table
          data={[
            {
              heading: table.NUMBER,
              content: forgotenUsers.forgotenNumbersArr
            },
            {
              heading: table.NAME,
              content: forgotenUsers.forgotenUsernamesArr
            },
            { heading: table.MAIL, content: forgotenUsers.forgotenEmailsArr }
          ]}
        />
      </Result>
    </PopUp>
  );
}

export default Reach;
