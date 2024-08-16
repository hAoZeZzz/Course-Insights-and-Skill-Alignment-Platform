import { useState, useEffect } from 'react';
import AdminUserCard from './AdminUserCard'
import AdminCourseCard from './AdminCourseCard';
import AdminProjectCard from './AdminProjectCard';
import AdminGroupCard from './AdminGroupCard';
import List from '@mui/material/List';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ProjectsIcon from "@mui/icons-material/AccountTree";
import CoursesIcon from "@mui/icons-material/MenuBook";
import ChatIcon from '@mui/icons-material/Chat';
import GroupsIcon from "@mui/icons-material/Group";
import ListItemText from "@mui/material/ListItemText";

const Admin = () => {
  const [selectedMenu, setSelectedMenu] = useState('User');

  const handleMenuClick = (menuName) => {
    setSelectedMenu(menuName);
  };

  return (
    <div style={{ display: 'flex', height:'900px'}}>
      <List component="nav" aria-label="main mailbox folders" 
      style={{
        marginRight:'20px',
        width:'180px',
        background:'#f0f7fa'}}>
        <ListItemButton
          onClick={()=>{handleMenuClick('User')}}
        >
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="User" />
        </ListItemButton>
        <ListItemButton
          onClick={()=>{handleMenuClick('Project')}}
        >
          <ListItemIcon>
            <ProjectsIcon />
          </ListItemIcon>
          <ListItemText primary="Project" />
        </ListItemButton>
        <ListItemButton
          onClick={()=>{handleMenuClick('Course')}}
        >
          <ListItemIcon>
            <CoursesIcon />
          </ListItemIcon>
          <ListItemText primary="Course" />
        </ListItemButton>
        <ListItemButton
          onClick={()=>{handleMenuClick('Group')}}
        >
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText primary="Group" />
        </ListItemButton>
      </List>
      
      <div style={{ flex: 1, padding: '20px', height:'900px' }}>
        {selectedMenu === 'User' && 
          <AdminUserCard />}
        {selectedMenu === 'Project' && 
          <AdminProjectCard />}
        {selectedMenu === 'Course' && 
          <AdminCourseCard />}
        {selectedMenu === 'Group' && 
          <AdminGroupCard />}
      </div>
    </div>
  );
};

export default Admin;