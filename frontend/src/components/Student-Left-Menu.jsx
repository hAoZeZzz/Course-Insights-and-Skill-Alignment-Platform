import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ProjectsIcon from "@mui/icons-material/AccountTree";
import GroupsIcon from "@mui/icons-material/Group";
import CoursesIcon from "@mui/icons-material/MenuBook";
import ChatIcon from "@mui/icons-material/Chat";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { styled } from "@mui/material/styles";
import { API_ENDPOINT } from "../constants";
import expand_arrow from "../assets/expand-arrow.svg";
import narrow_arrow from "../assets/narrow-arrow.svg";
import "../App.css";

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  backgroundColor: selected ? "#f0f7fa" : "transparent",
  "&:hover": {
    backgroundColor: selected ? "#f0f7fa" : "#f0f7fa"
  },
  borderRadius: "10px",
  height: "50px",
  display: "flex"
}));

const StyledListItemText = styled(ListItemText)(({ theme, selected }) => ({
  color: selected ? theme.palette.primary.main : "inherit"
}));

const menuItems = [
  { text: "All Courses", icon: <CoursesIcon />, href: "/dashboard/allcourses" },
  {
    text: "All Projects",
    icon: <ProjectsIcon />,
    href: "/dashboard/allprojects"
  },
  { text: "All Groups", icon: <GroupsIcon />, href: "/dashboard/allgroups" },

  { text: "Messages", icon: <ChatIcon />, href: "/dashboard/chatroom" }
];

const StudentLeftMenu = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const handleListItemClick = (href) => {
    navigate(href);
  };
  const [isFull, setIsFull] = useState(() => {
    const savedState = localStorage.getItem("sidebarState");
    return savedState ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarState", JSON.stringify(isFull));
  }, [isFull]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000) {
        setIsFull(false);
      } else {
        setIsFull(true);
      }
    };

    window.addEventListener("resize", handleResize);

    // Check the width when the component mounts
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStudentLeftMenuClick = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        const StudentId = data.data.id;
        navigate(`/mydetail/${StudentId}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  const handleClickSizeButton = () => {
    setIsFull(!isFull);
  };

  return (
    <div className={`Dashboard-sidebar ${isFull ? "" : "compact"}`}>
      <List>
        <img
          src={isFull ? narrow_arrow : expand_arrow}
          alt=""
          className={isFull ? "narrow-arrow" : "expand-arrow"}
          onClick={handleClickSizeButton}
        />
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton
              selected={location.pathname === item.href}
              onClick={() => handleListItemClick(item.href)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {isFull && (
                <StyledListItemText
                  primary={item.text}
                  selected={location.pathname === item.href}
                />
              )}
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>

      <div className={`Dashboard-button-container ${isFull ? "" : "compact"}`}>
        <Button
          variant="contained"
          color="primary"
          className={`my-details-button ${isFull ? "" : "compact"}`}
          onClick={handleStudentLeftMenuClick}
        >
          <ManageAccountsIcon className="my-details-icon" />
          <span>MY DETAILS</span>
        </Button>
      </div>
    </div>
  );
};

export default StudentLeftMenu;
