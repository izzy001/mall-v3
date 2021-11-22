import express from 'express';
const app = express();
import Logger from "./startup/logging";
import { dbConn } from "../src/startup/db";
import { appConfig } from "./startup/config";
import { route } from "./startup/routes";
import cors from "cors";
//import { joiObjectId } from "./startup/validation";

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

dbConn();
appConfig();
//joiObjectId();

const port = process.env.PORT || 8000;
app.get("/logger", (_, res) => {
    Logger.error("This is an error log");
    Logger.warn("This is a warn log");
    Logger.info("This is a info log");
    Logger.http("This is a http log");
    Logger.debug("This is a debug log");
   return res.send({
        msg:  "Altmall logs running",
        Time: new Date(),
        status: "running"
    });
});

app.get("/", (_, res) =>{
      return res.send({
            msg: "Hello Altmall",
            Time: new Date(),
            status: "running",
            server: "Express + TypeScript Server"
          });
});

route(app);
export const server = app.listen(port, () => Logger.info(`listening on ${port}...`));
