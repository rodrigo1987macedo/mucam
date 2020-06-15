module.exports = {
  find: async ctx => {
    entity = await strapi
      .query("user", "users-permissions")
      .find({ id: ctx.state.user.id })
      .then(res => {
        return res[0].file;
      })
      .catch(() => {
        return null;
      });

    ctx.send(entity);
  }
};
