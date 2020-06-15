import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Cookies } from "react-cookie";
import Guards from "../common/Guards";

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

function MeData({ data }) {
  const [files, setFiles] = useState([]);
  let now = new Date();
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

  return (
    <MeDataWrapper>
      <div onClick={() => click()}>#{data.number ? data.number : "-"}</div>
      <div>{data.username ? data.username : "-"}</div>
      <div>{data.email ? data.email : "-"}</div>
      {files !== [] ? (
        <Guards guardsArr={files} />
      ) : (
        <EmptyMessage>No hay guardias</EmptyMessage>
      )}
    </MeDataWrapper>
  );
}

export default MeData;
