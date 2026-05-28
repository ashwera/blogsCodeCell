import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, Plus, Trash2, X, ArrowLeft } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import {
  getAllBlogs,
  createBlog,
  deleteBlog,
  getApprovedEmails,
} from "../../lib/blogs";

const T = {
  fontMono: "var(--font-accent)",
  fontDisplay: "var(--font-heading)",
  fontBody: "var(--font-primary)",
  muted: "var(--text-muted)",
  text: "var(--text-color)",
  bg: "var(--bg-color)",
  red: "#C1121F",
  border: "var(--border-color)",
  borderAlpha: "rgba(255,255,255,0.08)",
  hover: "var(--hover-bg)",
};

const EMPTY_FORM = {
  title: "",
  category: "",
  excerpt: "",
  content: "",
  tags: "",
};

/* ── Small reusable field ── */
function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label
        style={{
          fontFamily: T.fontMono,
          fontSize: "0.68rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: T.muted,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${T.borderAlpha}`,
  borderRadius: "0.5rem",
  padding: "0.75rem 1rem",
  color: T.text,
  fontFamily: T.fontBody,
  fontSize: "0.95rem",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
};

export default function AdminPage() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  const [approved, setApproved] = useState(null); // null = checking
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");

  // Check approval whenever user changes
  useEffect(() => {
    if (!user) {
      setApproved(null);
      return;
    }
    setApproved(null);
    getApprovedEmails()
      .then((emails) => setApproved(emails.includes(user.email)))
      .catch(() => setApproved(false));
  }, [user]);

  // Fetch all blogs once approved
  useEffect(() => {
    if (!approved) return;
    setBlogsLoading(true);
    getAllBlogs()
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setBlogsLoading(false));
  }, [approved]);

  const handleSignIn = async () => {
    setAuthError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthError("Sign-in failed. Please try again.");
    }
  };

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await createBlog({ ...form, tags }, user);
      setForm(EMPTY_FORM);
      setShowForm(false);
      // Refresh blog list
      const updated = await getAllBlogs();
      setBlogs(updated);
    } catch (err) {
      console.error(err);
      setError("Failed to publish blog. Check Firestore rules.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog? This cannot be undone.")) return;
    await deleteBlog(id);
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  /* ── Shared wrapper ── */
  const Wrapper = useMemo(() => {
    const StableWrapper = ({ children }) => (
      <div
        style={{
          background: T.bg,
          color: T.text,
          minHeight: "100vh",
          fontFamily: T.fontBody,
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            padding: "1.25rem clamp(1rem, 5vw, 4rem)",
            borderBottom: `1px solid ${T.borderAlpha}`,
            gap: "1rem",
          }}
        >
          <span
            style={{
              fontFamily: T.fontMono,
              fontSize: "0.82rem",
              letterSpacing: "0.25em",
              textTransform: "lowercase",
            }}
          >
            codecell <span style={{ color: T.red }}>admin</span>
          </span>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {user && (
              <span
                style={{
                  fontFamily: T.fontMono,
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  color: T.muted,
                }}
              >
                {user.email}
              </span>
            )}
            <button
              onClick={() => navigate("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: T.muted,
                fontFamily: T.fontMono,
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={12} /> site
            </button>
            {user && (
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: T.muted,
                  fontFamily: T.fontMono,
                  fontSize: "0.65rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <LogOut size={12} /> sign out
              </button>
            )}
          </div>
        </header>
        <main
          style={{
            padding: "clamp(2rem, 6vw, 4rem) clamp(1rem, 5vw, 4rem)",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {children}
        </main>
      </div>
    );

    return StableWrapper;
  }, [handleLogout, navigate, user]);

  /* ── Loading ── */
  if (loading)
    return (
      <Wrapper>
        <p style={{ color: T.muted }}>Loading...</p>
      </Wrapper>
    );

  /* ── Not signed in ── */
  if (!user) {
    return (
      <Wrapper>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            maxWidth: "420px",
            margin: "4rem auto",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: T.fontDisplay,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: 1.1,
            }}
          >
            Admin Access
          </h1>
          <p style={{ color: T.muted, lineHeight: 1.7 }}>
            Sign in with an approved Google account to manage and publish blog
            posts.
          </p>
          {authError && (
            <p
              style={{
                color: T.red,
                fontFamily: T.fontMono,
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
              }}
            >
              {authError}
            </p>
          )}
          <button
            onClick={handleSignIn}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "0.9rem 2rem",
              borderRadius: "999px",
              background: T.red,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontFamily: T.fontMono,
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <LogIn size={16} />
            Sign in with Google
          </button>
        </div>
      </Wrapper>
    );
  }

  /* ── Checking approval ── */
  if (approved === null) {
    return (
      <Wrapper>
        <p style={{ color: T.muted }}>Verifying access...</p>
      </Wrapper>
    );
  }

  /* ── Not approved ── */
  if (approved === false) {
    return (
      <Wrapper>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            maxWidth: "420px",
            margin: "4rem auto",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: "2rem" }}>
            Access Denied
          </h2>
          <p style={{ color: T.muted, lineHeight: 1.7 }}>
            <strong>{user.email}</strong> is not on the approved list. Contact a
            CodeCell admin to get access.
          </p>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "999px",
              border: `1px solid ${T.borderAlpha}`,
              background: "transparent",
              color: T.muted,
              cursor: "pointer",
              fontFamily: T.fontMono,
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Sign Out
          </button>
        </div>
      </Wrapper>
    );
  }

  /* ── Dashboard ── */
  return (
    <Wrapper>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: T.fontDisplay,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              lineHeight: 1.1,
              marginBottom: "0.4rem",
            }}
          >
            Blog Dashboard
          </h1>
          <p style={{ color: T.muted, fontSize: "0.9rem" }}>
            {blogs.length} {blogs.length === 1 ? "post" : "posts"} total
          </p>
        </div>
        <button
          onClick={() => navigate("/write")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "999px",
            background: T.red,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontFamily: T.fontMono,
            fontSize: "0.75rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Plus size={14} /> New Post
        </button>
      </div>

      {/* New post form */}
      {showForm && (
        <div
          style={{
            border: `1px solid ${T.borderAlpha}`,
            borderRadius: "0.75rem",
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
            marginBottom: "3rem",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: "1.5rem" }}>
              New Blog Post
            </h2>
            <button
              onClick={() => setShowForm(false)}
              style={{
                background: "none",
                border: "none",
                color: T.muted,
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <Field label="Title *">
                <input
                  style={inputStyle}
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="The Architecture of Nothingness"
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.3)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = T.borderAlpha)}
                />
              </Field>
              <Field label="Category">
                <input
                  style={inputStyle}
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  placeholder="Design, Tech, Culture..."
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.3)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = T.borderAlpha)}
                />
              </Field>
            </div>

            <Field label="Excerpt (shown as lead quote)">
              <input
                style={inputStyle}
                value={form.excerpt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, excerpt: e.target.value }))
                }
                placeholder="A short compelling summary..."
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.3)")
                }
                onBlur={(e) => (e.target.style.borderColor = T.borderAlpha)}
              />
            </Field>

            <Field label="Content * (separate paragraphs with a blank line)">
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: "280px",
                  resize: "vertical",
                  lineHeight: "1.7",
                }}
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                placeholder="Write your post here..."
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.3)")
                }
                onBlur={(e) => (e.target.style.borderColor = T.borderAlpha)}
              />
            </Field>

            <Field label="Tags (comma-separated)">
              <input
                style={inputStyle}
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="design, minimalism, ux"
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.3)")
                }
                onBlur={(e) => (e.target.style.borderColor = T.borderAlpha)}
              />
            </Field>

            {error && (
              <p
                style={{
                  color: T.red,
                  fontFamily: T.fontMono,
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                }}
              >
                {error}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "0.7rem 1.5rem",
                  borderRadius: "999px",
                  border: `1px solid ${T.borderAlpha}`,
                  background: "transparent",
                  color: T.muted,
                  cursor: "pointer",
                  fontFamily: T.fontMono,
                  fontSize: "0.72rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "0.7rem 1.75rem",
                  borderRadius: "999px",
                  background: submitting ? "#555" : T.red,
                  color: "#fff",
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: T.fontMono,
                  fontSize: "0.72rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  transition: "opacity 0.2s",
                }}
              >
                {submitting ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blog list */}
      {blogsLoading ? (
        <p style={{ color: T.muted }}>Loading posts...</p>
      ) : blogs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: T.muted }}>
          <p
            style={{
              fontFamily: T.fontDisplay,
              fontSize: "1.5rem",
              marginBottom: "0.75rem",
            }}
          >
            No posts yet
          </p>
          <p style={{ fontSize: "0.9rem" }}>
            Click "New Post" to publish your first entry.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {blogs.map((blog, i) => {
            const date = blog.createdAt?.toDate
              ? blog.createdAt.toDate().toLocaleDateString()
              : new Date(blog.createdAt).toLocaleDateString();
            return (
              <div
                key={blog.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "1.25rem 0",
                  borderTop: i === 0 ? `1px solid ${T.borderAlpha}` : "none",
                  borderBottom: `1px solid ${T.borderAlpha}`,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: T.fontDisplay,
                      fontSize: "1.1rem",
                      marginBottom: "0.3rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {blog.title}
                  </p>
                  <div
                    style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
                  >
                    <span
                      style={{
                        fontFamily: T.fontMono,
                        fontSize: "0.62rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#C1121F",
                      }}
                    >
                      {blog.category || "Uncategorized"}
                    </span>
                    <span
                      style={{
                        fontFamily: T.fontMono,
                        fontSize: "0.62rem",
                        letterSpacing: "0.12em",
                        color: T.muted,
                      }}
                    >
                      {blog.authorName} · {date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(blog.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "999px",
                    border: `1px solid ${T.borderAlpha}`,
                    background: "transparent",
                    color: T.muted,
                    cursor: "pointer",
                    fontFamily: T.fontMono,
                    fontSize: "0.62rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#C1121F";
                    e.currentTarget.style.borderColor = "#C1121F";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = T.muted;
                    e.currentTarget.style.borderColor = T.borderAlpha;
                  }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Wrapper>
  );
}
