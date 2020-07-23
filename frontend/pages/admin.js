import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { Cookies } from "react-cookie";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import CreateUser from "../components/tabs/CreateUser";
import LoadFiles from "../components/tabs/LoadFiles";
import { tabs } from "../constants/tabs";
import Navbar from "../components/common/Navbar";
import { auth } from "../utils/auth";
import MeData from "../components/tabs/MeData";

const NavbarSection = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 600px) {
    flex-direction: column-reverse;
    :nth-child(2) {
      > div:nth-child(2) {
        margin: 0 0 10px 0;
        padding: 0 0 8px 0;
        border-bottom: 1px solid ${props => props.theme.colors.border2};
      }
    }
  }
  :nth-child(2) {
    margin: 28px 0 0 0;
    @media (max-width: 600px) {
      margin: 0;
    }
  }
  img {
    width: 260px;
    @media (max-width: 600px) {
      margin: 0 0 10px 0;
    }
  }
`;

const AdminDisplay = styled.div`
  display: flex;
  > div:nth-child(1) {
    margin: 0 18px 0 0;
  }
`;

const Tabs = styled.div`
  display: flex;
  > div {
    margin: 0 18px 0 0;
  }
`;

const Tab = styled.div`
  color: ${props => props.theme.colors.tab};
  font-family: "Alright";
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
  :hover {
    color: ${props => props.theme.colors.tabHover};
  }
`;

const cookies = new Cookies();

function Admin({ data }) {
  const [currentTab, setCurrentTab] = useState(tabs.DOCS.MANAGE);

  function logout() {
    cookies.remove("guards");
    Router.push("/");
  }

  return (
    <Layout
      title="Gestión de guardias | Médica Uruguaya"
      description="Sistema de gestión de guardias"
    >
      <Navbar>
        <NavbarSection>
          <Link href="/">
            <a>
              <img src="/logo.png" alt="logo" />
            </a>
          </Link>
        </NavbarSection>
        <NavbarSection>
          {data.role.type === "admin" && (
            <Tabs>
              <Tab onClick={() => setCurrentTab(tabs.DOCS.MANAGE)}>
                {tabs.DOCS.MANAGE}
              </Tab>
              <Tab onClick={() => setCurrentTab(tabs.USERS.MANAGE)}>
                {tabs.USERS.MANAGE}
              </Tab>
            </Tabs>
          )}
          <AdminDisplay>
            <div>Bienvenido, {data.name}</div>
            <Tab onClick={() => logout()}>Cerrar sesión</Tab>
          </AdminDisplay>
        </NavbarSection>
      </Navbar>
      {data.role.type === "admin" && (
        <main>
          {currentTab === tabs.DOCS.MANAGE && <LoadFiles />}
          {currentTab === tabs.USERS.MANAGE && <CreateUser />}
        </main>
      )}
      {data.role.type === "authenticated" && (
        <main>
          <MeData data={data} />
        </main>
      )}
    </Layout>
  );
}

Admin.getInitialProps = async ctx => {
  const data = await auth(ctx);

  return {
    data: data
  };
};

export default Admin;
