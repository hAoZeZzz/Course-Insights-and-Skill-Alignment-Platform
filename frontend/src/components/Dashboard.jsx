import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard_Academic from "./Dashboard-Academic";
import Dashboard_Student from "./Dashboard-Student";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <Dashboard_Student />
    </>
  );
};

export default Dashboard;
