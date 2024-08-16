import "../App.css";
import * as React from "react";
import FooterTopButton from "../components/FooterTopButton.jsx";
import Footer3D from "./Footer3D";
import logo from "../assets/UNSW-logo.png";
import XIcon from "../assets/XIcon.jsx";
import ChatGPTIcon from "../assets/ChatGPTIcon.jsx";
import ReactIcon from "../assets/ReactIcon.jsx";
import GithubIcon from "../assets/GithubIcon.jsx";
// In Footer component we use three party to create a 3D effect
const Footer = () => {

  return (
    <div className="footer-grid-container">
      <Footer3D className="footer-3d" />
      <div className="footer-box">
        <div className="footer-section footer-logo-section">
          <a href="https://www.unsw.edu.au/">
            <img src={logo} alt="SuperHi Logo" className="footer-logo" />
          </a>
        </div>
        <div className="footer-section">
          <h4>Learn</h4>
          <ul>
            <li>
              <a href="#">All courses</a>
            </li>
            <li>
              <a href="#">All Projects</a>
            </li>
            <li>
              <a href="#">All Groups</a>
            </li>
            <li>
              <a href="#">Design</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>University</h4>
          <ul>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Student Work</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li>
              <a href="#">Terms of Use</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className="footer-social-icons">
          <a href="https://x.com/">
            <XIcon width={24} height={24} fill="#000" />
          </a>
          <a href="https://chatgpt.com/">
            <ChatGPTIcon width={24} height={24} fill="#000" />
          </a>
          <a href="https://react.dev/">
            <ReactIcon width={24} height={24} fill="#000" />
          </a>
          <a href="https://github.com/">
            <GithubIcon width={24} height={24} fill="#000" />
          </a>
          <div className="footer-copyright">© 2024 Pineapple, GROUP</div>
        </div>
        <FooterTopButton />
      </div>
    </div>
  );
};

export default Footer;
