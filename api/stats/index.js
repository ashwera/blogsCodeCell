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
    const Event = (await import("../../../server/models/Event.js")).default;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalViews = await Event.countDocuments({ type: "view" });
    const viewsThisMonth = await Event.countDocuments({
      type: "view",
      created_at: { $gte: startOfMonth },
    });

    const avgReadResult = await Event.aggregate([
      { $match: { type: "read", time_spent: { $exists: true } } },
      { $group: { _id: null, avgTime: { $avg: "$time_spent" } } },
    ]);
    const avgReadTime =
      avgReadResult.length > 0
        ? parseFloat(avgReadResult[0].avgTime.toFixed(1))
        : 0;

    const topCategoryResult = await Event.aggregate([
      { $match: { type: "view" } },
      {
        $lookup: {
          from: "blogs",
          localField: "blog_id",
          foreignField: "_id",
          as: "blog",
        },
      },
      { $unwind: "$blog" },
      { $group: { _id: "$blog.category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const topCategory =
      topCategoryResult.length > 0 ? topCategoryResult[0]._id : "N/A";

    res.status(200).json({
      total_views: totalViews,
      views_this_month: viewsThisMonth,
      avg_read_time: avgReadTime,
      top_category: topCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
