import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { createBlog } from "../lib/blogs";
import MarkdownBlogEditor from "../components/MarkdownBlogEditor";
import "./Write.css";

export default function WritePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSave = (blogData) => {
    // Handle saving the blog
    console.log("Blog saved:", blogData);
    // You can add Firebase integration here later
  };

  const handlePublish = async (blogData) => {
    if (!user) {
      throw new Error("Must be logged in to publish");
    }

    try {
      await createBlog(
        {
          title: blogData.title,
          excerpt: blogData.excerpt,
          blocks: blogData.blocks,
          coverImage: blogData.coverImage,
        },
        user,
      );

      // Navigate to blogs page after successful publish
      navigate("/blogs");
    } catch (error) {
      console.error("Error publishing blog:", error);
      throw error;
    }
  };

  return (
    <div className="write-page">
      <MarkdownBlogEditor onSave={handleSave} onPublish={handlePublish} />
    </div>
  );
}
