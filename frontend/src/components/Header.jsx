import logo from "../assets/logo.png";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../assets/default_avatar.svg";
import { API_ENDPOINT } from "../constants";
import Navbar from "react-bootstrap/Navbar";
import { Nav } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import Search_PIC from "../assets/search-pic.svg";

const theme = createTheme({
  palette: {
    violet: {
      main: "#E3D026",
    },
  },
});

const Header = () => {
  const [image, setImage] = useState(Avatar);
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInAdminBoard, setIsInAdminBoard] = useState(false);
  const location = useLocation();
  const Navigate = useNavigate();
  const id = localStorage.getItem("id")
  const getAvater = async (token) => {
    try {
      const res = await fetch(`${API_ENDPOINT}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        localStorage.setItem('role', data.data.role)
        if (data.data && data.data.avatar) {
          setImage(data.data.avatar);
        }
        if (data.data && data.data.user_name) {
          setName(data.data.user_name);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (email === "admin@ad.unsw.edu.au") {
      setIsAdmin(true);
    }

    if (token) {
      setIsLogin(true);
      getAvater(token);
    } else {
      setIsLogin(false);
    }

    if (location.pathname === "/admin") {
      setIsInAdminBoard(true);
    } else {
      setIsInAdminBoard(false);
    }
  }, [isLogin, location]);

  const handleLogout = () => {
    Navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    setIsLogin(false);
  };

  const headerStyle = {
    backgroundColor: location.pathname === "/" ? "#3f81ed" : "#fff",
    height: "60px",
    padding: "10px 40px 10px 40px",
    display: "flex",
    align_items: "center",
    justify_content: "space-between",
  };

  return (
    <>
      <div className="Header" style={headerStyle}>
        <a href="/">
          <img src={logo} alt="System logo" />
        </a>
        {isLogin ? (
          isAdmin ? (
            <>
              <Navbar.Brand style={{ fontSize: "2em", fontWeight: "500" }}>
                Hi, Admin
              </Navbar.Brand>
              {isInAdminBoard ? (
                <Nav.Link href="/" style={{ marginLeft: "40px" }}>
                  Home Page
                </Nav.Link>
              ) : (
                <Nav.Link href="/admin" style={{ marginLeft: "40px" }}>
                  Admin Board
                </Nav.Link>
              )}
            </>
          ) : (
            <div className="Header-hi">Hi, {name}</div>
          )
        ) : (
          <div className="header-welcome">Welcome to Pineapple World !</div>
        )}

        <div className="Header-ButtonContainer">
          {isLogin ? (
            <>
              <a href="/landing-search">
                <img
                  src={Search_PIC}
                  style={{
                    height: "35px",
                    marginBottom: "15px",
                    marginRight: "30px",
                  }}
                />
              </a>

              <a href={`/mydetail/${id}`}>
                <img src={image} alt="" className="Hear-Avatar" />
              </a>

              <ThemeProvider theme={theme}>
                <Button
                  variant="contained"
                  color="violet"
                  sx={{
                    fontSize: "1.2rem",
                    padding: "10px",
                    height: "50px",
                    width: "120px",
                    marginBottom: "20px",
                    textTransform: "none",
                    borderRadius: "30px",
                  }}
                  onClick={handleLogout}
                >
                  Exit
                </Button>
              </ThemeProvider>
            </>
          ) : (
            <>
              <a href="/landing-search">
                <img
                  src={Search_PIC}
                  style={{
                    height: "35px",
                    marginBottom: "15px",
                    marginRight: "30px",
                  }}
                />
              </a>
              <a href="/login">
                <ThemeProvider theme={theme}>
                  <Button
                    variant="contained"
                    color="violet"
                    sx={{
                      fontSize: "1.2rem",
                      padding: "10px",
                      height: "50px",
                      width: "120px",
                      marginBottom: "20px",
                      textTransform: "none",
                      borderRadius: "30px",
                    }}
                  >
                    Login
                  </Button>
                </ThemeProvider>
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
