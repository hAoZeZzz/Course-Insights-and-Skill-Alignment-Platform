import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Tabs,
  Tab,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Card,
  Chip
} from "@mui/material";
import { API_ENDPOINT } from "../constants";
import { createTheme, experimentalStyled as styled } from "@mui/material/styles";
import GroupCard from "./GroupCard";
import MemberCard from "./MemberCard";
import { ro } from "date-fns/locale";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const Student_Right_Project_Detail = () => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const navigate = useNavigate();
  const { id: projectID } = useParams();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [projectInfo, setProjectInfo] = useState(null);
  const [groupIDs, setGroupIDs] = useState([]);
  const [groups, setGroups] = useState([]);
  const [myGroup, setMyGroup] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [join, setJoin] = useState(false);
  const [recomMembers, setRecomMembers] = useState([]);

  const getMyGroup = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/mygroups`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await res.json()
      if (data.error) {
        alert(data.error);
      } else {
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].project_id.toString() === projectID) {
            setMyGroup(data.data[i]);
            setIsDisabled(false);
          }
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  }

  useEffect(() => {
    if (role === 'student') {
      getMyGroup();
    }
  }, [])

  useEffect(() => {
    if (role === 'student') {
      getMyGroup();
    }
  }, [join])

  const getMembersRecommended = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/recom_members?project_id=${projectID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.error) {
        throw new Error("Failed to get members recommended");
      } else {
        setRecomMembers(data.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  }

  useEffect(() => {
    if (value === 4 && role === 'student') {
        getMembersRecommended();
    }
  }, [value])

  const getProjectInfo = async () => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/dashboard/project_detail?keyword=${projectID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      if (data.error) {
        throw new Error("Failed to get course information");
      } else {
        setProjectInfo(data.data);
        setGroupIDs(data.data.groups);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  }

  useEffect(() => {
    getProjectInfo();
  }, [projectID])

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupDetails = await Promise.all(
          groupIDs.map(id =>
            fetch(`${API_ENDPOINT}/dashboard/group_detail?keyword=${id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              }
            })
              .then(response => response.json())
          )
        );
        setGroups(groupDetails);
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch: " + error.message);
      };
    }
    fetchGroup();
  }, [groupIDs])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleJoinButtonClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const joinGroup = async () => {
    try {
      const payload = {
        group_id: selectedGroup
      };
      const res = await fetch(`${API_ENDPOINT}/join_group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text(); 
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorText}`);
      }

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert("Join successfully");
        setJoin(true);
      }
    } catch (error) {
      alert("Failed to fetch: 3" + error.message);
    }
  }

  const handleYesButtonClick = () => {
    joinGroup();
    setOpen(false);
  };

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value.toString());
  };

  if (!projectInfo) {
    return <div>Loading...</div>;
  }
  return (
    <div className="detail-page-right">
      <div className="detail-page-right-name">{projectInfo.name}</div>
      <p className="detail-page-right-description">due_date: {projectInfo.due_date}</p>
      <p className="detail-page-right-description">Size: {projectInfo.size}</p>
      <p className="detail-page-right-description">Related Course: {projectInfo.relate_course ? (projectInfo.relate_course) : ("No related course")}</p>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Project detail tabs"
      >
        <Tab label="Description" />
        <Tab label="Skills" />
        {role === 'student' && <Tab label="Groups" />}
        {role === 'student' && <Tab label="My group" disabled={isDisabled} />}
        {role === 'student' && <Tab label="Members Recommended" />}
      </Tabs>
      <Box role="tabpanel" hidden={value !== 0}>
        <div>{projectInfo.description}</div>
      </Box>
      <Box role="tabpanel" hidden={value !== 1}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {projectInfo.skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              sx={{
                fontSize: '16px',
                padding: '10px',
              }}
              color="success"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
      {role === 'student' && (
        <Box role="tabpanel" hidden={value !== 2}>
          <Grid
            container
            spacing={3}
            columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
            className="home-result-cards"
            justifyContent="flex-start"
            marginBottom="20px"
          >
            {groups.map((group, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={index}
                sx={{ display: "flex" }}
              >
                <Item sx={{ width: "100%" }}>
                  <Card
                    variant="outlined"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      width: "100%",
                      minWidth: "200px", 
                    }}
                  >
                    <GroupCard group={group.data} />
                  </Card>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {role === 'student' && (
        <Box role="tabpanel" hidden={value !== 3}>
          <Grid
            container
            spacing={3}
            columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
            className="home-result-cards"
            justifyContent="flex-start"
            marginBottom="20px"
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ display: "flex" }}
            >
              <Item sx={{ width: "100%" }}>
                <Card
                  variant="outlined"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    minWidth: "200px", 
                  }}
                >
                  <GroupCard group={myGroup} />
                </Card>
              </Item>
            </Grid>
          </Grid>
        </Box>
      )}
      {role === 'student' && (
        <Box role="tabpanel" hidden={value !== 4}>
          <Grid
            container
            spacing={2}
            columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
            className="home-result-cards"
            justifyContent="flex-start"
            marginBottom="20px"
          >
            {recomMembers.map((member, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={index}
                sx={{ display: "flex" }}
              >
                <Item sx={{ width: "100%" }}>
                  <Card
                    variant="outlined"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      width: "100%",
                      minWidth: "200px",
                    }}
                  >
                    <MemberCard member={member} />
                  </Card>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <div>
        {role === 'student' && (
          <Button
            hidden={value !== 2}
            variant="contained"
            style={{ marginRight: "10px" }}
            onClick={handleJoinButtonClick}
          >
            Join as group member
          </Button>
        )}
        <Button variant="contained" onClick={handleBackButtonClick}>
          Back
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Join Project"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Choose a group to join this project.
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="group-select-label">Group</InputLabel>
            <Select
              labelId="group-select-label"
              value={selectedGroup}
              onChange={handleGroupChange}
            >
              {groups.map((group, index) => (
                <MenuItem key={index} value={group.data.id}>
                  {group.data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleYesButtonClick} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Student_Right_Project_Detail;
