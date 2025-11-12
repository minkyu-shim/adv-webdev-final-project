export const logMiddleware = (req, res, next) => {
  const date = new Date().toISOString();
  console.log(`[${date}] ${req.method} ${req.originalUrl || req.url}`);
  next();
};

export default logMiddleware;
