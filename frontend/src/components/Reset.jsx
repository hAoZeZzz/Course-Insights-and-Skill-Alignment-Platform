import React, { useState, useEffect } from "react";
import LandingPages from "./LandingPages";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import styled from "styled-components";
// import {  } from "react-router-dom";
import cross from "../assets/cross-1.svg";
import { API_ENDPOINT } from "../constants";
import { useNavigate, Link } from "react-router-dom";
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

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const Reset = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [timer, setTimer] = useState(0);

  const Navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleSendButtonClick = async (e) => {
    if (email === "") {
      alert("Please input your e-mail address");
    } else {
      try {
        setTimer(60);
        const res = await fetch(
          `${API_ENDPOINT}/reset?email=${encodeURIComponent(email)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        if (data.error) {
          alert(data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch: " + error.message);
      }
    }
  };

  const handleResetButtonClick = async (e) => {
    if (password === confirmPassword) {
      try {
        const res = await fetch(`${API_ENDPOINT}/reset`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            verification_code: verifyCode,
          }),
        });

        const data = await res.json();
        if (data.error) {
          alert(data);
        } else {
          if (res.status === 200) {
            alert("Reset your password successfully!");
            Navigate("/login");
          } else if (res.status === 400) {
            alert("Wrong verification code");
            setVerifyCode("");
          } else if (res.status === 404) {
            alert("Cannot find your e-mail address.");
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch: " + error.message);
      }
    } else {
      alert("Please check the password you entered twice");
    }
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleVerifyCodeChange = (e) => {
    setVerifyCode(e.target.value);
  };

  return (
    <div className="Login-whole">
      <LandingPages />
      <div className="LandingPages-background"></div>
      <div className="Register-Form-body">
        <Row>
          <h2>Reset Password</h2>
          <Link to="/">
            <img src={cross} alt="" />
          </Link>
        </Row>

        <Form>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <FlexRow>
              <Form.Label>Email Address</Form.Label>
              <Button
                variant="warning"
                size="sm"
                onClick={handleSendButtonClick}
                disabled={timer > 0} 
              >
                {timer > 0 ? `Resend code in ${timer}s` : "Send code"}
              </Button>
            </FlexRow>
            <CustomInput
              type="email"
              placeholder="Enter Email"
              onChange={handleEmailChange}
              value={email}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email Verification Code</Form.Label>
            <CustomInput
              placeholder="Enter Your Email Verification Code"
              type="tel"
              onChange={handleVerifyCodeChange}
              value={verifyCode}
              id="verifyCodeInput"
              name="verifyCodeInput"
              autoComplete="off"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword1">
            <Form.Label>Password</Form.Label>
            <CustomInput
              type="password"
              placeholder="Enter Password"
              onChange={handlePasswordChange}
              value={password}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword2">
            <Form.Label>Confirm Password</Form.Label>
            <CustomInput
              type="password"
              placeholder="Enter Password Again"
              onChange={handleConfirmPasswordChange}
              value={confirmPassword}
            />
          </Form.Group>
        </Form>
        <Container>
          <CustomButton
            variant="outline-warning"
            onClick={handleResetButtonClick}
          >
            Reset
          </CustomButton>
          <SecondRow>
            <CustomLink to="/register">Sign up</CustomLink>
            <CustomLink to="/login">Login</CustomLink>
          </SecondRow>
        </Container>
      </div>
    </div>
  );
};

export default Reset;
