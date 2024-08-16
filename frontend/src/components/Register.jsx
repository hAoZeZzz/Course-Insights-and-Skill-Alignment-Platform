import LandingPages from "./LandingPages";
import Button from "react-bootstrap/Button";
import "../App.css";
import Form from "react-bootstrap/Form";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import cross from "../assets/cross-1.svg";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import React, { useState } from "react";
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
const CustomCodeInput = styled(Form.Control)`
  margin: 15px;
  height: 40px;
  width: 248px;
`;
const Container = styled.div`
  text-align: center;
  margin-top: 20px;
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

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  gap: 10px;
  margin-top: 5px;
`;

const Register = () => {
  const [dropdownTitle, setDropdownTitle] = useState("Your identity");
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [email, setEmail] = useState("");
  const [UserName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [academicCode, setAcademicCode] = useState("");
  const Navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasUpperCase.test(password) &&
      hasLowerCase.test(password) &&
      hasSpecialChar.test(password)
    );
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const validateUserName = (UserName) => {
    if (UserName.length >= 6) return false;
    return true;
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleAcademicCodeChange = (e) => {
    setAcademicCode(e.target.value);
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();

    if (dropdownTitle !== "Your identity") {
      if (validatePassword(password) && validateEmail(email) && validateUserName(UserName)) {
        if (password === confirmPassword) {
          try {
            const res = await fetch(`${API_ENDPOINT}/register`, {
              method: "POST",
              body: JSON.stringify({
                email: email,
                user_name: UserName,
                password: password,
                role: dropdownTitle === "Academic user" ? "academic" : "student",
                avatar: '',
                bio: "",
                invitation_code:
                  dropdownTitle === "Academic user" ? academicCode : "",
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            const data = await res.json();

            if (data.error) {
              alert(data);
            } else {
              if (data.msg === "Successful registration") {
                alert("Register successfully");
                Navigate("/login");
              } else if (data.msg === "Email already exists") {
                alert("This email has been registered");
                setEmail("");
                setUserName("");
                setPassword("");
                setConfirmPassword("");
                setAcademicCode("");
              }
            }
          } catch (error) {
            console.error("Fetch error:", error);
            alert("Failed to fetch: " + error.message);
          }
        } else {
          alert("Please check the password you entered twice");
          setPassword("");
          setConfirmPassword("");
        }
      } else if (!validatePassword(password)) {
        alert(
          "Password must be at least 8 characters long and include a number, an uppercase letter, a lowercase letter, and a special character."
        );
        setPassword("");
        setConfirmPassword("");
      } else if (!validateEmail(email)) {
        alert("Email Adress should be in style of ***@***.*");
        setEmail("");
      } else if (!validateUserName(UserName)) {
        alert("Length of username should be not longer than 6");
        setUserName(""); 
      }
    } else {
      alert("Please choose at least one identity.");
    }
  };

  const handleSelect = (eventKey) => {
    if (eventKey === "1") {
      setDropdownTitle("Student user");
      setShowInviteCode(false);
    } else if (eventKey === "2") {
      setDropdownTitle("Academic user");
      setShowInviteCode(true);
    }
  };

  return (
    <div className="Login-whole">
      <LandingPages />
      <div className="LandingPages-background"></div>
      <div className="Register-Form-body">
        <Row>
          <h2>Sign Up</h2>
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

          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>User Name</Form.Label>
            <CustomInput
              type="email"
              placeholder="Enter User Name"
              value={UserName}
              onChange={handleAUserNameChange}
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
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Confirm Password</Form.Label>
            <CustomInput
              type="password"
              placeholder="Enter Password Again"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </Form.Group>
        </Form>
        Choose Your Identity
        <FlexContainer>
          <ButtonGroup>
            <DropdownButton
              as={ButtonGroup}
              title={dropdownTitle}
              id="bg-nested-dropdown"
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey="1">Student user</Dropdown.Item>
              <Dropdown.Item eventKey="2">Academic user</Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
          {showInviteCode && (
            <Form>
              <Form.Group className="mb-3" controlId="formGroupInviteCode">
                <CustomCodeInput
                  type="text"
                  placeholder="Your Academic User code"
                  onChange={handleAcademicCodeChange}
                />
              </Form.Group>
            </Form>
          )}
        </FlexContainer>
        <Container>
          <CustomButton variant="outline-warning" onClick={handleLoginClick}>
            Sign Up
          </CustomButton>
          <SecondRow>
            <CustomLink to="/login">Login</CustomLink>
            <CustomLink to="/reset">Forget my password</CustomLink>
          </SecondRow>
        </Container>
      </div>
    </div>
  );
};

export default Register;
