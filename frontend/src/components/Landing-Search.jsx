import "../App.css";
import * as React from "react";
import LandingPages from "./LandingPages";
import Search_PIC from "../assets/search-pic.svg";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import crosssIMG from "../assets/cross-1.svg";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LandingSearch = () => {
  const [value, setValue] = React.useState("course");
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchQuery === "") {
      alert("Please input your keywords!");
    } else {
      if (value === "course") {
        navigate(
          `/landing-result?search=${encodeURIComponent(
            searchQuery
          )}&type=${encodeURIComponent(value)}`
        );
      } else {
        navigate(
          `/landing-result?search=${encodeURIComponent(
            searchQuery
          )}&type=${encodeURIComponent(value)}`
        );
      }
    }
  };

  return (
    <>
      <div className="Login-whole">
        <LandingPages />
        <div className="LandingPages-background"></div>
        <div className="Landing-search-box">
          <Form inline="true" onSubmit={handleSubmit}>
            <Row>
              <p>Explore all courses or projects</p>
              <Link to="/">
                <img src={crosssIMG} alt="" />
              </Link>
            </Row>

            <Row>
              <Col xs="auto">
                <Form.Control
                  type="text"
                  placeholder="Search for all course or opportunity"
                  className="mr-sm-2"
                  style={{ width: "50vw", maxWidth: "400px" }}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </Col>
              <Col xs="auto">
                <Button type="submit">
                  <img src={Search_PIC} alt="" />
                </Button>
              </Col>
            </Row>
          </Form>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <FormControlLabel
                value="course"
                control={<Radio />}
                label="Course"
              />
              <FormControlLabel
                value="project"
                control={<Radio />}
                label="Project"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </>
  );
};

export default LandingSearch;
