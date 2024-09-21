import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetLoggedInUserDetails } from "../apicalls/users";
import { HideLoading, ShowLoading } from "../redux/loadersSlice";
import { SetUser } from "../redux/usersSlice";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const validateUserToken = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetLoggedInUserDetails();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        localStorage.removeItem("token");
        navigate("/login");
        message.error(response.message);
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      validateUserToken();
    }
  }, []);

  return (
    <div>
      {user && (
        <div className="flex home-layout">
          <div className="header bg-primary flex  flex-col rounded items-center home-menu">
            <h1
              className="text-2xl text-white font-bold cursor-pointer"
              onClick={() => navigate("/")}
            >
              Library Management System
            </h1>

            <div className="font-bold user-menu">
              {/* <i className="ri-shield-user-line "></i> */}
              <span className="text-2xl font-bold">Role: {user.role}</span>
              <span
                className=" text-2xl font-bold cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                {user.name.toUpperCase()}
              </span>

              <span
                className="text-2xl font-bold underline"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              >
                Log out
              </span>
              {/* <i
                className="ri-logout-box-r-line ml-2"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              ></i> */}
            </div>
          </div>

          <div className="content home-con ">{children}</div>
        </div>
      )}
    </div>
  );
}

export default ProtectedRoute;
