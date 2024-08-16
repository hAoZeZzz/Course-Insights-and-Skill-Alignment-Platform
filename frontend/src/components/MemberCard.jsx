import React from "react";
import {CardContent, Typography, Avatar, Box, Button, CardActions} from "@mui/material";

const MemberCard = (props) => {
  const member = props.member;

  if (!member) {
    return <div>Loading...</div>
  }

  return(
    <React.Fragment>
      <CardContent sx={{ flexGrow: 1 }} style={{}}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap:1 
          }}
        >
          {!member.avatar ? (
            <Avatar sx={{ width: 75, height: 75 }} src="/broken-image.jpg" />) : (
            <Avatar sx={{ width: 75, height: 75 }} src={member.avatar} />
            )}
          
          <Typography variant="h6">
            {member.user_name}
          </Typography>
          <Typography variant="body2">
            Email: {member.email}
          </Typography>
        </Box>
      </CardContent>
     
    </React.Fragment>
  );      
}

export default MemberCard;