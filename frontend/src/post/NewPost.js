import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiPost";
import { Redirect } from "react-router-dom";

const NewPost = () => {
  const [state, setState] = useState({
    title: "",
    body: "",
    photo: "",
    error: "",
    user: {},
    fileSize: 0,
    loading: false,
    redirectToProfile: false,
    postData: new FormData(),
  });

  useEffect(() => {
    setState({ ...state, user: isAuthenticated().user });
  }, []);

  const isValid = () => {
    const { title, body } = state;

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
    state.postData.set(name, value);
    setState({ ...state, [name]: value, fileSize });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setState({ ...state, loading: true });

    if (isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, state.postData).then((data) => {
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

  const newPostForm = (title, body) => (
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
        Create Post
      </button>
    </form>
  );

  const { title, body, user, error, loading, redirectToProfile } = state;

  if (redirectToProfile) {
    return <Redirect to={`/user/${user._id}`} />;
  }

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Create a new post</h2>
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

      {newPostForm(title, body)}
    </div>
  );
};

export default NewPost;
