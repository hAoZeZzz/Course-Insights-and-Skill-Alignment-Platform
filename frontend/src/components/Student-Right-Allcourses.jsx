import "../App.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { API_ENDPOINT } from "../constants";
import CircularProgress from "@mui/material/CircularProgress";



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
      xs: 750,
      sm: 850,
      md: 1380
    }
  }
});

const truncate = (str, n) => {
  return str?.length > n ? str.substring(0, n - 1) + "..." : str;
};

const CourseCard = ({ course }) => (
  <React.Fragment>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
        {course.name}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong style={{ fontSize: "1.2em" }}>Code: </strong>{" "}
        {truncate(course.code, 200)}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong style={{ fontSize: "1.2em" }}>Course Summary: </strong>{" "}
        {truncate(course.summary, 200)}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong style={{ fontSize: "1.2em" }}>Academic Unit:</strong>{" "}
        {truncate(course.academic_unit, 200)}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong style={{ fontSize: "1.2em" }}>Project Number: </strong>{" "}
        {course.project.length}
      </Typography>
      <Typography
        sx={{ fontSize: 14, mb: 1 }}
        color="text.secondary"
        gutterBottom
      >
        <strong style={{ fontSize: "1.1em" }}>Skills: </strong> {course.skills}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" href={course.url}>
        Learn More
      </Button>
    </CardActions>
  </React.Fragment>
);

const Student_Right_Allcourses = () => {
  const [courses, setCourses] = useState([]);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const token = localStorage.getItem("token");

  const getAllCourse = async () => {
    let APIurl = "";
    if (searchText === "") {
      APIurl = `${API_ENDPOINT}/dashboard/allcourses`;
    } else {
      APIurl = `${API_ENDPOINT}/dashboard/allcourses?keyword=${searchText}`;
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
        setPages(Math.ceil(data.data.length / 12));
        const mydata = data.data.map((item) => ({
          project: item.projects,
          name: item.name,
          code: item.code,
          academic_unit: item.academic_unit,
          url: `/dashboard/allcourses/${item.code}`,
          summary: item.summary,
          skills: item.skills
            .slice(0, 3)
            .map((e) => e.name)
            .join(", ")
        }));
        setCourses(mydata);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  useEffect(() => {
    getAllCourse();
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastCourse = currentPage * 12;
  const indexOfFirstCourse = indexOfLastCourse - 12;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  return courses.length === 0 ? (
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
            onClick={getAllCourse}
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
          >
            {currentCourses.map((course, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
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

export default Student_Right_Allcourses;
