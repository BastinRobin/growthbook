import mongoose from "mongoose";
import { WebhookInterface } from "../../types/webhook";

const webhookSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  organization: {
    type: String,
    index: true,
  },
  name: String,
  endpoint: String,
  signingKey: String,
  lastSuccess: Date,
  error: String,
  created: Date,
});

export type WebhookDocument = mongoose.Document & WebhookInterface;

export const WebhookModel = mongoose.model<WebhookDocument>(
  "Webhook",
  webhookSchema
);
