import React, { useState, useEffect } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import DefaultPost from "../images/mountains.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Comment from "./Comment";

const SinglePost = ({ match }) => {
  const [postState, setPostState] = useState({
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: [],
  });

  const { post, redirectToHome, redirectToSignin, like, likes, comments } =
    postState;

  useEffect(() => {
    const postId = match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPostState({
          post: data,
          likes: data.likes.length,
          like: checkLike(data.likes),
          comments: data.comments,
        });
      }
    });
  }, [match.params.postId]);

  const checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  const updateComments = (updatedComments) => {
    setPostState({ ...postState, comments: updatedComments });
  };

  const likeToggle = () => {
    if (!isAuthenticated()) {
      setPostState({ ...postState, redirectToSignin: true });
      return false;
    }

    let callApi = like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPostState({
          ...postState,
          like: !like,
          likes: data.likes.length,
        });
      }
    });
  };

  const deletePost = () => {
    const postId = match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPostState({ ...postState, redirectToHome: true });
      }
    });
  };

  const deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your post?");
    if (answer) {
      deletePost();
    }
  };

  const renderPost = (post) => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";

    return (
      <div className="card-body">
        <img
          src={`http://localhost:8080/api/post/photo/${post._id}`}
          alt={post.title}
          onError={(e) => (e.target.src = `${DefaultPost}`)}
          className="img-thumbnail mb-3"
          style={{
            height: "300px",
            width: "100%",
            objectFit: "cover",
          }}
        />

        {like ? (
          <h3 onClick={likeToggle}>
            <i
              className="fa fa-thumbs-up text-success bg-dark"
              style={{ padding: "10px", borderRadius: "50%" }}
            />{" "}
            {likes} Like
          </h3>
        ) : (
          <h3 onClick={likeToggle}>
            <i
              className="fa fa-thumbs-up text-warning bg-dark"
              style={{ padding: "10px", borderRadius: "50%" }}
            />{" "}
            {likes} Like
          </h3>
        )}

        <p className="card-text">{post.body}</p>
        <br />
        <p className="font-italic mark">
          Posted by <Link to={`${posterId}`}>{posterName} </Link> on{" "}
          {new Date(post.created).toDateString()}
        </p>
        <div className="d-inline-block">
          <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">
            Back to posts
          </Link>

          {isAuthenticated().user &&
            isAuthenticated().user._id === post.postedBy._id && (
              <>
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-raised btn-warning btn-sm mr-5"
                >
                  Update Post
                </Link>
                <button
                  onClick={deleteConfirmed}
                  className="btn btn-raised btn-danger"
                >
                  Delete Post
                </button>
              </>
            )}

          <div>
            {isAuthenticated().user &&
              isAuthenticated().user.role === "admin" && (
                <div class="card mt-5">
                  <div className="card-body">
                    <h5 className="card-title">Admin</h5>
                    <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                    <Link
                      to={`/post/edit/${post._id}`}
                      className="btn btn-raised btn-warning btn-sm mr-5"
                    >
                      Update Post
                    </Link>
                    <button
                      onClick={deleteConfirmed}
                      className="btn btn-raised btn-danger"
                    >
                      Delete Post
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  };

  if (redirectToHome) {
    return <Redirect to={`/`} />;
  } else if (redirectToSignin) {
    return <Redirect to={`/signin`} />;
  }

  return (
    <div className="container">
      <h2 className="display-2 mt-5 mb-5">{post.title}</h2>

      {!post ? (
        <div className="jumbotron text-center">
          <h2>Loading...</h2>
        </div>
      ) : (
        renderPost(post)
      )}

      <Comment
        postId={post._id}
        comments={comments.reverse()}
        updateComments={updateComments}
      />
    </div>
  );
};

export default SinglePost;
