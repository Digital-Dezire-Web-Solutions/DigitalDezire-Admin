import { useParams, useNavigate } from "react-router-dom";
import AddItem from "./AddItem";
import { useEffect, useState } from "react";
import Host from "../../Host/Host";

const EditItem = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${Host}/api/blog/all`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p._id === id);
        if (found) setBlog(found);
      });
  }, [id]);

  const handleBlogSaved = () => {
    navigate("/blog");
  };

  return blog ? (
    <AddItem blogToEdit={blog} onBlogSaved={handleBlogSaved} />
  ) : (
    <p>Loading...</p>
  );
};

export default EditItem;