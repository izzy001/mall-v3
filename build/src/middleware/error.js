"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
function default_1(err, res, next) {
    if (err.message)
        return winston_1.default.error(err.message, err);
    res.status(500).send('Something Failed!');
    next();
}
exports.default = default_1;
//# sourceMappingURL=error.js.map