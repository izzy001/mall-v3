"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const config_1 = __importDefault(require("config"));
function appConfig() {
    if (!config_1.default.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
    ;
}
exports.appConfig = appConfig;
;
//# sourceMappingURL=config.js.map