import React from "react";
import styled from "styled-components";

const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background1};
  font-family: "Alright";
  font-size: 16px;
  > div {
    display: flex;
    justify-content: space-between;
    padding: 30px 0;
    width: 1140px;
    @media only screen and (max-width: 1200px) {
      width: 940px;
    }
    @media only screen and (max-width: 990px) {
      display: block;
      width: 720px;
    }
    @media only screen and (max-width: 770px) {
      display: block;
      width: 702px;
    }
    @media only screen and (max-width: 770px) {
      padding: 30px;
    }
  }
  a {
    color: ${props => props.theme.colors.background1};
    :hover {
      text-decoration: none;
    }
  }
`;

const FooterFirst = styled.div`
  display: flex;
  > img {
    height: 69px;
    margin: 0 8vw 30px 0;
    @media only screen and (max-width: 770px) {
      display: none;
    }
  }
  > div {
    margin: 0 0 30px 0;
    > div {
      margin: 0 0 5px 0;
    }
  }
  @media only screen and (max-width: 990px) {
    display: block;
  }
`;

const FooterSecond = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  > div {
    margin: 0 0 13px 0;
  }
`;

function Footer() {
  return (
    <FooterWrapper>
      <div>
        <FooterFirst>
          <img src="logo-white.png" alt="logo" />
          <div>
            <div>
              <a href="https://www.medicauruguaya.com.uy/auc.aspx?74">
                Trabajar en Médica Uruguaya
              </a>
            </div>
            <div>
              <a href="https://www.medicauruguaya.com.uy/auc.aspx?75">
                Llamados vigentes
              </a>
            </div>
          </div>
        </FooterFirst>
        <FooterSecond>
          <div>Médica Uruguaya ©</div>
          <div>Av. 8 de Octubre 2492 - Montevideo, Uruguay</div>
          <div>Central Telefónica: 1912</div>
          <div>
            <a href="mailto:info@medicauruguaya.com.uy">
              info@medicauruguaya.com.uy
            </a>
          </div>
          <div>
            <a href="https://www.ucfe.com.uy/consultacfe/?rut=212701040013">
              Consulta de Comprobante Fiscal Electrónico
            </a>
          </div>
        </FooterSecond>
      </div>
    </FooterWrapper>
  );
}

export default Footer;
