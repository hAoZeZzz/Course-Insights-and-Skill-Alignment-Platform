import StudentLeftMenu from "./Student-Left-Menu";
import Student_Right_Course_Detail from "./Student-Right-Course-Detail";
const Dashboard_Course_Detail = () => {
  return (
    <>
      <div className="Dashboard-root">
        <StudentLeftMenu />
        <Student_Right_Course_Detail/>
      </div>
    </>
  );
};
export default Dashboard_Course_Detail;
