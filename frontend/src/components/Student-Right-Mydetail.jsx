import "../App.css";
import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Chip from "@mui/material/Chip";
import avatar from "../assets/default_avatar.svg";
import cross from "../assets/cross-1.svg";
import { API_ENDPOINT } from "../constants";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import upload_avatar from "../assets/upload-avatar.svg";
import { styled } from "@mui/system";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import IosShareIcon from "@mui/icons-material/IosShare";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveAsIcon from "@mui/icons-material/SaveAs";

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

const CustomTextField = styled(TextField)(({ theme }) => ({
  ".MuiOutlinedInput-root": {
    height: "40px",
    marginBottom: "10px"
  },
  ".MuiOutlinedInput-input": {
    padding: "0 14px",
    height: "30px"
  },
  ".MuiInputLabel-root": {
    lineHeight: "1.2"
  },
  ".MuiOutlinedInput-notchedOutline": {
    border: "0px"
  },
  ".MuiOutlinedInput-notchedOutline": {
    height: "45px",
    border_buttom: "1px solid red",
    borderRadius: "10px"
  }
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
  height: "50px",
  display: "flex",
  alignItems: "center"
}));
const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5)
}));

const CustomTableCell = styled(TableCell)({
  padding: "4px",
  fontSize: "1.2rem"
});

const CustomButton = styled(Button)({
  "&.MuiButton-root": {
    backgroundColor: "transparent",
    color: "#3874cb",
    fontSize: "0.875rem",
    minWidth: "64px",
    boxShadow: "none",
    borderRadius: "20px",
    textTransform: "uppercase",
    transition: "background-color 0.3s",
    height: "40px",
    "&:hover": {
      backgroundColor: "rgba(63, 81, 181, 0.08)"
    },
    "&:focus": {
      outline: "none"
    }
  },
  "& .MuiTouchRipple-root": {
    color: "#3f51b5"
  }
});

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 300,
      sm: 870,
      md: 1345
    }
  }
});

const truncate = (str, n) => {
  return str?.length > n ? str.substring(0, n - 1) + "..." : str;
};

const Student_Right_Mydetail_Box = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { id } = useParams();
  const [isSame, setIsSame] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oriEmail, setOriEmail] = useState("");
  const [BIO, setBIO] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(avatar);
  const fileInputRef = useRef(null);
  const fileTranscriptRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [myAllCourses, setMyAllCourses] = useState([]);
  const [myAllProjects, setMyAllProjects] = useState([]);
  const [myAllProjectsPages, setMyAllProjectsPages] = useState(1);
  const [currentMyAllProjectsPages, setCurrentMyAllProjectsPages] = useState(1);

  const [myAllRecommends, setMyAllRecommends] = useState([]);
  const [myAllRecommendsPages, setMyAllRecommendsPages] = useState(1);
  const [currentMyAllRecommendsPages, setCurrentMyAllRecommendsPages] =
    useState(1);

  const [role, setRole] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showGroupTable, setShowGroupTable] = useState(false);

  const [myProjectsName, setMyProjectsName] = useState("");
  const [myProjectsDescription, setMyProjectsDescription] = useState("");
  const [myProjectsSize, setMyProjectsSize] = useState("");
  const [myProjectsDueDate, setMyProjectsDueDate] = useState(null);
  const [myProjectsSkills, setMyProjectsSkills] = useState([""]);

  const [myGroupsName, setMyGroupsName] = useState("");
  const [myGroupsDescription, setMyGroupsDescription] = useState("");
  const [myGroupsSize, setMyGroupsSize] = useState("");
  const [myGroupsId, setMyGroupsId] = useState("");
  const [myGroupsSearchQuery, setMyGroupsSearchQuery] = useState("");
  const [myGroupsSearchResults, setMyGroupsSearchResults] = useState([]);
  const [myAllGroups, setMyAllGroups] = useState([]);
  const [myAllGroupsPages, setMyAllGroupsPages] = useState(1);
  const [currentMyAllGroupsPages, setCurrentMyAllGroupsPages] = useState(1);

  const [myProjectsRelatedCourse, setMyProjectsRelatedCourse] = useState("");
  const [myProjectsRelatedCoursePass, setMyProjectsRelatedCoursePass] =
    useState(false);

  const [myProjectsSearchQuery, setMyProjectsSearchQuery] = useState("");
  const [myProjectsSearchResults, setMyProjectsSearchResults] = useState([]);

  const [mySkillsSearchQuery, setMySkillsSearchQuery] = useState("");
  const [mySkillsSearchResults, setMySkillsSearchResults] = useState([]);

  const [myCoursesSearchQuery, setMyCoursesSearchQuery] = useState("");
  const [myCoursesSearchResults, setMyCoursesSearchResults] = useState([]);

  const [skills, setSkills] = useState([]);

  const navigate = useNavigate();
  const [isEditProject, setIsEditProject] = useState(false);
  const [isEditProjectId, setIsEditProjectId] = useState("");
  const [isEditProjectName, setIsEditProjectName] = useState("");
  const [isEditProjectDescription, setIsEditProjectDescription] = useState("");

  const [searchOption, setSearchOption] = useState("");
  const [currentId, setCurrentId] = useState("");

  const ProjectCard = ({ project }) => (
    <React.Fragment>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "260px"
          }}
        >
          {project.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "260px"
          }}
        >
          Project description: {truncate(project.description, 200)}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "260px"
          }}
        >
          Due date: {project.due_date.split("T")[0]}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "260px"
          }}
        >
          Size: {project.size}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            maxWidth: "260px",
            wordWrap: "break-word"
          }}
        >
          Need Skills: {truncate(project.skills.join(", "), 200)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => handleClickLearnMoreButton(project.id)}
        >
          Learn More
        </Button>
        <Button
          size="small"
          onClick={() => {
            setShowTable(true);
            setIsEditProject(true);
            setIsEditProjectId(project.id);
            setIsEditProjectDescription(project.description);
            setIsEditProjectName(project.name);
          }}
        >
          Edit
        </Button>
      </CardActions>
    </React.Fragment>
  );

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
          <strong style={{ fontSize: "1.2em" }}>Group Description:</strong>{" "}
          {truncate(group.description, 200)}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 1, whiteSpace: "normal", wordWrap: "break-word" }}
        >
          <strong style={{ fontSize: "1.2em" }}>Group Size:</strong>{" "}
          {truncate(group.size, 200)}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 1, whiteSpace: "normal", wordWrap: "break-word" }}
        >
          <strong style={{ fontSize: "1.2em" }}>Related Project:</strong>{" "}
          {truncate(group.project_name, 200)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => handleClickGroupsLearnMoreButton(group.id)}
        >
          Learn More
        </Button>
      </CardActions>
    </React.Fragment>
  );
  // 需要修改
  const RecomCard = ({ recom }) => (
    <React.Fragment>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ mb: 2, whiteSpace: "normal", wordWrap: "break-word" }}
        >
          {recom.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 1, whiteSpace: "normal", wordWrap: "break-word" }}
        >
          <strong style={{ fontSize: "1.2em" }}>Project Description:</strong>{" "}
          {truncate(recom.description, 200)}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 1, whiteSpace: "normal", wordWrap: "break-word" }}
        >
          <strong style={{ fontSize: "1.2em" }}>Due Date:</strong>{" "}
          {truncate(recom.due_date, 200)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => handleClickRecommLearnMoreButton(recom.id)}
        >
          Learn More
        </Button>
      </CardActions>
    </React.Fragment>
  );

  const handleClickLearnMoreButton = (id) => {
    navigate(`/dashboard/allprojects/${id}`);
  };
  const handleClickGroupsLearnMoreButton = (id) => {
    navigate(`/dashboard/allGroups/${id}`);
  };
  const handleClickRecommLearnMoreButton = (id) => {
    navigate(`/dashboard/allProjects/${id}`);
  };

 
  const handleShareButtonClick = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };


  const getSkills = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/myskills`, {
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
          let mydata = data.data.map((item) => item.name);
          setSkills(mydata);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  const getCourses = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/mycourses`, {
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
        let mydata = [];
        if (data.data) {
          mydata = data.data.map((item) => item.code + " " + item.name);
          setMyAllCourses(mydata);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  const getGroups = async () => {
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
        setMyAllGroups(data);
        setMyAllGroupsPages(Math.ceil(data.data.length / 12));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };
  const getProjects = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/myprojects`, {
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
        setMyAllProjects(data);
        setMyAllProjectsPages(Math.ceil(data.data.length / 12));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };
  const getRecommendations = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/recom_projects`, {
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
        setMyAllRecommends(data);
        setMyAllRecommendsPages(Math.ceil(data.data.length / 12));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };
  const getMyCourses = async () => {
    console.log(" ");
  };
  const handlePageChange = (event, value) => {
    setCurrentMyAllProjectsPages(value);
  };
  const handleGroupPageChange = (event, value) => {
    setCurrentMyAllGroupsPages(value);
  };
  const handleRecommPageChange = (event, value) => {
    setCurrentMyAllRecommendsPages(value);
  };
  const getMyProjects = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/myprojects`, {
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
        setMyAllProjects(data);
        setMyAllProjectsPages(Math.ceil(data.data.length / 12));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  const PUTmyprojects = async () => {
    const formattedDate = myProjectsDueDate
      ? format(new Date(myProjectsDueDate), "yyyy-M-d")
      : "";

    try {
      const payload = {
        project_id: +isEditProjectId,
        name: myProjectsName,
        description: myProjectsDescription,
        due_date: formattedDate
      };

      const res = await fetch(`${API_ENDPOINT}/myprojects`, {
        method: "PUT",
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
        setShowTable(false);
        return true;
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
      return false;
    }
  };
  const handleChipClick = (newValue) => {
    if (role === "student") {
      if (newValue === 0 && isSame) {
        getSkills();
      } else if (newValue === 1 && isSame) {
        getCourses();
      } else if (newValue === 2) {
        getGroups();
      } else if (newValue === 3) {
        getProjects();
      } else if (newValue === 4) {
        getRecommendations();
      }
    } else if (role === "academic") {
      if (newValue === 0) {
        getMyCourses();
      } else if (newValue === 1) {
        getMyProjects();
      }
    }
  };
  const getResult = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/profile`, {
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
        setName(data.data.user_name);
        setEmail(data.data.email);
        setOriEmail(data.data.email);
        setBIO(data.data.bio);
        setRole(data.data.role);
        if (data.data && data.data.avatar) {
          setImage(data.data.avatar);
        }
        if (id === `${data.data.id}`) {
          setIsSame(true);
        } else {
          setCurrentId(id);
          setIsSame(false);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  const upDatePersonalDetail = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user_name: name,
          email,
          bio: BIO
        })
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        if (data.msg === "Email already exists") {
          setEmail(oriEmail);
          alert("This email address has been registered.");
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  const upDatePersonalAvatar = async (image) => {
    try {
      const res = await fetch(`${API_ENDPOINT}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          avatar: image
        })
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        if (data.msg === "Email already exists") {
          setEmail(oriEmail);
          alert("This email address has been registered.");
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };

  const handleEditButton = () => {
    if (isEditing) {
      upDatePersonalDetail();
    }
    setIsEditing(!isEditing);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      upDatePersonalAvatar(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUploadTranscriptClick = () => {
    fileTranscriptRef.current.click();
  };

  const handleTranscriptChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_ENDPOINT}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        getCourses();
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to upload transcript: " + error.message);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    handleChipClick(newValue);
  };

  const handleDelete = (courseToDelete) => async () => {
    const courseCode = courseToDelete.substring(0, 8);
    setMyAllCourses((courses) =>
      courses.filter((course) => course !== courseToDelete)
    );
    try {
      const res = await fetch(
        `${API_ENDPOINT}/dashboard/unlearnt?code=${courseCode}`,
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
        alert(data.error);
      } else {
        alert(`Delete your course ${courseCode} successfully!`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
  };
  const handleAddSkill = () => {
    setMyProjectsSkills([...myProjectsSkills, ""]);
  };

  const handleSkillChange = (index, event) => {
    const newSkills = myProjectsSkills.slice();
    newSkills[index] = event.target.value;
    setMyProjectsSkills(newSkills);
  };

  const handleRemoveSkill = (index) => {
    const newSkills = myProjectsSkills.slice();
    newSkills.splice(index, 1);
    setMyProjectsSkills(newSkills);
  };
  const POST_myprojects = async () => {
    const formattedDate = myProjectsDueDate
      ? format(new Date(myProjectsDueDate), "yyyy-M-d")
      : "";
    try {
      const payload = {
        name: myProjectsName,
        description: myProjectsDescription,
        due_date: formattedDate,
        size: +myProjectsSize,
        course: myCoursesSearchQuery,
        skills: mySkillsSearchResults
      };
      const res = await fetch(`${API_ENDPOINT}/myprojects`, {
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
        setShowTable(false);
        return true;
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
      return false; 
    }
  };

  const handleClickCreateProjectButton = () => {
    setShowTable(true);
  };

  const handleClickCreateButton = async () => {
    await POST_myprojects();
    await getMyProjects();
    setMyProjectsName("");
    setMyProjectsDescription("");
    setMyProjectsDueDate(null);
    setMyProjectsSize("");
    setMyProjectsSearchQuery("");
    setMyProjectsSkills([""]);
    setMySkillsSearchResults([]);
    setMyGroupsName("");
    setMyCoursesSearchQuery("");
  };

  const POST_groups = async () => {
    try {
      const payload = {
        project_id: +myGroupsId,
        group_name: myGroupsName,
        group_size: +myGroupsSize,
        description: myGroupsDescription
      };
      const res = await fetch(`${API_ENDPOINT}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 406) {
        alert("The group name has been created");
        return false;
      } else if (res.status === 403) {
        alert("The number of groups on this subject has been maximised");
        return false;
      }

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setShowGroupTable(false);
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
      return false;
    }
  };
  const handleClickhandleClickCreateGroup = async () => {
    await POST_groups();
    await getGroups();
  };
  const handleClickCreateGroupButton = () => {
    setShowGroupTable(true);
  };
  const handleMyGroupsSearch = async () => {
    let results = [];
    try {
      const res = await fetch(
        `${API_ENDPOINT}/dashboard/allprojects?keyword=${myGroupsSearchQuery}`,
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
        alert(data.error);
      } else {
        console.log(data.data);
      }
      results = data.data.reduce((acc, item) => {
        acc[item.name] = item.id;
        return acc;
      }, {});
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
    setMyGroupsSearchResults(results);
  };

  const handleMyProjectsSearch = async () => {
    let results = [];
    if (searchOption === "Course") {
      try {
        const res = await fetch(
          `${API_ENDPOINT}/dashboard/allcourses?keyword=${myProjectsSearchQuery}`,
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
          alert(data.error);
        } else {
          results = data.data.slice(0, 10).reduce((acc, item) => {
            acc[item.code] = item.name;
            return acc;
          }, {});
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch: " + error.message);
      }
      setMyProjectsSearchResults(results);
    } else if (searchOption === "Skill") {
      try {
        const res = await fetch(
          `${API_ENDPOINT}/dashboard/allskills?keyword=${myProjectsSearchQuery}`,
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
          alert(data.error);
        } else {
          results = data.data.slice(0, 10).reduce((acc, item) => {
            acc[item.name] = item.name;
            return acc;
          }, {});
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch: " + error.message);
      }

      const filteredResults = {};
      Object.keys(results).forEach((key) => {
        if (!mySkillsSearchResults.includes(key)) {
          filteredResults[key] = results[key];
        }
      });

      setMyProjectsSearchResults(filteredResults);
    }
  };

  const handleMySkillsSearch = async () => {
    let results = [];
  };

  const handleMyGroupsOptionClick = (option) => {
    setMyGroupsSearchQuery(option);
    setMyGroupsId(myGroupsSearchResults[option]);

    setMyGroupsSearchResults([]);
  };
  const handleMyProjectsOptionClick = (option) => {
    if (searchOption === "Course") {
      setMyCoursesSearchQuery(option);
    } else if (searchOption === "Skill") {
      const skillsArray = [option].map((skill) => skill.trim());
      setMySkillsSearchResults((prevResults) => [
        ...prevResults,
        ...skillsArray
      ]);
    }
    setMyProjectsSearchResults([]);
  };

  const handleMySkillsOptionClick = (option) => {
    setMySkillsSearchQuery(option);
    setMySkillsSearchResults([]);
  };
  const handleChange = (event) => {
    setSearchOption(event.target.value); 
  };

  const handleDeleteSkill = (skillToDelete) => {
    setMySkillsSearchResults((prevResults) =>
      prevResults.filter((skill) => skill !== skillToDelete)
    );
  };
  useEffect(() => {
    console.log(mySkillsSearchResults);
  }, [mySkillsSearchResults]);

  useEffect(() => {}, [myAllCourses]);
  useEffect(() => {
    const fetchSkills = async () => {
      if (role === "student" && isSame) {
        await getSkills();
      }
    };

    fetchSkills();

    const fetchProjects = async () => {
      if (role === "academic" && isSame) {
        await getMyProjects();
      }
    };

    fetchProjects();
  }, [role]);
  const GET_info_skills = async () => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/info_skills?user_id=${currentId}`,
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
        alert(data.error);
      } else {
        setName(data.msg.name);
        setEmail(data.msg.email);
        if (data.msg && data.msg.bio) {
          setImage(data.msg.bio);
        }
        setBIO(data.msg.bio);
        if (data.msg && data.msg.avatar) {
          setImage(data.msg.avatar);
        } else {
          setImage(avatar);
        }
        setSkills(data.msg.skills);
        setMyAllCourses(data.msg.courses);
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
      return false;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!isSame && currentId) {
        await GET_info_skills();
      } else {
        await getResult();
      }
    };

    fetchData();
  }, [location, isSame, currentId]);

  const tabLabels = [
    "Skills",
    "Courses",
    isSame && "Groups",
    isSame && "Projects",
    isSame && "My Recommendations"
  ].filter(Boolean);

  return (
    <Box className="Dashboard-main-content">
      <Box className="Detail_StudentRightBox">
        
        <Box display="flex" alignItems="center" mb={3} marginTop="20px">
          <>
            <Avatar sx={{ width: 100, height: 100 }} style={{ margin: "16px" }}>
              <img
                src={isSame ? image : image}
                alt=""
                className="Detail-Avatar"
              />
            </Avatar>
            {isSame ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "15px",
                  marginRight: "20px",
                  marginLeft: "20px"
                }}
              >
                {!isEditing ? (
                  <EditNoteIcon
                    color="success"
                    fontSize="large"
                    onClick={handleEditButton}
                  />
                ) : (
                  <SaveAsIcon
                    color="primary"
                    fontSize="large"
                    onClick={handleEditButton}
                  />
                )}
                <button
                  className="Detail-upload-image"
                  onClick={handleUploadButtonClick}
                >
                  <img src={upload_avatar} alt="" />
                </button>
                <IosShareIcon
                  color="secondary"
                  fontSize="large"
                  onClick={handleShareButtonClick}
                />
              </div>
            ) : (
              <></>
              
            )}
          </>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Box ml={3}>
            {isEditing ? (
              <CustomTextField
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Name"
              />
            ) : (
              <CustomTypography variant="h6">Name: {name}</CustomTypography>
            )}
            {isEditing ? (
              <CustomTextField
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="E-mail"
              />
            ) : (
              <CustomTypography>E-mail: {email}</CustomTypography>
            )}
            {isEditing ? (
              <CustomTextField
                fullWidth
                variant="outlined"
                value={BIO}
                onChange={(e) => setBIO(e.target.value)}
                label="BIO"
              />
            ) : (
              <CustomTypography>BIO: {BIO}</CustomTypography>
            )}
          </Box>
         
        </Box>
        {role === "student" ? (
          <div className="Detail-father-box">
            <Box>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
              >
                {tabLabels.map((label, index) => (
                  <Tab key={index} label={label} />
                ))}
              </Tabs>
            </Box>
            <Box display="flex" flexWrap="wrap" mt={2} mb={3}>
              {selectedTab === 0 &&
                (skills.length > 0 ? (
                  skills.map((skill) => (
                    <Chip
                      label={skill}
                      variant="outlined"
                      key={skill}
                      style={{ margin: "5px" }}
                    />
                  ))
                ) : (
                  <Typography variant="body1">
                    No skills found. Please update your learnt courses.
                  </Typography>
                ))}
              {selectedTab === 1 && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginLeft: "20px"
                    }}
                  >
                    {isSame ? (
                      <button
                        className="Detail-upload-image"
                        onClick={handleUploadTranscriptClick}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "auto"
                        }}
                      >
                        <img
                          src={upload_avatar}
                          alt=""
                          style={{ height: "24px", marginRight: "10px" }}
                        />
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileTranscriptRef}
                    style={{ display: "none" }}
                    onChange={handleTranscriptChange}
                  />
                  <Box mt={2}>
                    {myAllCourses.length > 0 ? (
                      myAllCourses.map((course, index) => (
                        <div
                          key={course}
                          style={{
                            position: "relative",
                            display: "inline-block",
                            marginRight: "20px",
                            marginBottom: "15px",
                            marginLeft: "20px"
                          }}
                        >
                          {isSame ? (
                            <Chip
                              key={course}
                              label={course}
                              onDelete={handleDelete(course)}
                            />
                          ) : (
                            <Chip
                              key={course}
                              label={course}
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <Typography variant="body1">
                        No courses found. Please upload a transcript.
                      </Typography>
                    )}
                  </Box>
                </>
              )}
              {selectedTab === 2 && (
                <Box sx={{ width: "1200px" }}>
                  <CustomButton
                    variant="outlined"
                    onClick={handleClickCreateGroupButton}
                    sx={{ marginLeft: "20px" }}
                  >
                    Create Groups
                  </CustomButton>
                  {myAllGroups.data && myAllGroups.data.length > 0 ? (
                    <ThemeProvider theme={theme}>
                      <Box sx={{ flexGrow: 1, padding: 0 }}>
                        <Grid
                          container
                          spacing={2}
                          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
                          className="home-result-cards"
                          sx={{ paddingLeft: "20px" }}
                        >
                          {myAllGroups.data
                            .slice(
                              (currentMyAllGroupsPages - 1) * 12,
                              currentMyAllGroupsPages * 12
                            )
                            .map((group, index) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={index}
                                sx={{ display: "flex" }}
                              >
                                <Item>
                                  <Card
                                    variant="outlined"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      height: "100%",
                                      width: "300px"
                                    }}
                                  >
                                    <GroupCard group={group} />
                                  </Card>
                                </Item>
                              </Grid>
                            ))}
                        </Grid>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 3
                          }}
                        >
                          <Stack spacing={2}>
                            <Pagination
                              count={myAllGroupsPages}
                              page={currentMyAllGroupsPages}
                              onChange={handleGroupPageChange}
                              variant="outlined"
                              color="primary"
                            />
                          </Stack>
                        </Box>
                      </Box>
                    </ThemeProvider>
                  ) : (
                    <Typography variant="body1">
                      No Groups found. Please upload a transcript.
                    </Typography>
                  )}
                </Box>
              )}

              {selectedTab === 3 && (
                <Box sx={{ width: "1200px" }}>
                  {myAllProjects.data && myAllProjects.data.length > 0 ? (
                    <ThemeProvider theme={theme}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid
                          container
                          spacing={2}
                          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
                          className="home-result-cards"
                          sx={{ paddingLeft: "20px" }}
                        >
                          {myAllProjects.data
                            .slice(
                              (currentMyAllProjectsPages - 1) * 12,
                              currentMyAllProjectsPages * 12
                            )
                            .map((project, index) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={index}
                                sx={{ display: "flex" }}
                              >
                                <Item>
                                  <Card
                                    variant="outlined"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      height: "100%",
                                      width: "300px"
                                    }}
                                  >
                                    <RecomCard recom={project} />
                                  </Card>
                                </Item>
                              </Grid>
                            ))}
                        </Grid>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 3
                          }}
                        >
                          <Stack spacing={2}>
                            <Pagination
                              count={myAllGroupsPages}
                              page={currentMyAllGroupsPages}
                              onChange={handleGroupPageChange}
                              variant="outlined"
                              color="primary"
                            />
                          </Stack>
                        </Box>
                      </Box>
                    </ThemeProvider>
                  ) : (
                    <Typography variant="body1">
                      No Groups found. Please upload a transcript.
                    </Typography>
                  )}
                </Box>
              )}

              {selectedTab === 4 && (
                <Box sx={{ width: "1200px" }}>
                  {myAllRecommends.data && myAllRecommends.data.length > 0 ? (
                    <ThemeProvider theme={theme}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid
                          container
                          spacing={2}
                          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
                          className="home-result-cards"
                          sx={{ paddingLeft: "20px" }}
                        >
                          {myAllRecommends.data
                            .slice(
                              (currentMyAllRecommendsPages - 1) * 12,
                              currentMyAllRecommendsPages * 12
                            )
                            .map((recom, index) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={index}
                                sx={{ display: "flex" }}
                              >
                                <Item>
                                  <Card
                                    variant="outlined"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      height: "100%",
                                      width: "300px"
                                    }}
                                  >
                                    <RecomCard recom={recom} />
                                  </Card>
                                </Item>
                              </Grid>
                            ))}
                        </Grid>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 3
                          }}
                        >
                          <Stack spacing={2}>
                            <Pagination
                              count={myAllRecommendsPages}
                              page={currentMyAllGroupsPages}
                              onChange={handleRecommPageChange}
                              variant="outlined"
                              color="primary"
                            />
                          </Stack>
                        </Box>
                      </Box>
                    </ThemeProvider>
                  ) : (
                    <Typography variant="body1">
                      No Groups found. Please upload a transcript.
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </div>
        ) : role === "academic" ? (
          <div className="Detail-father-box">
            <Box>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                textColor="primary"
              >
                <Tab label="My projects" />
              </Tabs>
              <div style={{ height: "16px" }}></div>

              {selectedTab === 0 && (
                <>
                  <Typography variant="body1">
                    <CustomButton
                      variant="outlined"
                      onClick={handleClickCreateProjectButton}
                    >
                      Create Projects
                    </CustomButton>
                  </Typography>
                  {myAllProjects.data && myAllProjects.data.length > 0 ? (
                    <ThemeProvider theme={theme}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid
                          container
                          spacing={2}
                          columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
                          className="home-result-cards"
                          sx={{ paddingLeft: "0px" }}
                        >
                          {myAllProjects.data
                            .slice(
                              (currentMyAllProjectsPages - 1) * 12,
                              currentMyAllProjectsPages * 12
                            )
                            .map((project, index) => (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={index}
                                sx={{ display: "flex", paddingLeft: "0px" }}
                              >
                                <Item>
                                  <Card
                                    variant="outlined"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      height: "100%",
                                      width: "300px",
                                      paddingLeft: "0px"
                                    }}
                                  >
                                    <ProjectCard project={project} />
                                  </Card>
                                </Item>
                              </Grid>
                            ))}
                        </Grid>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 3
                          }}
                        >
                          <Stack spacing={2}>
                            <Pagination
                              count={myAllProjectsPages}
                              page={currentMyAllProjectsPages}
                              onChange={handlePageChange}
                              variant="outlined"
                              color="primary"
                            />
                          </Stack>
                        </Box>
                      </Box>
                    </ThemeProvider>
                  ) : (
                    <Typography variant="body1">
                      No projects found. Please upload a transcript.
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </div>
        ) : (
          <></>
        )}
      </Box>
      <div>
        {showTable && (
          <Box className="mydetail-projects-modal-container">
            <div>
              {isEditProject ? (
                <p className="create-conversation-title">Edit Project</p>
              ) : (
                <p className="create-conversation-title">Create Project</p>
              )}

              <img
                src={cross}
                alt="close"
                className="mydetail-projects-modal-close-icon"
                onClick={() => {
                  setShowTable(false);
                  setMyProjectsName("");
                  setMyProjectsDescription("");
                  setMyProjectsDueDate(null);
                  setMyProjectsSize("");
                  setMyProjectsSearchQuery("");
                  setMyProjectsSkills([""]);
                  setMySkillsSearchResults([]);
                  setMyGroupsName("");
                  setMyCoursesSearchQuery("");
                  setIsEditProject(false);
                }}
              />
              {!isEditProject ? (
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={searchOption}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Course"
                      control={<Radio />}
                      label="Course"
                    />
                    <FormControlLabel
                      value="Skill"
                      control={<Radio />}
                      label="Skill"
                    />
                  </RadioGroup>
                </FormControl>
              ) : (
                <></>
              )}

              {!isEditProject ? (
                <Box mb={2} display="flex">
                  <CustomTextField
                    variant="outlined"
                    fullWidth
                    placeholder="Search related courses..."
                    value={myProjectsSearchQuery}
                    onChange={(e) => setMyProjectsSearchQuery(e.target.value)}
                  />
                  <CustomButton
                    variant="contained"
                    color="primary"
                    onClick={handleMyProjectsSearch}
                  >
                    Search
                  </CustomButton>
                </Box>
              ) : (
                <></>
              )}
              {Object.keys(myProjectsSearchResults).length > 0 && (
                <Box mb={2} sx={{ maxHeight: "200px", overflowY: "auto" }}>
                  {Object.keys(myProjectsSearchResults).map((key, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      onClick={() => handleMyProjectsOptionClick(key)}
                      fullWidth
                    >
                      {key}
                    </Button>
                  ))}
                </Box>
              )}

              <Table>
                <TableBody>
                  {!isEditProject ? (
                    <TableRow>
                      <CustomTableCell>Course:</CustomTableCell>
                      {myCoursesSearchQuery !== "" ? (
                        <CustomTableCell>
                          {myCoursesSearchQuery}
                        </CustomTableCell>
                      ) : (
                        <></>
                      )}
                    </TableRow>
                  ) : (
                    <></>
                  )}
                  {!isEditProject ? (
                    <>
                      <CustomTableCell>Skills:</CustomTableCell>
                      <CustomTableCell>
                        {mySkillsSearchResults.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill.trim()} 
                            sx={{ marginRight: 1, marginBottom: 1 }} 
                            onDelete={() => handleDeleteSkill(skill)}
                          />
                        ))}
                      </CustomTableCell>
                    </>
                  ) : (
                    <></>
                  )}

                  <TableRow>
                    <CustomTableCell>Name:</CustomTableCell>
                    <CustomTableCell>
                      <CustomTextField
                        variant="outlined"
                        fullWidth
                        value={myProjectsName}
                        onChange={(e) => setMyProjectsName(e.target.value)}
                        placeholder={
                          !isEditProject
                            ? "Input project name"
                            : isEditProjectName
                        }
                      />
                    </CustomTableCell>
                  </TableRow>
                  <TableRow>
                    <CustomTableCell>Description:</CustomTableCell>
                    <CustomTableCell>
                      <CustomTextField
                        variant="outlined"
                        fullWidth
                        value={myProjectsDescription}
                        placeholder={
                          !isEditProject
                            ? "Input project name"
                            : isEditProjectDescription
                        }
                        onChange={(e) =>
                          setMyProjectsDescription(e.target.value)
                        }
                      />
                    </CustomTableCell>
                  </TableRow>
                  {!isEditProject ? (
                    <TableRow>
                      <CustomTableCell>Size:</CustomTableCell>
                      <CustomTableCell>
                        <CustomTextField
                          variant="outlined"
                          fullWidth
                          value={myProjectsSize}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setMyProjectsSize(value);
                            }
                          }}
                        />
                      </CustomTableCell>
                    </TableRow>
                  ) : (
                    <></>
                  )}

                  <TableRow>
                    <CustomTableCell>Due Date:</CustomTableCell>
                    <CustomTableCell>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={myProjectsDueDate}
                          onChange={(newValue) =>
                            setMyProjectsDueDate(newValue)
                          }
                          renderInput={(params) => (
                            <CustomTextField {...params} key={params.id} />
                          )}
                        />
                      </LocalizationProvider>
                    </CustomTableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Box display="flex" justifyContent="center" mt={2}>
                {!isEditProject ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickCreateButton}
                  >
                    Create
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={PUTmyprojects}
                  >
                    Edit
                  </Button>
                )}
              </Box>
            </div>
          </Box>
        )}
      </div>
      <div>
        {showGroupTable && (
          <Box className="mydetail-projects-modal-container">
            <div>
              <p className="create-conversation-title">Create a group</p>
              <img
                src={cross}
                alt="close"
                className="mydetail-projects-modal-close-icon"
                onClick={() => setShowGroupTable(false)}
              />

              <Box mb={2} display="flex">
                <CustomTextField
                  variant="outlined"
                  fullWidth
                  placeholder="Search related projects..."
                  value={myGroupsSearchQuery}
                  onChange={(e) => setMyGroupsSearchQuery(e.target.value)}
                />
                <CustomButton
                  variant="contained"
                  color="primary"
                  onClick={handleMyGroupsSearch}
                >
                  Search
                </CustomButton>
              </Box>
              {Object.keys(myGroupsSearchResults).length > 0 && (
                <Box mb={2} sx={{ maxHeight: "200px", overflowY: "auto" }}>
                  {Object.keys(myGroupsSearchResults).map((key, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      onClick={() => handleMyGroupsOptionClick(key)}
                      fullWidth
                    >
                      {key}
                      {}
                    </Button>
                  ))}
                </Box>
              )}

              <Table>
                <TableBody>
                  <TableRow>
                    <CustomTableCell>Name:</CustomTableCell>
                    <CustomTableCell>
                      <CustomTextField
                        variant="outlined"
                        fullWidth
                        value={myGroupsName}
                        onChange={(e) => setMyGroupsName(e.target.value)}
                      />
                    </CustomTableCell>
                  </TableRow>
                  <TableRow>
                    <CustomTableCell>Description:</CustomTableCell>
                    <CustomTableCell>
                      <CustomTextField
                        variant="outlined"
                        fullWidth
                        value={myGroupsDescription}
                        onChange={(e) => setMyGroupsDescription(e.target.value)}
                      />
                    </CustomTableCell>
                  </TableRow>
                  <TableRow>
                    <CustomTableCell>Group size:</CustomTableCell>
                    <CustomTableCell>
                      <CustomTextField
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={myGroupsSize}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            setMyGroupsSize(value);
                          }
                        }}
                      />
                    </CustomTableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClickhandleClickCreateGroup}
                >
                  Create
                </Button>
              </Box>
            </div>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default Student_Right_Mydetail_Box;
