import { useState, useRef, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Bold,
  Italic,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Save,
  Eye,
  Code,
  Minus,
  Upload,
} from "lucide-react";
import "./MarkdownBlogEditor.css";

export default function MarkdownBlogEditor({ onSave, onPublish }) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [content, setContent] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [publishing, setPublishing] = useState(false);

  // Handle cover image upload
  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImagePreview(event.target.result);
        setCoverImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add content block
  const addBlock = (type, content = "") => {
    const newBlock = {
      id: Date.now(),
      type,
      content,
    };
    setBlocks([...blocks, newBlock]);
    setActiveBlockId(newBlock.id);
  };

  // Update block
  const updateBlock = (id, newContent) => {
    setBlocks(
      blocks.map((b) => (b.id === id ? { ...b, content: newContent } : b)),
    );
  };

  // Delete block
  const deleteBlock = (id) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    if (activeBlockId === id) setActiveBlockId(null);
  };

  // Handle image insertion in block
  const handleImageInsertClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageInsertion = async (e) => {
    const file = e.target.files[0];
    if (file && activeBlockId) {
      try {
        // Upload to Firebase Storage
        const timestamp = Date.now();
        const imageName = `${timestamp}-${file.name}`;
        const storageRef = ref(storage, `blog-images/${imageName}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Store as image block instead of markdown
        updateBlock(activeBlockId, { type: 'image', url: downloadURL });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
      }
    }
  };

  // Format text in block
  const formatText = (blockId, format) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;

    let formatted = "";
    switch (format) {
      case "bold":
        formatted = `**${block.content}**`;
        break;
      case "italic":
        formatted = `*${block.content}*`;
        break;
      case "code":
        formatted = `\`${block.content}\``;
        break;
      case "link":
        formatted = `[link](url)`;
        break;
      default:
        formatted = block.content;
    }
    updateBlock(blockId, formatted);
  };

  // Change block type
  const changeBlockType = (blockId, newType) => {
    setBlocks(
      blocks.map((b) => (b.id === blockId ? { ...b, type: newType } : b)),
    );
  };

  // Handle save
  const handleSave = async () => {
    const blogData = {
      title,
      excerpt,
      coverImage: coverImagePreview,
      blocks,
      createdAt: new Date().toISOString(),
    };

    if (onSave) {
      onSave(blogData);
    }

    // Save to localStorage
    localStorage.setItem("blogDraft", JSON.stringify(blogData));
    alert("Blog saved as draft!");
  };

  // Handle publish
  const handlePublish = async () => {
    const blogData = {
      title,
      excerpt,
      coverImage: coverImagePreview,
      blocks,
      createdAt: new Date().toISOString(),
    };

    setPublishing(true);
    try {
      if (onPublish) {
        await onPublish(blogData);
      }
    } catch (error) {
      alert("Failed to publish blog.");
      console.error(error);
      setPublishing(false);
    }
  };

  // Load draft
  const loadDraft = () => {
    const draft = localStorage.getItem("blogDraft");
    if (draft) {
      const blogData = JSON.parse(draft);
      setTitle(blogData.title);
      setExcerpt(blogData.excerpt);
      setCoverImagePreview(blogData.coverImage);
      setBlocks(blogData.blocks);
    }
  };

  return (
    <div className="markdown-editor-container">
      {/* Header */}
      <header className="editor-header">
        <div className="header-content">
          <div className="editor-title">
            <h1>Write a Story</h1>
          </div>
          <div className="header-actions">
            <button
              className="btn-icon"
              onClick={() => setPreviewMode(!previewMode)}
              title={previewMode ? "Edit" : "Preview"}
            >
              {previewMode ? <Code size={20} /> : <Eye size={20} />}
            </button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={publishing}
            >
              <Save size={18} />
              Save Draft
            </button>
            <button
              className="btn-primary btn-publish"
              onClick={handlePublish}
              disabled={publishing || !title.trim()}
            >
              <Upload size={18} />
              {publishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <div className="editor-main">
        {/* Cover Image Section */}
        <section className="cover-section">
          <div
            className="cover-image-container"
            onClick={() => fileInputRef.current?.click()}
          >
            {coverImagePreview ? (
              <>
                <img
                  src={coverImagePreview}
                  alt="Cover"
                  className="cover-image"
                />
                <button
                  className="btn-change-cover"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Change Cover
                </button>
              </>
            ) : (
              <div className="cover-placeholder">
                <ImageIcon size={48} />
                <p>Click to add cover image</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverImageUpload}
            style={{ display: "none" }}
          />
        </section>

        {/* Metadata Section */}
        <section className="metadata-section">
          <input
            type="text"
            className="title-input"
            placeholder="Add a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="excerpt-input"
            placeholder="Add a subtitle or excerpt..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows="2"
          />
        </section>

        {!previewMode ? (
          <>
            {/* Editor Section */}
            <section className="editor-section">
              {blocks.length === 0 ? (
                <div className="empty-editor">
                  <p>Start typing or add a block</p>
                </div>
              ) : (
                blocks.map((block) => (
                  <EditorBlock
                    key={block.id}
                    block={block}
                    isActive={activeBlockId === block.id}
                    onFocus={() => setActiveBlockId(block.id)}
                    onUpdate={(content) => updateBlock(block.id, content)}
                    onDelete={() => deleteBlock(block.id)}
                    onTypeChange={(newType) =>
                      changeBlockType(block.id, newType)
                    }
                    onImageInsert={handleImageInsertion}
                    formatText={(format) => formatText(block.id, format)}
                    imageInputRef={imageInputRef}
                    handleImageInsertClick={handleImageInsertClick}
                  />
                ))
              )}
            </section>

            {/* Add Block Button */}
            <div className="add-block-menu">
              <button
                className="btn-add-block"
                onClick={() => addBlock("paragraph")}
              >
                + Add Text Block
              </button>
              <div className="block-type-menu">
                <button onClick={() => addBlock("h1")} title="Heading 1">
                  <Heading1 size={20} /> H1
                </button>
                <button onClick={() => addBlock("h2")} title="Heading 2">
                  <Heading2 size={20} /> H2
                </button>
                <button onClick={() => addBlock("h3")} title="Heading 3">
                  <Heading3 size={20} /> H3
                </button>
                <button onClick={() => addBlock("ul")} title="Bullet List">
                  <List size={20} /> List
                </button>
                <button onClick={() => addBlock("ol")} title="Numbered List">
                  <ListOrdered size={20} /> Numbered
                </button>
                <button onClick={() => addBlock("quote")} title="Quote">
                  <Quote size={20} /> Quote
                </button>
                <button onClick={() => addBlock("hr")} title="Divider">
                  <Minus size={20} /> Divider
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Preview Section */
          <section className="preview-section">
            <div className="preview-content">
              {coverImagePreview && (
                <img
                  src={coverImagePreview}
                  alt="Cover"
                  className="preview-cover"
                />
              )}
              {title && <h1 className="preview-title">{title}</h1>}
              {excerpt && <p className="preview-excerpt">{excerpt}</p>}
              {blocks.map((block) => (
                <BlockPreview key={block.id} block={block} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Editor Block Component
function EditorBlock({
  block,
  isActive,
  onFocus,
  onUpdate,
  onDelete,
  onTypeChange,
  onImageInsert,
  formatText,
  imageInputRef,
  handleImageInsertClick,
}) {
  const textareaRef = useRef(null);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const blockTypeLabels = {
    paragraph: "Text",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    ul: "Bullet List",
    ol: "Numbered List",
    quote: "Quote",
    hr: "Divider",
    image: "Image",
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const handleInput = (e) => {
    onUpdate(e.target.value);
    autoResize();
  };

  return (
    <div className={`editor-block ${isActive ? "active" : ""}`}>
      <div className="block-header">
        <div className="block-type-selector">
          <button
            className="btn-block-type"
            onClick={() => setShowTypeMenu(!showTypeMenu)}
          >
            {blockTypeLabels[block.type]}
          </button>
          {showTypeMenu && (
            <div className="type-menu-dropdown">
              {Object.entries(blockTypeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    onTypeChange(key);
                    setShowTypeMenu(false);
                  }}
                  className={block.type === key ? "active" : ""}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {isActive && (
          <div className="block-toolbar">
            {["paragraph", "h1", "h2", "h3", "ul", "ol", "quote"].includes(
              block.type,
            ) && (
              <>
                <button
                  className="btn-toolbar"
                  onClick={() => formatText("bold")}
                  title="Bold"
                >
                  <Bold size={18} />
                </button>
                <button
                  className="btn-toolbar"
                  onClick={() => formatText("italic")}
                  title="Italic"
                >
                  <Italic size={18} />
                </button>
                <button
                  className="btn-toolbar"
                  onClick={() => formatText("code")}
                  title="Code"
                >
                  <Code size={18} />
                </button>
                <button
                  className="btn-toolbar"
                  onClick={handleImageInsertClick}
                  title="Insert Image"
                >
                  <ImageIcon size={18} />
                </button>
              </>
            )}
            <button className="btn-delete" onClick={onDelete} title="Delete">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {block.type === "image" && block.content && typeof block.content === "object" && block.content.url ? (
        <div style={{ padding: "1rem", marginTop: "0.5rem" }}>
          <img 
            src={block.content.url} 
            alt="block content" 
            style={{ maxWidth: "100%", height: "auto", borderRadius: "0.5rem" }}
          />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          className={`block-textarea block-${block.type}`}
          value={typeof block.content === "object" ? "" : block.content}
          onChange={handleInput}
          onFocus={onFocus}
          placeholder={`Enter ${blockTypeLabels[block.type].toLowerCase()}...`}
          rows="3"
        />
      )}
    </div>
  );
}

// Block Preview Component
function BlockPreview({ block }) {
  const renderContent = () => {
    switch (block.type) {
      case "h1":
        return <h1>{block.content}</h1>;
      case "h2":
        return <h2>{block.content}</h2>;
      case "h3":
        return <h3>{block.content}</h3>;
      case "ul":
        return (
          <ul>
            {block.content.split("\n").map((item, i) => (
              <li key={i}>{item.replace(/^[-*]\s?/, "")}</li>
            ))}
          </ul>
        );
      case "ol":
        return (
          <ol>
            {block.content.split("\n").map((item, i) => (
              <li key={i}>{item.replace(/^\d+\.\s?/, "")}</li>
            ))}
          </ol>
        );
      case "quote":
        return <blockquote>{block.content}</blockquote>;
      case "hr":
        return <hr />;
      case "image":
        // Handle image blocks
        if (block.content && typeof block.content === "object" && block.content.url) {
          return (
            <img
              src={block.content.url}
              alt="blog content"
              className="preview-block-image"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          );
        }
        return null;
      case "paragraph":
      default:
        // Handle markdown images
        if (block.content.includes("![")) {
          const imageRegex = /!\[.*?\]\((.*?)\)/;
          const match = block.content.match(imageRegex);
          if (match) {
            return (
              <img
                src={match[1]}
                alt="content"
                className="preview-block-image"
              />
            );
          }
        }
        return <p>{block.content}</p>;
    }
  };

  return <div className="preview-block">{renderContent()}</div>;
}
