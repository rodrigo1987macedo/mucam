import React, { useState, useEffect } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import styled from "styled-components";
import Title from "../common/Title";
import { trackPromise } from "react-promise-tracker";
import Loader from "../common/Loader";
import Table from "../common/Table";
import { table } from "../../constants/table";
import { status } from "../../constants/status";

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
  const [forgottenUsers, setForgotenUsers] = useState({
    forgottenNumberArr: undefined,
    forgottenUsernameArr: undefined,
    forgottenEmailArr: undefined
  });
  const [resultMessage, setResultMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const forgottenThresholdModifier = 6;

  // Get a date object for the current time
  let forgottenThreshold = new Date();

  // Set it to one month ago
  forgottenThreshold.setMonth(
    forgottenThreshold.getMonth() - forgottenThresholdModifier
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
          let forgottenNumbersArr = [];
          let forgottenUsernamesArr = [];
          let forgottenEmailsArr = [];
          res.data.map(item => {
            let lastFile = item.file.slice(-1)[0];
            if (lastFile) {
              // FORGOTTEN USERS
              if (
                parseInt(Date.parse(lastFile.updated_at), 10) <
                parseInt(Date.parse(forgottenThreshold), 10)
              ) {
                // updated_at date of last file is prior than forgottenThreshold
                forgottenNumbersArr.push(item.number);
                forgottenUsernamesArr.push(item.name);
                forgottenEmailsArr.push(item.email);
              }
              // UNREACHED USERS
              if (
                !item.seen ||
                parseInt(Date.parse(lastFile.updated_at), 10) >
                  parseInt(Date.parse(item.seen), 10)
              ) {
                // seen date is prior than updated_at of last file
                unreachedArr.push(item);
                //
                unreachedNumbersArr.push(item.number);
                unreachedUsernamesArr.push(item.name);
                unreachedEmailsArr.push(item.email);
              }
              // REACHED USERS
              if (
                parseInt(Date.parse(lastFile.updated_at), 10) <
                parseInt(Date.parse(item.seen), 10)
              ) {
                // seen date is posterior to updated_at of last file
                reachedArr.push(item);
              }
            }
          });
          setReached(reachedArr);
          setUnreached(unreachedArr);
          setForgotenUsers({
            forgottenNumbersArr,
            forgottenUsernamesArr,
            forgottenEmailsArr
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
          setErrorMessage(status.ERROR_SERVER);
        }),
      "reach"
    );
  }, []);

  return (
    <>
      <Title text="Alcance de guardias" tag="h1" />
      <ReachedUsersBar
        reached={Math.round(
          (reached.length / (reached.length + unreached.length)) * 100
        )}
      />
      <Loader success={resultMessage} error={errorMessage} area="reach" />
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
          explanation={`No se les ha cargado una guardia hace más de ${forgottenThresholdModifier} meses`}
          tag="h2"
        />
        <Table
          data={[
            {
              heading: table.NUMBER,
              content: forgottenUsers.forgottenNumbersArr
            },
            {
              heading: table.NAME,
              content: forgottenUsers.forgottenUsernamesArr
            },
            { heading: table.MAIL, content: forgottenUsers.forgottenEmailsArr }
          ]}
        />
      </Result>
    </>
  );
}

export default Reach;
