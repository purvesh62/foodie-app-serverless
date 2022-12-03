import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ redirectPath = "/", children }) => {
  if (!localStorage.getItem("email")) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
