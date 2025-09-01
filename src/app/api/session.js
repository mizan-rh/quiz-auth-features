// pages/api/session.js
import { auth } from "@/auth";

export default async function handler(req, res) {
  const session = await auth(req, res);
  console.log("API Session: session =", JSON.stringify(session, null, 2));
  res.json(session);
}