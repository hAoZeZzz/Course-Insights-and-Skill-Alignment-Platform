import { Routes, Route, Link, useLocation } from "react-router-dom";
import Test from "./Test";
import Dashboard from "./Dashboard";
import Admin from "./Admin";
import Footer from "./Footer";
import Register from "./Register";
import Login from "./Login";
import Header from "./Header";
import Reset from "./Reset";
import HomeResult from "./HomeResult";
import Mydetail from "./Mydetail";
import Dashboard_Allcourses_Student from "./Dashboard-Allcourses-Students";
import Dashboard_Allgroups_Student from "./Dashboard-Allgroups-Students";
import Dashboard_Allprojects_Student from "./Dashboard-Allprojects-Students";
import Dashboard_Course_Detail from "./Dashboard-Course-Detail";
import Dashboard_Group_Detail from "./Dashboard-Group-Detail";
import Dashboard_Project_Detail from "./Dashboard-Project-Detail";
import LandingPages from "./LandingPages";
import LandingSearch from "./Landing-Search";
import Dashboard_Chatroom_page from "./Dashboard-Chatroom-Page";
import "../App.css";

/**
 * PageList component
 * 
 * This component serves as the main router for the application, defining all the routes and their corresponding components.
 * It includes a Header, Footer, and conditional styling for the home page.
 * The Routes component from react-router-dom is used to define different paths and render the appropriate components.
 * The useLocation hook is utilized to check the current pathname to conditionally render elements.
 */

const PageList = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="landingPageSearchFather">
      <Header />
      {!isHomePage && <hr className="zero-margin-hr" />}
      <Routes>
        <Route path="/" element={<LandingPages />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/dashboard/allcourses"
          element={<Dashboard_Allcourses_Student />}
        />
        <Route
          path="/dashboard/allprojects"
          element={<Dashboard_Allprojects_Student />}
        />
        <Route
          path="/dashboard/allgroups"
          element={<Dashboard_Allgroups_Student />}
        />
        <Route
          path="/dashboard/chatroom"
          element={<Dashboard_Chatroom_page />}
        />
        <Route path="/test" element={<Test />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/landing-result" element={<HomeResult />} />
        <Route path="/mydetail/:id" element={<Mydetail />} />
        <Route
          path="/dashboard/allcourses/:id"
          element={<Dashboard_Course_Detail />}
        />
        <Route
          path="/dashboard/allprojects/:id"
          element={<Dashboard_Project_Detail />}
        />
        <Route
          path="/dashboard/allgroups/:id"
          element={<Dashboard_Group_Detail />}
        />
        <Route path="/landing-search" element={<LandingSearch />} />
      </Routes>
      <hr className="zero-margin-hr" />
      <Footer />
    </div>
  );
};

export default PageList;
