import React from "react";
import Moment from "react-moment";
import styled from "styled-components";
import { status } from "../../constants/status";
import { table } from "../../constants/table";
import DeleteOne from "../popups/DeleteOne";
import Edit from "../popups/Edit";
import { CopyToClipboard } from "react-copy-to-clipboard";
import PopUp from "./PopUp";

const TableWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 85px;
  border-bottom: 1px solid ${props => props.theme.colors.border2};
  overflow: scroll;
  > div {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 125px;
    @media (max-width: 1200px) {
      min-width: 200px;
    }
  }
`;

const TableHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 8px;
  height: 40px;
  border: 1px solid ${props => props.theme.colors.border1};
  background: ${props => props.theme.colors.background1};
`;

const TableContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 46px;
  border-bottom: 1px solid ${props => props.theme.colors.border1};
  color: ${props =>
    props.status === status.PROCESS_PENDING
      ? props.theme.colors.process
      : props.status === status.PROCESS_SUCCESS
      ? props.theme.colors.success
      : props.status === status.PROCESS_WARNING
      ? props.theme.colors.warning
      : props.status === status.ERROR
      ? props.theme.colors.error
      : "inherit"};
  button {
    margin: 0 5px 0 0;
  }
`;

const CellContent = styled(CopyToClipboard)`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
`;

const Actions = styled.div`
  text-align: center;
  width: 100%;
`;

const Guard = styled.a`
  position: relative;
  overflow: visible;
`;

const Month = styled(Moment)`
  position: absolute;
  top: -7px;
  right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  font-size: 8px;
  background: ${props => props.theme.colors.dark};
  border-radius: 100%;
  color: ${props => props.theme.colors.background1};
  line-height: 6px;
`;

const Img = styled.img`
  display: block;
  width: 19px;
  margin: 0 18px 0 0;
`;

function Table({ data, onUpdate }) {
  return (
    <TableWrapper>
      {data.map((column, i) => {
        return (
          <div key={column.heading + i}>
            <TableHeading>{column.heading}</TableHeading>
            {column.content &&
              column.content.map((item, j) => {
                return (
                  <TableContent
                    key={column.heading + j}
                    status={column.heading === table.STATE && item}
                  >
                    {column.heading === table.GUARD ? (
                      item.map(guard => {
                        return (
                          <CellContent
                            key={guard.url}
                            title={guard.createdAt}
                            text={item}
                          >
                            <Guard
                              cl={console.log(guard.url)}
                              href={process.env.API_URL + guard.url}
                              target="_blank"
                            >
                              <Month format="MM" locale="es">
                                <div>{guard.created_at}</div>
                              </Month>
                              <Img src="file.png" alt="guardia" />
                            </Guard>
                          </CellContent>
                        );
                      })
                    ) : column.heading === table.ACTIONS ? (
                      <Actions>
                        <PopUp buttonIcon="pen">
                          <Edit
                            api={process.env.API_URL}
                            id={item}
                            onUpdate={() => onUpdate()}
                          />
                        </PopUp>
                        <PopUp buttonIcon="trash" secondary={true} small={true}>
                          <DeleteOne
                            api={process.env.API_URL}
                            id={item}
                            onUpdate={() => onUpdate()}
                          />
                        </PopUp>
                      </Actions>
                    ) : column.heading === table.FILES ? (
                      <CellContent title={item.name} text={item}>
                        <div>{item.name}</div>
                      </CellContent>
                    ) : column.heading === table.DATE_CRE ||
                      column.heading === table.DATE_MOD ? (
                      <CellContent title={item} text={item}>
                        <div>
                          Hace{" "}
                          <Moment fromNow ago locale="es">
                            {item}
                          </Moment>
                        </div>
                      </CellContent>
                    ) : (
                      <CellContent title={item} text={item}>
                        <div>{item}</div>
                      </CellContent>
                    )}
                  </TableContent>
                );
              })}
          </div>
        );
      })}
    </TableWrapper>
  );
}

export default Table;
