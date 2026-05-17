import { connectDB } from "../../../../lib/db.js";
import { protect } from "../../../../lib/authMiddleware.js";
import { z } from "zod";

const usernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username must contain only letters, numbers, _ or -",
    ),
});

export default async function handler(req, res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://localhost:5173",
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await protect(req);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }

  const parsed = usernameSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message:
        "Username must be 3-30 characters and contain only letters, numbers, _ or -",
      errors: parsed.error.errors,
    });
  }

  try {
    await connectDB();
    const User = (await import("../../../../server/models/User.js")).default;
    const cleaned = parsed.data.username;

    let user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      user = await User.create({ uid: req.user.uid, email: req.user.email });
    }

    if (user.username) {
      return res
        .status(409)
        .json({ message: "Username already set and cannot be changed" });
    }

    const taken = await User.findOne({ username: cleaned });
    if (taken) {
      return res
        .status(409)
        .json({ message: "That username is already taken" });
    }

    user.username = cleaned;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
