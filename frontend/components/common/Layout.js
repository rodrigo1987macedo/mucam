import React from "react";
import styled from "styled-components";
import Head from "next/head";
import Footer from "../common/Footer";

const LayoutWrapper = styled.div`
  background: ${props => !props.whiteBackground ? props.theme.colors.background2 : props.theme.colors.background1};
`;

const Content = styled.div`
  min-height: 100vh;
  padding: 0 0 30px 0;
  > main {
    padding: 32px 150px 14px 150px;
    @media (max-width: 1200px) {
      padding: 32px 6vw 14px 6vw;
    }
  }
`;

function Layout({ children, title, description, whiteBackground}) {
  return (
    <LayoutWrapper whiteBackground={whiteBackground}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link
          rel="icon"
          type="image/icon"
          sizes="256x256"
          href="/favicon.ico"
        />
      </Head>
      <Content>{children}</Content>
      <Footer />
    </LayoutWrapper>
  );
}

export default Layout;
