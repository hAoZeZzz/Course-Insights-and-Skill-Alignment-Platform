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
  return str.length > n ? str.substring(0, n - 1) + "..." : str;
};

const GroupCard = ({ group }) => (
  <React.Fragment>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography
        variant="h5"
        component="div"
        sx={{ mb: 2, whiteSpace: "normal", wordWrap: "break-word" }}
      >
        {group.name}
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 1, whiteSpace: "normal", wordWrap: "break-word" }}
      >
        <strong style={{ fontSize: "1.2em" }}>Group Detail: </strong>{" "}
        {truncate(group.group_description, 200)}
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 1, whiteSpace: "normal", wordWrap: "break-word" }}
      >
        <strong style={{ fontSize: "1.2em" }}>Related Project: </strong>{" "}
        {truncate(group.project_name, 200)}
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 1, whiteSpace: "normal", wordWrap: "break-word" }}
      >
        <strong style={{ fontSize: "1.2em" }}>Joined: </strong>{" "}
        {`${group.users.length} / ${group.size}`}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" href={group.url}>
        Learn More
      </Button>
    </CardActions>
  </React.Fragment>
);

const Student_Right_Allgroups = () => {
  const [groups, setGroups] = useState([]);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const token = localStorage.getItem("token");
  const get_Dashboard_Allgroups = async () => {
    let APIurl = "";
    if (searchText === "") {
      APIurl = `${API_ENDPOINT}/dashboard/allgroups`;
    } else {
      APIurl = `${API_ENDPOINT}/dashboard/allgroups?keyword=${searchText}`;
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
        if (data.data) {
          const formattedGroups = data.data.map((group) => ({
            users: group.users,
            name: group.name,
            group_description: group.description,
            project_name: group.project_name,
            size: group.size,
            url: `/dashboard/allgroups/${group.id}`
          }));

          setGroups(formattedGroups);
          setPages(Math.ceil(formattedGroups.length / 12));
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastGroup = currentPage * 12;
  const indexOfFirstGroup = indexOfLastGroup - 12;
  const currentGroups = groups.slice(indexOfFirstGroup, indexOfLastGroup);

  useEffect(() => {
    get_Dashboard_Allgroups();
  }, []);

  return groups.length === 0 ? (
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
            onClick={get_Dashboard_Allgroups}
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
            {currentGroups.map((group, index) => (
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
                      minWidth: "200px"
                    }}
                  >
                    <GroupCard group={group} />
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

export default Student_Right_Allgroups;
