import StudentLeftMenu from "./Student-Left-Menu";
import Student_Right_Project_Detail from "./Student-Right-Project-Detail";

const Dashboard_Project_Detail = () => {
  return (
    <>
      <div className="Dashboard-root">
        <StudentLeftMenu />
        <Student_Right_Project_Detail />
      </div>
    </>
  );
};
export default Dashboard_Project_Detail;
