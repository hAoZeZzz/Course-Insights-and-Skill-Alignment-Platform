import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Mydetail_Student from "./Mydetail-Student";
import "../App.css";

// If user does not login, however him redirect to the mydetail page,
// this will move to homepage.
const Mydetail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <Mydetail_Student />
    </>
  );
};

export default Mydetail;
