"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const logging_1 = __importDefault(require("./startup/logging"));
const db_1 = require("../src/startup/db");
const config_1 = require("./startup/config");
const routes_1 = require("./startup/routes");
const cors_1 = __importDefault(require("cors"));
//import { joiObjectId } from "./startup/validation";
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
(0, db_1.dbConn)();
(0, config_1.appConfig)();
//joiObjectId();
const port = process.env.PORT || 8000;
app.get("/logger", (_, res) => {
    logging_1.default.error("This is an error log");
    logging_1.default.warn("This is a warn log");
    logging_1.default.info("This is a info log");
    logging_1.default.http("This is a http log");
    logging_1.default.debug("This is a debug log");
    return res.send({
        msg: "Altmall logs running",
        Time: new Date(),
        status: "running"
    });
});
app.get("/", (_, res) => {
    return res.send({
        msg: "Hello Altmall",
        Time: new Date(),
        status: "running",
        server: "Express + TypeScript Server"
    });
});
(0, routes_1.route)(app);
exports.server = app.listen(port, () => logging_1.default.info(`listening on ${port}...`));
//# sourceMappingURL=index.js.map