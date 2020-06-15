import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import { status } from "../../constants/status";
import { table } from "../../constants/table";
import { tabs } from "../../constants/tabs";
import Button from "../common/Button";
import Table from "../common/Table";
import Title from "../common/Title";
import { Cookies } from "react-cookie";
import Reach from "../popups/Reach";
import DeleteAll from "../popups/DeleteAll";
import PopUp from "../common/PopUp";

const cookies = new Cookies();

const LoadFilesWrapper = styled.div`
  > div:nth-child(2) {
    border-bottom: 1px solid ${props => props.theme.colors.border1};
    padding: 0 0 30px 0;
  }
`;

const Input = styled.input`
  padding: 4px 10px 4px 0;
  height: 30px;
  width: 250px;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 30px 0;
  min-height: 30px;
  button:nth-child(1) {
    margin: 0 15px 0 0;
  }
`;

function LoadFiles() {
  const [filesToBeLoaded, setFilesToBeLoaded] = useState();
  const [filesToBeLoadedStatus, setFilesToBeLoadedStatus] = useState();
  const [loadedFilesLength, setLoadedFilesLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function setFilesArray(array) {
    let newArray = [].concat(array);
    return newArray;
  }

  function setLoadingStatus(index, messaage) {
    filesToBeLoadedStatus.splice(index, 1, messaage);
    let newArr = [].concat(filesToBeLoadedStatus);
    setFilesToBeLoadedStatus(newArr);
  }

  async function recursiveUploadChain(files) {
    const nextFile = files.shift();
    const nextFileIndex = loadedFilesLength - files.length - 1;
    setIsLoading(true);

    function getUserNumber(file) {
      return file.name.split(".")[0].split("-")[0];
    }

    if (nextFile) {
      setLoadingStatus(nextFileIndex, status.PENDING);
      let deleteError = false;
      return axios
        .get(`${process.env.API_URL}/users?number=${getUserNumber(nextFile)}`, {
          headers: {
            Authorization: `Bearer ${cookies.get("guards")}`
          }
        })
        .then(result => {
          result.data[0].file.map((item, index) => {
            if (index >= 3) {
              axios
                .delete(`${process.env.API_URL}/upload/files/${item.id}`, {
                  headers: {
                    Authorization: `Bearer ${cookies.get("guards")}`
                  }
                })
                .catch(() => (deleteError = true));
            }
          });
          if (result.data[0].id) {
            let id = result.data[0].id;
            let data = new FormData();
            data.append("files", nextFile);
            data.append("refId", id);
            data.append("ref", "user");
            data.append("field", "file");
            data.append("source", "users-permissions");
            axios
              .post(`${process.env.API_URL}/upload`, data, {
                headers: {
                  Authorization: `Bearer ${cookies.get("guards")}`
                }
              })
              .then(() => {
                if (deleteError) {
                  setLoadingStatus(nextFileIndex, status.WARNING);
                } else {
                  setLoadingStatus(nextFileIndex, status.SUCCESS);
                }
              })
              .catch(() => setLoadingStatus(nextFileIndex, status.ERROR))
              .finally(() => recursiveUploadChain(files));
          }
        })
        .then(() => setLoadingStatus(nextFileIndex, status.SUCCESS))
        .catch(() => setLoadingStatus(nextFileIndex, status.ERROR))
        .finally(() => recursiveUploadChain(files));
    } else {
      return Promise.resolve().then(() => setIsLoading(false));
    }
  }

  function handleLoadFileChange(event) {
    let files = [];
    let filesStatus = [];
    Object.values(event.target.files).map(file => {
      files.push(file);
      filesStatus.push(status.READY);
    });
    setFilesToBeLoaded(files);
    setFilesToBeLoadedStatus(filesStatus);
    setLoadedFilesLength(files.length);
  }

  return (
    <LoadFilesWrapper>
      <Title text={tabs.DOCS.LOAD} tag="h1" />
      <Section>
        <PopUp buttonText="Verificar alcance">
          <Reach api={process.env.API_URL} />
        </PopUp>
        <PopUp
          buttonText="Borrar todas las guardias"
          secondary={true}
          small={true}
        >
          <DeleteAll api={process.env.API_URL} />
        </PopUp>
      </Section>
      <Section>
        {!isLoading ? (
          <div>
            <Button
              text={tabs.DOCS.LOAD}
              onClick={() =>
                recursiveUploadChain(setFilesArray(filesToBeLoaded))
              }
            />
            <Input
              type="file"
              onChange={e => handleLoadFileChange(e)}
              multiple
            />
          </div>
        ) : (
          <div>Procesando...</div>
        )}
      </Section>
      <Table
        data={[
          { heading: table.FILES, content: filesToBeLoaded },
          { heading: table.STATE, content: filesToBeLoadedStatus }
        ]}
      />
    </LoadFilesWrapper>
  );
}

export default LoadFiles;
