"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (validator) => {
    return (req, res, next) => {
        console.log(`This is the new request ${req.body}`);
        const { error } = validator(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        next();
    };
};
//# sourceMappingURL=validate.js.map