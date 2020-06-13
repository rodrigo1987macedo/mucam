const FontFaceObserver = require("fontfaceobserver");

const fonts = [
  ["/alright-normal.woff", "Alright"],
  ["/alright-thin.woff", "Alright"],
  ["/alright-bold.woff", "Alright"],
  ["/brother-normal.woff", "Brother"],
  ["/brother-thin.woff", "Brother"]
];

const Fonts = () => {
  fonts.map(font => {
    const link = document.createElement("link");
    link.href = font[0]
    link.rel = "preload";
    link.crossorigin = "anonymus";
    link.type = "font/woff";
    link.as = "font";

    document.head.appendChild(link);

    const myFont = new FontFaceObserver(font[1]);

    myFont
      .load()
      .then(() => {
        document.documentElement.classList.add(font[1]);
      })
  });
};

export default Fonts;
