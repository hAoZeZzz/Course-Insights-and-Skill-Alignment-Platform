import LandingPages from "./LandingPages";
import Button from "react-bootstrap/Button";
import "../App.css";
import Form from "react-bootstrap/Form";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import cross from "../assets/cross-1.svg";
import { API_ENDPOINT } from "../constants";

const CustomButton = styled(Button)`
  width: 100%;
  background-color: #fff;
  color: #000;
  border: 1px solid transparent;
  transition: background-color 0.3s, border-color 0.3s;

  &:hover {
    background-color: #fec642;
    border: 1px solid #1e90ff;
  }

  &:active {
    background-color: #1e90ff;
    color: #fff;
    border: 1px solid #1e90ff;
  }
`;

const CustomInput = styled(Form.Control)`
  background-color: #fff;

  &:focus {
    border-color: #1e90ff;
    box-shadow: 0 0 0 0.2rem rgba(30, 144, 255, 0.25);
  }
`;

const Container = styled.div`
  text-align: center;
  margin-top: 50px;
`;

const SecondRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const CustomLink = styled(Link)`
  color: #000;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

// This component is the content of the login page, including the form that users need to 
// fill out when logging in. It interacts with the backend to obtain the token that verifies 
// the user's identity.
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleLoginClick = async (e) => {
    try {
      const res = await fetch(`${API_ENDPOINT}/login`, {
        method: "POST",
        body: JSON.stringify({
          email, 
          password 
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      if (data.error) {
        alert(data);
      } else {
        if (data.msg === "Invalid credentials") {
          setEmail("");
          setPassword("");
          alert(
            "Please check your e-mail or password.\nIf you don't register, you can register first."
          );
        } else if (data.access_token) {
          localStorage.setItem("id", data.id);
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("email", email);
          if (email === "admin@ad.unsw.edu.au") {
            Navigate("/admin");
          } else {
            Navigate("/dashboard/allcourses");
          }
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  return (
    <div className="Login-whole">
      <LandingPages />
      <div className="LandingPages-background"></div>

      <div className="Login-Form-body">
        <Row>
          <h2>Login</h2>
          <Link to="/">
            <img src={cross} alt="" />
          </Link>
        </Row>

        <Form>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email Address</Form.Label>
            <CustomInput
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={handleEmailChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <CustomInput
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
        </Form>
        <Container>
          <CustomButton variant="outline-warning" onClick={handleLoginClick}>
            Login
          </CustomButton>
          <SecondRow>
            <CustomLink to="/register">Sign up</CustomLink>
            <CustomLink to="/reset">Forget my password</CustomLink>
          </SecondRow>
        </Container>
      </div>
    </div>
  );
};

export default Login;
