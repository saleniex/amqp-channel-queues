import * as crypto from "crypto";

export class CorrelationIdFactory {
    public create(): String {
        return crypto.randomBytes(32).toString("hex");
    }
}