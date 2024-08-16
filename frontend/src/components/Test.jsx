import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState, useEffect } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import "../App.css";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider, experimentalStyled as styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { API_ENDPOINT } from "../constants";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

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
      xs: 680,
      sm: 980,
      md: 1380,
    },
  },
});

const truncate = (str, n) => {
  return str.length > n ? str.substring(0, n - 1) + "..." : str;
};

const CourseCard = ({ course }) => (
  <React.Fragment>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" component="div">
        {course.name}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {course.code}
      </Typography>
      <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
        {course.academic_unit}
      </Typography>
      <Typography variant="body2">
        {truncate(course.course_description, 100)}{" "}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" href={course.url} target="_blank">
        Learn More
      </Button>
    </CardActions>
  </React.Fragment>
);


const Test = () => {
  const [key, setKey] = useState("Architecture");
  const [courses, setCourses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCourses();
  }, [key]);

  const getCourses = async() => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/search?keyword=${key}`,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setCourses(Array.isArray(data.data) ? data.data.slice(0, 4) : [])
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
    }
  }

  const handleSearchFieldChange = (e) => {
    setSearchKeyword(e.target.value)
  } 

  const handleSearchButtonClick = async (e) => {
    e.preventDefault();
    if (searchKeyword) {
        navigate(`/home-result?search=${searchKeyword}`);
    } else {
        alert("Please input some keywords")
    }
  };

  return (
    <div>
      <div className="landingPageSearch">
        <Form inline="true">
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search for all course or opportunity"
                className="mr-sm-2"
                style={{ width: "400px" }}
                onChange={handleSearchFieldChange}
              />
            </Col>
            <Col xs="auto">
              <Button type="submit" onClick={handleSearchButtonClick}>
                Search
              </Button>
            </Col>
          </Row>
          <p>Explore all courses</p>
        </Form>
      </div>
      <Tabs
        defaultActiveKey="Architecture"
        id="fill-tab-example"
        className="mb-3"
        fill
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="Architecture" title="Architecture & Building">
          <Box sx={{ flexGrow: 1 }} >
            <Grid container spacing={{ xs: 2, md: 3 }} columns={4} className='home-result-cards'>
              {courses.map((course, index) => (
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  key={index}
                  sx={{ display: "flex" }}
                >
                  <Item>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <CourseCard course={course} />
                    </Card>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Tab>
        <Tab eventKey="Business" title="Business & Management">
          <Box sx={{ flexGrow: 1 }} >
            <Grid container spacing={{ xs: 2, md: 3 }} columns={4} className='home-result-cards'>
              {courses.map((course, index) => (
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  key={index}
                  sx={{ display: "flex" }}
                >
                  <Item>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <CourseCard course={course} />
                    </Card>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Tab>
        <Tab eventKey="Arts" title="Creative Arts">
          <Box sx={{ flexGrow: 1 }} >
            <Grid container spacing={{ xs: 2, md: 3 }} columns={4} className='home-result-cards'>
              {courses.map((course, index) => (
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  key={index}
                  sx={{ display: "flex" }}
                >
                  <Item>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <CourseCard course={course} />
                    </Card>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Tab>
        <Tab eventKey="Education" title="Education">
          <Box sx={{ flexGrow: 1 }} >
            <Grid container spacing={{ xs: 2, md: 3 }} columns={4} className='home-result-cards'>
              {courses.map((course, index) => (
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  key={index}
                  sx={{ display: "flex" }}
                >
                  <Item>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <CourseCard course={course} />
                    </Card>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Tab>
        <Tab eventKey="Engineering" title="Engineering">
          <Box sx={{ flexGrow: 1 }} >
            <Grid container spacing={{ xs: 2, md: 3 }} columns={4} className='home-result-cards'>
              {courses.map((course, index) => (
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  key={index}
                  sx={{ display: "flex" }}
                >
                  <Item>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <CourseCard course={course} />
                    </Card>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Tab>
        <Tab eventKey="Environmental" title="Environmental">
          <Box sx={{ flexGrow: 1 }} >
            <Grid container spacing={{ xs: 2, md: 3 }} columns={4} className='home-result-cards'>
              {courses.map((course, index) => (
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  key={index}
                  sx={{ display: "flex" }}
                >
                  <Item>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <CourseCard course={course} />
                    </Card>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Tab>
        <Tab eventKey="Health" title="Health">
          <Box sx={{ flexGrow: 1 }} >
            <Grid container spacing={{ xs: 2, md: 3 }} columns={4} className='home-result-cards'>
              {courses.map((course, index) => (
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  key={index}
                  sx={{ display: "flex" }}
                >
                  <Item>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <CourseCard course={course} />
                    </Card>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Tab>
        <Tab eventKey="Law" title="Humanities & Law">
          <Box sx={{ flexGrow: 1 }} >
            <Grid container spacing={{ xs: 2, md: 3 }} columns={4} className='home-result-cards'>
              {courses.map((course, index) => (
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  key={index}
                  sx={{ display: "flex" }}
                >
                  <Item>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <CourseCard course={course} />
                    </Card>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Tab>
        <Tab eventKey="Computer" title="IT">
          <Box sx={{ flexGrow: 1 }} >
            <Grid container spacing={{ xs: 2, md: 3 }} columns={4} className='home-result-cards'>
              {courses.map((course, index) => (
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  key={index}
                  sx={{ display: "flex" }}
                >
                  <Item>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <CourseCard course={course} />
                    </Card>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Tab>
        <Tab eventKey="Physical" title="Natural & Physical">
          <Box sx={{ flexGrow: 1 }} >
            <Grid container spacing={{ xs: 2, md: 3 }} columns={4} className='home-result-cards'>
              {courses.map((course, index) => (
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  key={index}
                  sx={{ display: "flex" }}
                >
                  <Item>
                    <Card
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <CourseCard course={course} />
                    </Card>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Test;
