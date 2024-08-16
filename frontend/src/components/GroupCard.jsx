import React from "react";
import { useNavigate } from "react-router-dom";
import { CardContent, Typography, Button, CardActions } from "@mui/material";

const GroupCard = (props) => {
  const navigate = useNavigate();
  const group = props.group;
  const truncate = (str, n) => {
    if (!str) {
      return str;
    }
    return str.length > n ? str.substring(0, n - 1) + "..." : str;
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div">
          {group.name}
        </Typography>
        <Typography variant="body2">
          <strong> Group detail:</strong> {truncate(group.description, 200)}
        </Typography>
        <Typography variant="body2">
          <strong>Group size:</strong> {truncate(group.size, 200)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            navigate(`/dashboard/allgroups/${group.id}`);
          }}
        >
          Learn More
        </Button>
      </CardActions>
    </React.Fragment>
  );
};

export default GroupCard;
