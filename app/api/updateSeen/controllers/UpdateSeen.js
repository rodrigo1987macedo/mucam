module.exports = {
  put: async ctx => {
    entity = strapi
      .query("user", "users-permissions")
      .update(
        { id: ctx.state.user.id },
        {
          seen: ctx.request.body.seen
        }
      )
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
    ctx.send(entity);
  }
};
