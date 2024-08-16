import React from "react";
import {CardContent, Typography, Box, Button, CardActions} from "@mui/material";
import { useNavigate } from "react-router-dom";
const ProjectCard = (props) => {
  const project = props.project;
  const navigate = useNavigate()
  if (!project) {
    return <div>Loading...</div>
  }

  return(
    <React.Fragment>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
          }}
        > 
          <Typography variant="h4">
            {project.name}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={()=>{navigate(`/dashboard/allprojects/${project.id}`)}}>
          Learn More
        </Button>
      </CardActions>
    </React.Fragment>
  );      
}

export default ProjectCard;