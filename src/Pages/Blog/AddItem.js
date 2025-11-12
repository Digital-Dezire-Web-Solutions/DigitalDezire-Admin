import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Host from "../../Host/Host";
import logo from "../../Assets/logo.png";

const AddItem = ({ blogToEdit }) => {
  const [title, setTitle] = useState(blogToEdit?.title || "");
  const [description, setDescription] = useState(blogToEdit?.description || "");
  const [image, setImage] = useState(null);
  const [thumbnail1, setThumbnail1] = useState(null);
  const [thumbnail2, setThumbnail2] = useState(null);
  const [imageAlt, setImageAlt] = useState(blogToEdit?.imageAlt || ""); // New Alt Text input
  const [keyword, setKeyword] = useState(blogToEdit?.keyword || ""); // New keyword input
  const [seoScore, setSeoScore] = useState(null);
  const [seoSuggestions, setSeoSuggestions] = useState([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
      Link,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
    ],
    content: blogToEdit?.content || "<p>Write your blog here...</p>",
  });


  // SEO Checker
  const handleCheckSEO = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const plainText = editor.getText();
    const suggestions = [];
    let score = 0;

    // 1️⃣ Title length
    if (title.length >= 50 && title.length <= 60) score += 15;
    else suggestions.push("Title should be between 50–60 characters.");

    // 2️⃣ Description length
    if (description.length >= 120 && description.length <= 160) score += 15;
    else suggestions.push("Description should be between 120–160 characters.");

    // 3️⃣ Keyword checks
    if (keyword) {
      const k = keyword.toLowerCase();
      if (title.toLowerCase().includes(k)) score += 10;
      else suggestions.push("Keyword missing in title.");

      if (description.toLowerCase().includes(k)) score += 10;
      else suggestions.push("Keyword missing in description.");

      if (plainText.slice(0, 300).toLowerCase().includes(k)) score += 10;
      else suggestions.push("Keyword not found in first paragraph.");
    } else {
      suggestions.push("Add a focus keyword for better analysis.");
    }

    // 4️⃣ H1 Tag
    if (content.includes("<h1")) score += 10;
    else suggestions.push("Add at least one H1 tag.");

    // 5️⃣ Image & Alt
    if (content.includes("<img")) {
      score += 5;
      if (content.includes("alt=")) score += 5;
      else suggestions.push("Add alt text to images.");
    } else {
      suggestions.push("Add at least one image.");
    }

    // 6️⃣ Content length
    const wordCount = plainText.trim().split(/\s+/).length;
    if (wordCount > 300) score += 10;
    else suggestions.push("Add more content (minimum 300 words).");

    setSeoScore(score);
    setSeoSuggestions(suggestions);
  };

  // Progress Bar color
  const getBarColor = () => {
    if (seoScore >= 80) return "green";
    if (seoScore >= 50) return "orange";
    return "red";
  };

  // SEO Google Preview
  const renderGooglePreview = () => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return (
      <div className="google-preview">
        <div className="google-pre-box">
          <img src={logo} alt="" />
          <div className="google-pre-content">
            <h4>Digital Dezire Web Solutions</h4>
            <p className="g-url">www.digitaldezire.com/blog/{slug}</p>
          </div>
        </div>
        <h3 className="g-title">{title || "Your Blog Title"}</h3>
        <p className="g-desc">
          {description || "Your meta description will appear here."}
        </p>
      </div>
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("keyword", keyword);
    formData.append("imageAlt", imageAlt);
    formData.append("content", editor.getHTML());
    if (image) formData.append("image", image);
    if (thumbnail1) formData.append("thumbnail1", thumbnail1);
    if (thumbnail2) formData.append("thumbnail2", thumbnail2);

    const url = blogToEdit
      ? `${Host}/api/blog/edit/${blogToEdit._id}`
      : `${Host}/api/blog/add`;
    const method = blogToEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setTitle("");
      setDescription("");
      setKeyword("");
      setImageAlt("");
      setImage(null);
      editor.commands.setContent("<p>Write your blog here...</p>");
    } else {
      alert("Failed to save blog");
    }
  };

  const insertImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "astronivesh_upload");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxwz7mhdg/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        editor.chain().focus().setImage({ src: data.secure_url, alt: imageAlt || "blog image" }).run();
      }
    };
  };

  const setLink = () => {
    const url = window.prompt("Enter the URL");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const MenuBar = () => (
    <div style={{ marginBottom: "10px" }}>
      <button
        type="button"
        className={`btn ${editor.isActive("bold") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        Bold
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("italic") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        Italic
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("underline") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        Underline
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("heading", { level: 1 }) ? "active" : ""
          }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("heading", { level: 2 }) ? "active" : ""
          }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("heading", { level: 3 }) ? "active" : ""
          }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </button>

      <button
        type="button"
        className={`btn ${editor.isActive("heading", { level: 4 }) ? "active" : ""
          }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        H4
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("heading", { level: 5 }) ? "active" : ""
          }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      >
        H5
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("heading", { level: 6 }) ? "active" : ""
          }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
      >
        H6
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("bulletList") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        Bullet List
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("orderedList") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        Ordered List
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("quote") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        Quote
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("code") ? "active" : ""}`}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        Code
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("insertImage") ? "active" : ""}`}
        onClick={insertImage}
      >
        Insert Image
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("insertLink") ? "active" : ""}`}
        onClick={setLink}
      >
        Insert Link
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("undo") ? "active" : ""}`}
        onClick={() => editor.chain().focus().undo().run()}
      >
        Undo
      </button>
      <button
        type="button"
        className={`btn ${editor.isActive("redo") ? "active" : ""}`}
        onClick={() => editor.chain().focus().redo().run()}
      >
        Redo
      </button>
    </div>
  );

  return (
    <div className="Gochar">
      <h3 className="text-lg font-semibold mb-2">
        {blogToEdit ? "Edit" : "Add"} Blog
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="frm-input-box">
          <label htmlFor="title">Title (Meta)</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title"
            required
          />
        </div>
        <div className="frm-input-box">
          <label htmlFor="description">Description (Meta)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter short description"
            required
          />
        </div>
        <div className="frm-input-box">
          <label>Focus Keyword</label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter focus keyword"
          />
        </div>

        <div className="frm-input-box">
          <label>Image Alt Text</label>
          <input
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Enter image alt text"
          />
        </div>
        <div className="blog-image-box">
          <div className="frm-input-box">
            <label htmlFor="image">Image (820 X 410 px - less then 10 mb)</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="frm-input-box">
            <label htmlFor="image">Thumbnail1 (230 X 280 px - less then 10 mb)</label>
            <input type="file" onChange={(e) => setThumbnail1(e.target.files[0])} />
          </div>
          <div className="frm-input-box">
            <label htmlFor="image">Thumbnail2 (380 X 300 px - less then 10 mb)</label>
            <input type="file" onChange={(e) => setThumbnail2(e.target.files[0])} />
          </div>
        </div>

        {/* {editor && <MenuBar />}
      <div className="product-description long">
        <EditorContent
          editor={editor}
        />
      </div> */}
        <div className="product-description">
          {editor && <MenuBar />}
          <h5>Content</h5>
          <div className="product-description blog">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Google Search Preview */}
        <div className="blog-detail-seo-box">
          <div className="google-preview-box">{renderGooglePreview()}</div>
          {/* SEO Score Section */}
          {seoScore !== null && (
            <div className="seo-score-box">
              <h4>SEO Score: {seoScore}/100</h4>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width: `${seoScore}%`,
                    background: getBarColor(),
                  }}
                ></div>
              </div>
              {seoSuggestions.length > 0 ? (
                <ul>
                  {seoSuggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "green" }}>All SEO checks passed ✅</p>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleCheckSEO}
          className="seo-check-btn"
        >
          Check SEO Score
        </button>
        <button className="product-add-btn" type="submit">{blogToEdit ? "Update" : "Add"} Blog</button>
      </form>
    </div>
  );
};

export default AddItem;