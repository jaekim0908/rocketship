import { Shippo } from "shippo";

export const shippoClient = new Shippo({
    apiKeyHeader: 'ShippoToken ' + process.env.SHIPPO_API_TOKEN,
    shippoApiVersion: process.env.SHIPPO_API_VERSION,
});