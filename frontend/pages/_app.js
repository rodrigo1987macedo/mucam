import App from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import { CookiesProvider } from "react-cookie";
import GlobalStyle from "../styles/globalStyle";
import "react-responsive-modal/styles.css";
import Fonts from "../styles/Fonts";

const theme = {
  colors: {
    primary: "#214B8B",
    background1: "#ffffff",
    background2: "#f6f6f6",
    border1: "#e7e7e7",
    border2: "#d3d3d3",
    tab: "#6b6c6d",
    tabHover: "#333",
    success: "#008000",
    warning: "#ff8c00",
    error: "#B22222",
    process: "#808080",
    dark: "#333333"
  }
};

export default class MyApp extends App {
  componentDidMount() {
    Fonts();
  }
  render() {
    const { Component, pageProps } = this.props;
    return (
      <CookiesProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Component {...pageProps} />
        </ThemeProvider>
      </CookiesProvider>
    );
  }
}
