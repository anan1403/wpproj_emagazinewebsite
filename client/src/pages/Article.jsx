import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [liked, setLiked] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await API.get(`/articles/${id}`);
        console.log(res.data);
        setArticle(res.data);
        setLiked(res.data.likes.includes(userId));
      } catch (err) {
        console.log(err);
      }
    };
    fetchArticle();
  }, [id]);
  const handleLike = async () => {
  try {
    await API.put(`/articles/like/${id}`);
    setLiked(!liked);
  } catch (err) {
    console.log(err);
  }
};

  if (!article || Object.keys(article).length === 0) {
  return <p>Loading...</p>;
}

  return (
    <div style={styles.container}>
      <h1>{article.title}</h1>
      <button onClick={handleLike} style={styles.button}>
        {liked ? "💔 Unlike" : "❤️ Like"}
      </button>
      <p>{article.content}</p>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "auto"
  },
  button: {
  padding: "10px 15px",
  margin: "10px 0",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#9b5cff",
  color: "white"
}
};

export default Article;