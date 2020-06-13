import React from "react";
import styled from "styled-components";

const NavbarWrapper = styled.div`
  background: ${props => props.theme.colors.background1};
  border-bottom: 1px solid ${props => props.theme.colors.border1};
  padding: 25px 150px 12px 150px;
  @media (max-width: 1200px) {
    padding: 25px 6vw 12px 6vw;
  }
`;

function Navbar({ children }) {
  return <NavbarWrapper>{children}</NavbarWrapper>;
}

export default Navbar;
