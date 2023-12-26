import { Router } from "express";

const logRouter = new Router();

logRouter.get("/", (req, res) => {
  req.logger.fatal("Fatal error");
  req.logger.error("Error");
  req.logger.warn("Warning");
  req.logger.info(`Information`);
  req.logger.http("Http");
  req.logger.debug("Debug");
  res.send({ message: "Logger test" });
});

export default logRouter;
