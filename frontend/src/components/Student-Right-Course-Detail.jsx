import React, { useEffect, useState } from "react";
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
  Typography,
  Grid,
  Card

} from "@mui/material";
import "../App";
import { API_ENDPOINT } from "../constants";
import {
  createTheme,
  ThemeProvider,
  experimentalStyled as styled
} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import ProjectCard from "./ProjectCard";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
  height: "100%",
  display: "flex",
  flexDirection: "column"
}));

const Student_Right_Course_Detail = () => {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const courseID = useParams();
  const [courseInfo, setCourseInfo] = useState(null);
  const token = localStorage.getItem("token");

  const getCourseInfo = async () => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/dashboard/allcourses?keyword=${courseID.id.toLowerCase()}`,
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
        setCourseInfo(data.data[0]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  useEffect(() => {
    getCourseInfo();
  }, [courseID]);

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
  // Add Join Group feature in this function
  const handleYesButtonClick = async () => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/dashboard/learnt?code=${courseID.id.toLowerCase()}`,
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
        throw new Error("Failed to modify course status");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
    setOpen(false);
  };

  if (!courseInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail-page-right">
      <div className="detail-page-right-name">{courseInfo.name}</div>
      <div className="detail-page-right-course-details-container">
        <div className="detail-page-right-course-details-left">
          <p className="detail-page-right-description">
            <strong style={{ fontSize: "1.2em" }}>Course code: </strong>{" "}
            {courseInfo.code}
          </p>
          <p className="detail-page-right-description">
            <strong style={{ fontSize: "1.2em" }}>Academic Unit: </strong>
            {courseInfo.academic_unit}
          </p>
          <p className="detail-page-right-description">
            <strong style={{ fontSize: "1.2em" }}>Skills: </strong>
            {courseInfo.skills
              .slice(0, 3)
              .map((skill) => skill.name)
              .join(", ")}
          </p>
        </div>
        <div className="detail-page-right-course-details-right">
          <p className="detail-page-right-description">
            <strong style={{ fontSize: "1.2em" }}>URL: </strong>
            <a href={courseInfo.url}>Link to {courseInfo.code} Website</a>
          </p>
        </div>
      </div>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Project detail tabs"
      >
        <Tab label="Description" />
        <Tab label="Outcomes" />
        <Tab label="Related Projects" />
        {/* <Tab label="Discussion" /> */}
      </Tabs>
      <Box role="tabpanel" hidden={value !== 0}>
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
          {courseInfo.course_description}
        </Typography>
      </Box>
      <Box role="tabpanel" hidden={value !== 1}>
        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
          {courseInfo.course_outcome}
        </Typography>
      </Box>
      <Box role="tabpanel" hidden={value !== 2}>
        {courseInfo.projects.map((project, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={index}
            sx={{ display: "flex" }}
          >
            <Item sx={{ width: "250px" }}>
              <Card
                variant="contained"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "150px",
                  width: "150px"
                }}
              >
                <ProjectCard project={project} />
              </Card>
            </Item>
          </Grid>
        ))}
      </Box>

      <div>
        <Button
          variant="contained"
          style={{ marginRight: "10px" }}
          onClick={handleJoinButtonClick}
        >
          Learnt
        </Button>
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
        <DialogTitle id="alert-dialog-title">{"Learnt Course"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Would you like to add this course to the ones you have already
            taken?
          </DialogContentText>
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

export default Student_Right_Course_Detail;
