import styledNormalize from "styled-normalize";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
${styledNormalize}
@font-face { 
  font-family: 'Brother';
  src: local('Brother'), url('/brother-normal.woff') format('woff');
  font-weight: normal;
}
@font-face { 
  font-family: 'Brother';
  src: local('Brother'), url('/brother-thin.woff') format('woff');
  font-weight: thin;
}
@font-face { 
  font-family: 'Alright';
  src: local('Alright'), url('/alright-normal.woff') format('woff');
  font-weight: medium;
}
@font-face { 
  font-family: 'Alright';
  src: local('Alright'), url('/alright-bold.woff') format('woff');
  font-weight: bold;
}
@font-face { 
  font-family: 'Alright';
  src: local('Alright'), url('/alright-thin.woff') format('woff');
  font-weight: thin;
}
html {
  font-family: 'Brother';
  font-weight: thin;
  font-size: 14px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
*, *:before, *:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
}
`;

export default GlobalStyle;
