module.exports = {
  // GET /hello
  index: async ctx => {
    if (ctx.state.user) {
      console.log("user: ", ctx.state.user);
    }
    ctx.send("Hello World!");
  }
};
