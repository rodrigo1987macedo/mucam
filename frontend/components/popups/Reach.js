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
import getUsersReachment from "./reach/getReachedUsers";

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
  //
  const [unreachedNumbers, setUnreachedNumbers] = useState([]);
  const [unreachedUsernames, setUnrechedUsernames] = useState([]);
  const [unreachedEmails, setUnrechedEmails] = useState([]);
  //
  const [forgottenNumbers, setForgottenNumbers] = useState([]);
  const [forgottenUsernames, setForgottenUsernames] = useState([]);
  const [forgottenEmails, setForgottenEmails] = useState([]);
  //
  const [resultMessage, setResultMessage] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const [reachRequests, setReachRequests] = useState(990);

  const forgottenThresholdModifier = 6;

  // Get a date object for the current time
  let forgottenThreshold = new Date();

  // Set it to one month ago
  forgottenThreshold.setMonth(
    forgottenThreshold.getMonth() - forgottenThresholdModifier
  );

  function concatenate(state, value) {
    if (state) {
      return state.concat(value);
    } else return value;
  }

  function usersReachmentChain(usersCount, reachRequests) {
    if (usersCount >= reachRequests - 990) {
      trackPromise(
        axios
          .get(
            `${api}/users?_start=${reachRequests -
              990}&_limit=${reachRequests}`,
            {
              headers: {
                Authorization: `Bearer ${cookies.get("guards")}`
              }
            }
          )
          .then(res => {
            const {
              reachedArr,
              unreachedArr,
              forgottenNumbersArr,
              forgottenUsernamesArr,
              forgottenEmailsArr,
              unreachedNumbersArr,
              unreachedUsernamesArr,
              unreachedEmailsArr
            } = getUsersReachment(res, forgottenThreshold);
            //
            setReached(concatenate(reached, reachedArr));
            //
            setUnreached(concatenate(unreached, unreachedArr));
            //
            setForgottenNumbers(
              concatenate(forgottenNumbers, forgottenNumbersArr)
            );
            setForgottenUsernames(
              concatenate(forgottenUsernames, forgottenUsernamesArr)
            );
            setForgottenEmails(
              concatenate(forgottenEmails, forgottenEmailsArr)
            );
            //
            setUnreachedNumbers(
              concatenate(unreachedNumbers, unreachedNumbersArr)
            );
            setUnrechedUsernames(
              concatenate(unreachedUsernames, unreachedUsernamesArr)
            );
            setUnrechedEmails(
              concatenate(unreachedEmails, unreachedEmailsArr)
            );
            setResultMessage(
              `${concatenate(reached, reachedArr).length} de ${concatenate(
                reached,
                reachedArr
              ).length + concatenate(unreached, unreachedArr).length}`
            );
          })
          .catch(() => {
            setErrorMessage(status.ERROR_SERVER);
          })
          .finally(() => {
            setReachRequests(reachRequests + 990);
          }),
        "reach"
      );
    }
  }

  useEffect(() => {
    axios
      .get(`${api}/users/count`, {
        headers: {
          Authorization: `Bearer ${cookies.get("guards")}`
        }
      })
      .then(res => {
        usersReachmentChain(res.data, reachRequests);
      });
  }, [reachRequests]);

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
              content: unreachedNumbers
            },
            {
              heading: table.NAME,
              content: unreachedUsernames
            },
            { heading: table.MAIL, content: unreachedEmails }
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
              content: forgottenNumbers
            },
            {
              heading: table.NAME,
              content: forgottenUsernames
            },
            { heading: table.MAIL, content: forgottenEmails }
          ]}
        />
      </Result>
    </>
  );
}

export default Reach;
