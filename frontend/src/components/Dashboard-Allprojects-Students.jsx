import StudentLeftMenu from "./Student-Left-Menu";
import Student_Right_Allprojects from "./Student-Right-Allprojects";
const Dashboard_Allprojects_Student = () => {
  return (
    <>
      <div className="Dashboard-root">
        <StudentLeftMenu />
        <Student_Right_Allprojects />
      </div>
    </>
  );
};
export default Dashboard_Allprojects_Student;
