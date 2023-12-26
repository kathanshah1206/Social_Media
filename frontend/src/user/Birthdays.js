import React, { useState, useEffect } from "react";
import { list } from "./apiUser";
import DefaultProfile from "../images/avatar.jpg";
import { Link } from "react-router-dom";

const Birthdays = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });
  }, []);

  const renderUsers = (users) => (
    <div className="row">
      {users.map((user, i) => (
        <div className="card col-md-4" key={i}>
          <img
            style={{ height: "200px", width: "auto" }}
            className="img-thumbnail"
            src={`http://localhost:8080/api/user/photo/${user._id}`}
            onError={(e) => (e.target.src = `${DefaultProfile}`)}
            alt={user.name}
          />
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-raised btn-primary btn-sm"
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Birthdays</h2>
      {renderUsers(
        users.filter(
          (user) =>
            new Date().toString().substring(0, 15) ===
            new Date(user.birthday).toString().substring(0, 15)
        )
      )}
    </div>
  );
};

export default Birthdays;
