import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownPreview({ content, isDark = true }) {
  const textColor = isDark ? "rgba(255,255,255,0.75)" : "#000";
  const headingColor = isDark ? "#fff" : "#000";
  const accentColor = isDark ? "#C1121F" : "#C1121F";
  const bgColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const codeColor = isDark ? "#ff6b6b" : "#d73a49";

  return (
    <div style={{ color: textColor, lineHeight: 1.9 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1
              style={{
                fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                marginTop: "3rem",
                marginBottom: "1.5rem",
                color: headingColor,
                textTransform: "uppercase",
              }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              style={{
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.01em",
                marginTop: "2.5rem",
                marginBottom: "1.2rem",
                color: headingColor,
                textTransform: "uppercase",
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                fontWeight: 700,
                marginTop: "2rem",
                marginBottom: "1rem",
                color: headingColor,
              }}
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                marginTop: "1.5rem",
                marginBottom: "0.8rem",
                color: headingColor,
              }}
            >
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p
              style={{
                fontSize: "clamp(1rem, 2.4vw, 1.15rem)",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
                color: textColor,
                letterSpacing: "0.012em",
              }}
            >
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: accentColor,
                textDecoration: "underline",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = headingColor)}
              onMouseLeave={(e) => (e.target.style.color = accentColor)}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong
              style={{
                fontWeight: 900,
                color: headingColor,
              }}
            >
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em
              style={{
                fontStyle: "italic",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {children}
            </em>
          ),
          code: ({ node, inline, children }) =>
            inline ? (
              <code
                style={{
                  backgroundColor: bgColor,
                  padding: "0.2em 0.4em",
                  borderRadius: "4px",
                  color: codeColor,
                  fontSize: "0.9em",
                  fontFamily: "monospace",
                }}
              >
                {children}
              </code>
            ) : null,
          pre: ({ children }) => (
            <pre
              style={{
                backgroundColor: "#0a0a0a",
                color: "#e0e0e0",
                padding: "1.5rem",
                borderRadius: "8px",
                overflow: "auto",
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
                fontSize: "0.9rem",
                fontFamily: "monospace",
                border: `1px solid ${borderColor}`,
              }}
            >
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeftWidth: "3px",
                borderLeftStyle: "solid",
                borderLeftColor: accentColor,
                paddingLeft: "1.5rem",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.7)",
                marginTop: "1.5rem",
                marginBottom: "1.5rem",
                opacity: 0.85,
              }}
            >
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "2rem",
                marginBottom: "1.5rem",
              }}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              style={{
                listStyleType: "decimal",
                paddingLeft: "2rem",
                marginBottom: "1.5rem",
              }}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li
              style={{
                marginBottom: "0.5rem",
                color: textColor,
              }}
            >
              {children}
            </li>
          ),
          img: ({ src, alt, title }) => (
            <img
              src={src}
              alt={alt}
              title={title}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                marginTop: "2rem",
                marginBottom: "2rem",
                border: `1px solid ${borderColor}`,
              }}
              loading="lazy"
            />
          ),
          hr: () => (
            <hr
              style={{
                borderTop: `1px solid ${borderColor}`,
                margin: "3rem 0",
              }}
            />
          ),
          table: ({ children }) => (
            <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.95rem",
                }}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr
              style={{
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th
              style={{
                padding: "0.75rem",
                textAlign: "left",
                backgroundColor: bgColor,
                fontWeight: 700,
                color: headingColor,
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              style={{
                padding: "0.75rem",
                borderRight: `1px solid ${borderColor}`,
              }}
            >
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
