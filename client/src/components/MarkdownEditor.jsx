import React, { useRef } from "react";
import {
  Bold,
  Italic,
  Code,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Minus,
  Strikethrough,
  Code2,
} from "lucide-react";

export default function MarkdownEditor({
  content,
  onChange,
  placeholder = "Write your story here...",
}) {
  const textareaRef = useRef(null);

  const insertMarkdown = (before, after = "", selectText = "text") => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || selectText;
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    const newContent = beforeText + before + selectedText + after + afterText;
    onChange(newContent);

    setTimeout(() => {
      const newPosition = start + before.length;
      textarea.focus();
      textarea.setSelectionRange(
        newPosition,
        newPosition + selectedText.length,
      );
    }, 0);
  };

  const insertLine = (markdown) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const beforeText = content.substring(0, start);
    const afterText = content.substring(start);

    let lineStart = beforeText.lastIndexOf("\n") + 1;
    const beforeLine = beforeText.substring(0, lineStart);
    const afterLine = content.substring(lineStart);

    const newContent = beforeLine + markdown + " " + afterLine;
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      const newPosition = lineStart + markdown.length + 1;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handlers = {
    bold: () => insertMarkdown("**", "**", "bold text"),
    italic: () => insertMarkdown("*", "*", "italic text"),
    strikethrough: () => insertMarkdown("~~", "~~", "strikethrough"),
    code: () => insertMarkdown("`", "`", "code"),
    heading2: () => insertLine("##"),
    heading3: () => insertLine("###"),
    ul: () => insertLine("-"),
    ol: () => insertLine("1."),
    quote: () => insertLine(">"),
    hr: () => insertLine("---"),
    codeblock: () => insertMarkdown("```javascript\n", "\n```", "code here"),
    link: () => insertMarkdown("[", "](https://example.com)", "Link text"),
    image: () =>
      insertMarkdown("![", "](https://example.com/image.jpg)", "alt text"),
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Toolbar */}
      <div className="bg-black/5 border border-black/10 rounded-lg p-4 flex flex-wrap gap-2">
        <ToolbarButton
          icon={Bold}
          title="Bold"
          onClick={handlers.bold}
          shortcut="Ctrl+B"
        />
        <ToolbarButton
          icon={Italic}
          title="Italic"
          onClick={handlers.italic}
          shortcut="Ctrl+I"
        />
        <ToolbarButton
          icon={Strikethrough}
          title="Strikethrough"
          onClick={handlers.strikethrough}
        />
        <ToolbarButton
          icon={Code}
          title="Inline Code"
          onClick={handlers.code}
        />

        <div className="w-px bg-black/20" />

        <ToolbarButton
          icon={Heading2}
          title="Heading 2"
          onClick={handlers.heading2}
        />
        <div className="text-xs text-black/40 flex items-center px-2">H3</div>
        <button
          onClick={handlers.heading3}
          className="px-3 py-1 text-xs font-mono font-bold hover:bg-black/10 rounded transition-colors border border-transparent hover:border-black/20"
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px bg-black/20" />

        <ToolbarButton icon={List} title="Bullet List" onClick={handlers.ul} />
        <ToolbarButton
          icon={ListOrdered}
          title="Ordered List"
          onClick={handlers.ol}
        />
        <ToolbarButton
          icon={Quote}
          title="Blockquote"
          onClick={handlers.quote}
        />
        <ToolbarButton
          icon={Minus}
          title="Horizontal Line"
          onClick={handlers.hr}
        />

        <div className="w-px bg-black/20" />

        <ToolbarButton
          icon={Code2}
          title="Code Block"
          onClick={handlers.codeblock}
        />
        <ToolbarButton icon={Link} title="Link" onClick={handlers.link} />
        <ToolbarButton icon={Image} title="Image" onClick={handlers.image} />
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[50vh] min-h-[400px] bg-transparent border-2 border-black/10 rounded-lg outline-none text-lg leading-relaxed resize-none placeholder-black/30 font-mono p-6 focus:border-black transition-colors"
      />

      {/* Markdown Cheatsheet Info */}
      <div className="text-xs text-black/50 font-mono p-3 bg-black/2 rounded border border-black/5">
        💡 Markdown Tip: Use ** for bold, * for italic, [text](url) for links,
        and ![alt](url) for images.
      </div>
    </div>
  );
}

function ToolbarButton({ icon: Icon, title, onClick, shortcut }) {
  return (
    <button
      onClick={onClick}
      title={shortcut ? `${title} (${shortcut})` : title}
      className="p-2 text-black/60 hover:text-black hover:bg-black/5 rounded transition-all border border-transparent hover:border-black/20"
      aria-label={title}
    >
      <Icon size={18} />
    </button>
  );
}
