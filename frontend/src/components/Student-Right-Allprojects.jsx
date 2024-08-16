import "../App.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import {  } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {
  createTheme,
  ThemeProvider,
  experimentalStyled as styled
} from "@mui/material/styles";
import * as React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { API_ENDPOINT } from "../constants";
import CircularProgress from "@mui/material/CircularProgress";

// const handleSearchButtonClick = () => {
//   console.log(122);
// };

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
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
});

const truncate = (str, n) => {
  return str?.length > n ? str.substring(0, n - 1) + "..." : str;
};

const ProjectCard = ({ project }) => (
  <React.Fragment>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
        {project.name}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong style={{ fontSize: "1.2em" }}>Project Description:</strong>{" "}
        {truncate(project.description, 200)}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong style={{ fontSize: "1.2em" }}>Max Groups:</strong>{" "}
        {project.size}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong style={{ fontSize: "1.2em" }}>Due Date:</strong>{" "}
        {project.due_date}
      </Typography>
      <Typography
        sx={{ fontSize: 14, mb: 1 }}
        color="text.secondary"
        gutterBottom
      >
        <strong style={{ fontSize: "1.1em" }}>Project Skills:</strong>{" "}
        {project.skills.join(", ")}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" href={project.url}>
        Learn More
      </Button>
    </CardActions>
  </React.Fragment>
);

const Student_Right_Allprojects = () => {
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const get_Dashboard_Allprojects = async () => {
    let APIurl = "";
    if (searchText === "") {
      APIurl = `${API_ENDPOINT}/dashboard/allprojects`;
    } else {
      APIurl = `${API_ENDPOINT}/dashboard/allprojects?keyword=${searchText}`;
    }

    try {
      const res = await fetch(APIurl, {
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
        const formatProjectsData = (data) => {
          return data.map((item) => ({
            name: item.name,
            description: item.description,
            size: item.size,
            skills: item.skills,
            due_date: item.due_date,
            url: `/dashboard/allprojects/${item.id}`
          }));
        };
        const formatData = formatProjectsData(data.data);
        setProjects(formatData);
        setPages(Math.ceil(formatData.length / 12));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastProject = currentPage * 12;
  const indexOfFirstProject = indexOfLastProject - 12;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  useEffect(() => {
    get_Dashboard_Allprojects();
  }, []);
  return projects.length === 0 ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh"
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <div className="Dashboard-main-content">
      <Box className="Detail_StudentRightBox">
        <Box className="Detail-SearchBox" mb={3} sx={{ width: "100%" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search"
            InputProps={{
              style: { backgroundColor: "#E0E0E0", borderRadius: "50px" }
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <Button
            className="Detail-Search-Button"
            sx={{
              fontSize: "1.2rem",
              padding: "10px",
              height: "50px",
              width: "120px",
              marginBottom: "20px",
              textTransform: "none",
              borderRadius: "30px"
            }}
            onClick={get_Dashboard_Allprojects}
          >
            Search
          </Button>
        </Box>
      </Box>
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={2}
            columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
            className="home-result-cards"
            justifyContent="flex-start"
          >
            {currentProjects.map((project, index) => (
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
                      minWidth: "200px" // Ensure a minimum width for smaller screens
                    }}
                  >
                    <ProjectCard project={project} />
                  </Card>
                </Item>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Stack spacing={2}>
              <Pagination
                count={pages}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                color="primary"
              />
            </Stack>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default Student_Right_Allprojects;
