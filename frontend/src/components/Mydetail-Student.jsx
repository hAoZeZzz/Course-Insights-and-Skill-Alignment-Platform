import StudentLeftMenu from "./Student-Left-Menu";
import Student_Right_Mydetail from "./Student-Right-Mydetail";
import "../App.css";

const Mydetail_Student = () => {
  return (
    <div className="Dashboard-root">
      <StudentLeftMenu />
      <Student_Right_Mydetail/>
    </div>
  );
};

export default Mydetail_Student;
