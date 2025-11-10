import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteContext from "../../Context/NoteContext";
import { Pen, X } from "lucide-react";
import Host from "../../Host/Host";
import "./Blog.css";

const Blog = () => {
  const { notes, getBlogs } = useContext(NoteContext);
  const navigate = useNavigate();
  const blogs = notes;

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getBlogs();
    }
  }, [navigate]);

  const deleteBlog = async (id) => {
    const res = await fetch(`${Host}/api/blog/delete/${id}`, {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
    });
    if (res.ok) getBlogs();
  };

  return (
    <div className="Gochar">
      <div className="Gochar-button">
        <h3>Blogs</h3>
      </div>
      <div className="Gochar-box">
        {blogs.map((blog) => (
          <div key={blog._id} className="Gochar-card">
            <div className="Gochar-card-head">
              <h5>{blog.title}</h5>
              <div className="gochar-card-button">
                <p onClick={() => navigate(`/blog/edit/${blog._id}`)}>
                  <Pen />
                </p>
                <p onClick={() => deleteBlog(blog._id)}>
                  <X />
                </p>
              </div>
            </div>
            <div className="gochar-card-box">
              <img src={blog.image} alt="" />
              <p>{blog.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
