import React, { useState, useEffect } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import DefaultPost from "../images/mountains.jpg";

const EditPost = (props) => {
  const [state, setState] = useState({
    id: "",
    imgId: "",
    title: "",
    body: "",
    redirectToProfile: false,
    error: "",
    fileSize: 0,
    loading: false,
  });

  const {
    id,
    imgId,
    title,
    body,
    redirectToProfile,
    error,
    fileSize,
    loading,
  } = state;

  useEffect(() => {
    const postId = props.match.params.postId;
    init(postId);
  }, [props.match.params.postId]);

  const init = (postId) => {
    singlePost(postId).then((data) => {
      if (data.error) {
        setState({ ...state, redirectToProfile: true });
      } else {
        setState({
          ...state,
          imgId: data._id,
          id: data.postedBy._id,
          title: data.title,
          body: data.body,
          error: "",
        });
      }
    });
  };

  const postData = new FormData();

  const isValid = () => {
    if (title.length === 0 || body.length === 0) {
      setState({ ...state, error: "All fields are required", loading: false });
      return false;
    }
    return true;
  };

  const handleChange = (name) => (event) => {
    setState({ ...state, error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    postData.set(name, value);
    setState({ ...state, [name]: value, fileSize });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setState({ ...state, loading: true });

    if (isValid()) {
      const postId = props.match.params.postId;
      const token = isAuthenticated().token;

      update(postId, token, postData).then((data) => {
        if (data.error) setState({ ...state, error: data.error });
        else {
          setState({
            ...state,
            loading: false,
            title: "",
            body: "",
            redirectToProfile: true,
          });
        }
      });
    }
  };

  const editPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Post Photo</label>
        <input
          onChange={handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Body</label>
        <textarea
          onChange={handleChange("body")}
          type="text"
          className="form-control"
          value={body}
        />
      </div>

      <button onClick={clickSubmit} className="btn btn-raised btn-primary">
        Update Post
      </button>
    </form>
  );

  if (redirectToProfile) {
    return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
  }

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">{title}</h2>

      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>

      {loading ? (
        <div className="jumbotron text-center">
          <h2>Loading...</h2>
        </div>
      ) : (
        ""
      )}

      <img
        style={{ height: "200px", width: "auto" }}
        className="img-thumbnail"
        src={`http://localhost:8080/api/post/photo/${imgId}?${new Date().getTime()}`}
        onError={(i) => (i.target.src = `${DefaultPost}`)}
        alt={title}
      />

      {isAuthenticated().user.role === "admin" && editPostForm(title, body)}

      {isAuthenticated().user._id === id && editPostForm(title, body)}
    </div>
  );
};

export default EditPost;
