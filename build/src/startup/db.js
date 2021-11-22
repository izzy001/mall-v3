"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConn = void 0;
const winston_1 = __importDefault(require("winston"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
function dbConn() {
    const db = config_1.default.get("db");
    mongoose_1.default.connect(db)
        .then(() => winston_1.default.info(`Connected to ${db} ...`));
    //mongodb://localhost:27017/altmall-v3
}
exports.dbConn = dbConn;
//# sourceMappingURL=db.js.map