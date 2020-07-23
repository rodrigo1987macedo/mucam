module.exports = {
  findall: async ctx => {
    entity = await strapi
      .query("user", "users-permissions")
      .find({ _limit: -1 })
      .then(res => {
        return res;
      })
      .catch(() => {
        return null;
      });

    ctx.send(entity);
  }
};
