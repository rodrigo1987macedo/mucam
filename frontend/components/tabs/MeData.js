import axios from "axios";
import React, { useEffect } from "react";
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
  console.log("data: ", data);
  let now = new Date();
  useEffect(() => {
    axios.put(
      `${process.env.API_URL}/users/${data.id}`,
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

  return (
    <MeDataWrapper>
      <div>#{data.number ? data.number : "-"}</div>
      <div>{data.username ? data.username : "-"}</div>
      <div>{data.email ? data.email : "-"}</div>
      {data.file ? (
        <Guards guardsArr={data.file} />
      ) : (
        <EmptyMessage>No hay guardias</EmptyMessage>
      )}
    </MeDataWrapper>
  );
}

export default MeData;
