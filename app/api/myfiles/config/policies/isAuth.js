module.exports = async (ctx, next) => {
  if (ctx.state.user) {
    return await next();
  }

  ctx.unauthorized(`You're not allowed to perform this action!`);
};
