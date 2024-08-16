import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Tabs,
  Tab,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Card
} from "@mui/material";
import { API_ENDPOINT } from "../constants";
import MemberCard from "./MemberCard";
import { experimentalStyled as styled } from "@mui/material/styles";

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

const Student_Right_Group_Detail = () => {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const { id: groupID } = useParams();
  const token = localStorage.getItem("token");
  const [isFull, setIsFull] = useState(false);

  const isInGroup = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/mygroups`, {
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
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].id.toString() === groupID) {
            setIsInside(true);
          }
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("role") === "student") {
      isInGroup();
    }
  }, []);

  useEffect(() => {
    getGroupInfo();
  }, [isInside]);

  const handleWithdrawal = async () => {
    const payload = {
      group_id: +groupID
    };

    try {
      const res = await fetch(`${API_ENDPOINT}/leave_group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert("You have successfully left!");
        setIsInside(false);
      }
    } catch (error) {
      alert("Failed to fetch: 3" + error.message);
    }
  };

  const getGroupInfo = async () => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/dashboard/group_detail?keyword=${groupID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      if (data.error) {
        throw new Error("Failed to get group information");
      } else {
        setGroupInfo(data.data);
        setMembers(data.data.users);
        if (data.data.users.length === Number(data.data.size)) {
            setIsFull(true);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getGroupInfo();
  }, [groupID]);

  if (!groupInfo) {
    return <div>Loading...</div>;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleJoinButtonClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleYesButtonClick = async () => {
    try {
      const payload = {
        group_id: +groupID
      };

      const res = await fetch(`${API_ENDPOINT}/join_group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.status === 406) {
        alert(
          "Request not acceptable. Please check the group size and try another one again."
        );
        setOpen(false);
        return;
      }

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert("Join successfully");
        setIsInside(true);
      }
    } catch (error) {
      alert("Failed to fetch: 3" + error.message);
    }
    setOpen(false);
  };

  return (
    <div className="detail-page-right">
      <div className="detail-page-right-name">{groupInfo.name}</div>
      <p className="detail-page-right-description">
        Topic: {groupInfo.project_name}
      </p>
      <p className="detail-page-right-description">Size: {groupInfo.size}</p>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Project detail tabs"
      >
        <Tab label="Description" />
        <Tab label="Member" />
      </Tabs>
      <Box role="tabpanel" hidden={value !== 0}>
        <div>{groupInfo.description}</div>
      </Box>
      <Box role="tabpanel" hidden={value !== 1}>
        <Grid
          container
          spacing={2}
          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
          className="home-result-cards"
          justifyContent="flex-start"
          marginBottom="20px"
        >
          {members.map((member, index) => (
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
                  variant="contained"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    minWidth: "200px"
                  }}
                >
                  <MemberCard member={member} />
                </Card>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
      <div>
        {localStorage.getItem("role") === "student" ? (
          <>
            {!isInside && (
              <Button
                variant="contained"
                disabled={isFull}
                style={{ marginRight: "10px" }}
                onClick={handleJoinButtonClick}
              >
                Join as group member
              </Button>
            )}
            {isInside && (
              <Button
                variant="contained"
                color="error"
                style={{ marginRight: "10px" }}
                onClick={handleWithdrawal}
              >
                Withdrawal From Group?
              </Button>
            )}
            <Button variant="contained" onClick={handleBackButtonClick}>
              Back
            </Button>
          </>
        ) : (
          <></>
        )}
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Join Group"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to join in this group?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleYesButtonClick} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Student_Right_Group_Detail;
