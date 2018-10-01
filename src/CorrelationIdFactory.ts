import * as crypto from "crypto";

export default class CorrelationIdFactory {
    public create(): String {
        return crypto.randomBytes(32).toString("hex");
    }
}