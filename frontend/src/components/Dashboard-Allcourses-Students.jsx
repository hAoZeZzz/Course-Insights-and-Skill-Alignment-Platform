import React from "react";
import StudentLeftMenu from "./Student-Left-Menu";
import Student_Right_Allcourses from "./Student-Right-Allcourses.jsx";

const Dashboard_Allcourses_Student = () => {
  return (
    <div className="Dashboard-root">
      <StudentLeftMenu />
      <Student_Right_Allcourses />
    </div>
  );
};

export default Dashboard_Allcourses_Student;
