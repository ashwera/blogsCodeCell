import { connectDB } from "../../../lib/db.js";

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

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const Blog = (await import("../../../server/models/Blog.js")).default;
    const blog = await Blog.findById(req.query.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
