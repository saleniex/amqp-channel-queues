"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class CorrelationIdFactory {
    create() {
        return crypto.randomBytes(32).toString("hex");
    }
}
exports.default = CorrelationIdFactory;
//# sourceMappingURL=CorrelationIdFactory.js.map