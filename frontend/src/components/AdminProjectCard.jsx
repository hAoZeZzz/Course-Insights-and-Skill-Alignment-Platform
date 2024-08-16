import { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Container from "react-bootstrap/esm/Container";
import Typography from "@mui/material/Typography";
import { API_ENDPOINT } from "../constants";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import AdminProjectModal from "./AdminProjectModal";
import AdminProjectDeleteModal from "./AdminProjectDeleteModal";

const AdminProjectCard = () => {
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchProjectName, setSearchProjectName] = useState("");
  const [event, setEvent] = useState("");

  const handleSearchFieldChange = (e) => {
    setSearchProjectName(e.target.value);
  };

  const handleSave = async (updatedProject) => {
    // console.log(typeof updatedProject.due_date, updatedProject.due_date);
    try {
      const res = await fetch(`${API_ENDPOINT}/admin/projects`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          original_id: updatedProject.id,
          name: updatedProject.name,
          description: updatedProject.description,
          due_date: updatedProject.due_date,
          skills: updatedProject.skills,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json(); 
        console.error("Server responded with an error:", errorData);
        throw new Error("Failed to update project information");
      }
      setFilteredProjects(
        filteredProjects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
      setProjects(
        projects.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
    setModalShow(false);
    setSelectedProject(null);
  };

  const handleDelete = async (project) => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/admin/projects?original_id=${project.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete project information");
      } else {
        setFilteredProjects(
          filteredProjects.filter((item) => item !== project)
        );
        setProjects(projects.filter((item) => item !== project));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
    setDeleteModalShow(false);
    setSelectedProject(null);
  };

  const handleSort = (eventKey) => {
    setEvent(eventKey);
  };

  useEffect(() => {
    if (event === "Name Ascend") {
      const sortedProjects = [...filteredProjects].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setFilteredProjects(sortedProjects);
    } else if (event === "Name Descend") {
      const sortedProjects = [...filteredProjects].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
      setFilteredProjects(sortedProjects);
    } else if (event === "Due Date Ascend") {
      const sortedProjects = [...filteredProjects].sort((a, b) => {
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);

        return dateB - dateA;
      });
      setFilteredProjects(sortedProjects);
    } else if (event === "Due Date Descend") {
      const sortedProjects = [...filteredProjects].sort((a, b) => {
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);

        return dateA - dateB;
      });
      setFilteredProjects(sortedProjects);
    }
  }, [event]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getProjectsInfo = async () => {
    try {
      const res = await fetch(`${API_ENDPOINT}/dashboard/allprojects`, {
        methods: "GET",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setProjects(
          data.data.map((item) => ({
            ...item,
            due_date: item.due_date.split("T")[0],
          }))
        );
        setFilteredProjects(
          data.data.map((item) => ({
            ...item,
            due_date: item.due_date.split("T")[0],
          }))
        );
        // console.log(data.data);
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
    }
  };

  useEffect(() => {
    getProjectsInfo();
  }, []);

  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    if (searchProjectName) {
      const regex = new RegExp(searchProjectName, "i");
      const tempArray = filteredProjects.filter((item) => {
        return regex.test(item.name);
      });
      setFilteredProjects(tempArray);
    } else {
      setFilteredProjects(projects);
      alert("You are able to input incomplete name. Have a try!");
    }
  };

  const paginatedProjects = filteredProjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <Container>
      <Row>
        <Col style={{ paddingLeft: "0" }}>
          <Typography variant="h4">Project Infomation</Typography>
        </Col>
        <Col
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "0",
          }}
        >
          <Form inline>
            <Row>
              <Col xs="auto">
                <Form.Control
                  type="text"
                  placeholder="Search Project"
                  className="mr-sm-2"
                  onChange={handleSearchFieldChange}
                />
              </Col>
              <Col xs="auto">
                <Button type="submit" onClick={handleSearchButtonClick}>
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          flexDirection: "row",
        }}
      >
        <DropdownButton
          align="end"
          title="Sort"
          id="dropdown-menu-align-end"
          variant="info"
          style={{ padding: "0", width: "87.88px" }}
          size="lg"
          onSelect={handleSort}
        >
          <Dropdown.Item eventKey="Name Ascend">Name Ascend</Dropdown.Item>
          <Dropdown.Item eventKey="Name Descend">Name Descend</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="Due Date Ascend">
            Due Date Ascend
          </Dropdown.Item>
          <Dropdown.Item eventKey="Due Date Descend">
            Due Date Descend
          </Dropdown.Item>
        </DropdownButton>
      </Row>
      <Row style={{ overflowY: "auto", height: "770px" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: "Center" }}>
                  <h4>Project Name</h4>
                </TableCell>
                <TableCell style={{ textAlign: "Center" }}>
                  <h4>Project Due Date</h4>
                </TableCell>
                <TableCell style={{ textAlign: "Center" }}>
                  <h4>Operations</h4>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProjects.map((item, index) => (
                <TableRow key={index}>
                  <TableCell style={{ textAlign: "Center" }}>
                    {item.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "Center" }}>
                    {item.due_date.replace("T", " ")}
                  </TableCell>
                  <TableCell
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      variant="success"
                      onClick={() => {
                        setModalShow(true);
                        setSelectedProject(item);
                      }}
                    >
                      EDIT
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setDeleteModalShow(true);
                        setSelectedProject(item);
                      }}
                    >
                      DEL
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <AdminProjectModal
            show={modalShow}
            onHide={() => {
              setModalShow(false);
              setSelectedProject(null);
            }}
            project={selectedProject}
            onSave={handleSave}
          />
          <AdminProjectDeleteModal
            show={deleteModalShow}
            onHide={() => {
              setDeleteModalShow(false);
              setSelectedProject(null);
            }}
            project={selectedProject}
            onSure={() => handleDelete(selectedProject)}
          />
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 15, 25]}
          component="div"
          count={filteredProjects.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Row>
    </Container>
  );
};

export default AdminProjectCard;
