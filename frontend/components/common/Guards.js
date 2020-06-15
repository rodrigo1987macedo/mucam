import React from "react";
import styled from "styled-components";
import Moment from "react-moment";

const GuardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0 0 0;
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: ${props => props.theme.colors.dark};
    cursor: pointer;
  }
  time {
    transform: translate(0, 2px);
    margin: 0 0 0 2px;
  }
`;

const Guard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 12px;
  background-color: ${props => props.theme.colors.border1};
  border-radius: 4px;
  border: 2px solid ${props => props.theme.colors.process};
  margin: 0 14px 14px 0;
  > a {
    display: flex;
    flex-direction: column;
    padding: 10px;
  }
`;

const Img = styled.img`
  display: block;
  width: 40px;
  margin: 0 0 10px 0;
`;

const GuardSection = styled.div`
  text-align: center;
  > div:nth-child(3) {
    padding: 5px 0 0 0;
  }
`;

const Delete = styled.div`
  background-color: ${props => props.theme.colors.border2};
  padding: 4px 6px;
  border-radius: 2px;
  margin: 0 0 10px 0;
  cursor: pointer;
  z-index: 100;
  > img {
    display: block;
    width: 12px;
  }
`;

function Guards({ guardsArr, canDelete }) {
  const getMonth = (number, createdAt) => {
    let createdAtDate = new Date(createdAt);
    if (number) {
      let givenMonth = parseInt(number, 10);
      createdAtDate.setMonth(givenMonth - 1);
    }
    return createdAtDate.toISOString();
  };

  return (
    <GuardsWrapper>
      {guardsArr.map(item => {
        return (
          <Guard key={item.url}>
            <a href={process.env.API_URL + item.url} target="_blank">
              <Img src="file.png" alt="guardia" />
              <GuardSection>
                <div>Publicación:</div>
                <Moment format="DD/MM/YY">{item.created_at}</Moment>
                <div>Mes:</div>
                <Moment format="MMMM" withTitle locale="es">
                  {getMonth(
                    item.name.split(".")[0].split("-")[1],
                    item.created_at
                  )}
                </Moment>
              </GuardSection>
            </a>
            {canDelete && (
              <Delete onClick={() => canDelete(item.id)}>Eliminar</Delete>
            )}
          </Guard>
        );
      })}
    </GuardsWrapper>
  );
}

export default Guards;
