import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_ENDPOINT } from "../constants";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  createTheme,
  ThemeProvider,
  experimentalStyled as styled
} from "@mui/material/styles";
import "../App.css";

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
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 680,
      sm: 980,
      md: 1380
    }
  }
});

const truncate = (str, n) => {
  return str.length > n ? str.substring(0, n - 1) + "..." : str;
};

const CourseCard = ({ course }) => (
  <React.Fragment>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h5" component="div">
        {course.name}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {course.code}
      </Typography>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {course.academic_unit}
      </Typography>
      <Typography variant="body2">
        {truncate(course.course_description, 200)}{" "}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" href={course.url} target="_blank">
        Learn More
      </Button>
    </CardActions>
  </React.Fragment>
);

const ProjectCard = ({ project }) => (
  <Card
    variant="outlined"
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%"
    }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h5" component="div">
        {project.name}
      </Typography>
      <Typography sx={{ mb: 1.5 }}>
        <strong>Description: </strong>
        {project.description}
      </Typography>
      <Typography sx={{ fontSize: 14 }}>
        <strong>Skills: </strong>
        {project.skills}
      </Typography>
      <Typography sx={{ fontSize: 14 }}>
        <strong>Size: </strong>
        {project.size}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        <strong>Due Date: </strong>
        {project.due_date}
      </Typography>
    </CardContent>
  </Card>
);

const HomeResult = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get("search");
  const type = searchParams.get("type");
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);

  const getResult = async () => {
    if (type === "course") {
      try {
        const res = await fetch(
          `${API_ENDPOINT}/search?keyword=${searchKeyword}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        const data = await res.json();

        if (data.error) {
          alert(data.error);
        } else {
          setCourses(Array.isArray(data.data) ? data.data : []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch: " + error.message);
      }
    } else if (type === "project") {
      try {
        const res = await fetch(
          `${API_ENDPOINT}/search_projects?keyword=${searchKeyword}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        const data = await res.json();

        if (data.error) {
          alert(data.error);
        } else {
          setProjects(Array.isArray(data.data) ? data.data : []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch: " + error.message);
      }
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {type === "course" ? (
        <div>
          <h1 className="home-result-header">Search Result</h1>
          <h6 className="home-result-header">
            Search Keyword: "{searchKeyword}"
          </h6>
          <h6 className="home-result-header">
            Number of Results: {courses.length}
          </h6>
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={12}
              className="home-result-cards"
            >
              {courses.map((course, index) => (
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={3}
                  key={index}
                  sx={{ display: "flex" }}
                >
                  <Item>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%"
                      }}
                    >
                      <CourseCard course={course} />
                    </Card>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      ) : type === "project" ? (
        <div>
          <h1 className="home-result-header">Search Result</h1>
          <h6 className="home-result-header">
            Search Keyword: "{searchKeyword}"
          </h6>
          <h6 className="home-result-header">
            Number of Results: {projects.length}
          </h6>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3} columns={12}>
              {projects.map((project, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={index}
                  sx={{ display: "flex" }}
                >
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      ) : (
        <div>
          <h1>Other Section</h1>
          {/* 这里可以放置其他类型的内容 */}
        </div>
      )}
    </ThemeProvider>
  );
};

export default HomeResult;
