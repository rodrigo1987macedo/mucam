import axios from "axios";
import React, { useState } from "react";
import { Cookies } from "react-cookie";
import Title from "../components/common/Title";

const cookies = new Cookies();

function Debugger() {
  const [usersInfo, setUsersInfo] = useState([]);
  const [start, setStart] = useState(0);

  function updateUsers() {
    usersInfo.map(info => {
      axios
        .put(
          `${process.env.API_URL}/users/${info.id}`,
          {
            username: info.email,
            name: info.username,
            email: info.email
          },
          {
            headers: {
              Authorization: `Bearer ${cookies.get("guards")}`
            }
          }
        )
        .then(res => console.log(res));
    });
  }

  function getUsers() {
    axios
      .get(`${process.env.API_URL}/users?_start=${start}&_limit=100`, {
        headers: {
          Authorization: `Bearer ${cookies.get("guards")}`
        }
      })
      .then(res => {
        let usersInfoArray = [];
        res.data.map(user => {
          usersInfoArray.push({
            id: user.id,
            username: user.username,
            email: user.email.toLowerCase(),
            name: user.name
          });
        });
        setUsersInfo(usersInfoArray);
        console.log("finished");
      });
  }

  function seeUsersInfo() {
    console.log(usersInfo);
  }

  function handleInput(event) {
    setStart(event.target.value);
  }

  return (
    <>
      <Title text="Debugger" tag="h1" />
      <input type="text" onChange={handleInput} value={start} />
      {start}
      <button onClick={() => getUsers()}>getUsers</button>
      <button onClick={() => seeUsersInfo()}>seeUsersInfo</button>
      <button onClick={() => updateUsers()}>updateUsers</button>
    </>
  );
}

export default Debugger;
