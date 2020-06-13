import axios from "axios";
import Router from "next/router";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export async function auth(ctx) {
  let token;

  if (ctx.req && ctx.req.headers.cookie) {
    // if context has request info AKA Server Side
    token = ctx.req.headers.cookie.replace(
      /(?:(?:^|.*;\s*)guards\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
  } else {
    // we dont have request info AKA Client Side
    token = cookies.get("guards");
  }

  const { data } = await axios
    .get(`${process.env.API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(() => {
      if (ctx.res) {
        ctx.res.writeHead(302, {
          Location: "/"
        });
        ctx.res.end();
      } else {
        Router.push("/");
      }
    });

  // const { me } = await axios
  // .get(`${process.env.API_URL}/users/me`, {
  // headers: {
  // Authorization: `Bearer ${token}`
  // }
  // })
  // .catch(() => {
  // if (ctx.res) {
  // ctx.res.writeHead(302, {
  // Location: "/"
  // });
  // ctx.res.end();
  // } else {
  // Router.push("/");
  // }
  // });

  // const { data } = await axios
  // .get(`${process.env.API_URL}/users/${me.id}`, {
  // headers: {
  // Authorization: `Bearer ${token}`
  // }
  // })
  // .catch(() => {
  // if (ctx.res) {
  // ctx.res.writeHead(302, {
  // Location: "/"
  // });
  // ctx.res.end();
  // } else {
  // Router.push("/");
  // }
  // });

  return data;
}
