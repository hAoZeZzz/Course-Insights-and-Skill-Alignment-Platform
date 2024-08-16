import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import StudentLeftMenu from "./Student-Left-Menu";

const Dashboard_Student = () => {
  return (
    <div className="Dashboard-root">
        <StudentLeftMenu/>
      <div className="Dashboard-main-content">
      </div>
    </div>
  );
};
export default Dashboard_Student;
