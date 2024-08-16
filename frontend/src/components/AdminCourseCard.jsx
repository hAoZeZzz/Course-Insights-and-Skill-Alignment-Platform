import { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/esm/Container';
import Typography from '@mui/material/Typography';
import { API_ENDPOINT } from '../constants';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import AdminCourseModal from './AdminCourseModal';
import AdminCourseDeleteModal from './AdminCourseDeleteModal'

const AdminCourseCard = () => {
  const token = localStorage.getItem('token');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchCourseName, setSearchCourseName] = useState('');
  const [event, setEvent] = useState('')

  const handleSearchFieldChange = (e) => {
    setSearchCourseName(e.target.value);
  }

  const handleDelete = async (course) => {
    try {
      const res = await fetch(`${API_ENDPOINT}/admin/courses?original_code=${course.code}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      })
      if (!res.ok) {
        throw new Error("Failed to delete course information");
      } else {
        setFilteredCourses(filteredCourses.filter(item => item !== course));
        setCourses(courses.filter(item => item !== course));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    };
    setDeleteModalShow(false);
    // delete selected user
    setSelectedCourse(null); 
  }

  const handleSave = async(updatedCourse) => {
    try {
      const res = await fetch(`${API_ENDPOINT}/admin/courses`, {
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          original_code: updatedCourse.code,
          name: updatedCourse.name,
          url: updatedCourse.url,
          detail: updatedCourse.detail
        })
      });
      if (!res.ok) {
        throw new Error("Failed to update course information");
      }
      setFilteredCourses(filteredCourses.map(
        course => (
          course.code === updatedCourse.code? updatedCourse : course
        )
      ))
      setCourses(courses.map(
        course => (
          course.code === updatedCourse.code? updatedCourse : course
        )
      ))
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    };
    setModalShow(false);
    setSelectedCourse(null);
  }

  const handleSort = (eventKey) => {
    setEvent(eventKey);
  }

  useEffect(() => {
    if (event === 'ascend') {
      const sortedCourses = [...filteredCourses].sort((a, b) => a.code.localeCompare(b.code));
      setFilteredCourses(sortedCourses);
    } else if (event === 'descend') {
      const sortedCourses = [...filteredCourses].sort((a, b) => b.code.localeCompare(a.code));
      setFilteredCourses(sortedCourses);
    }
  },[event])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getCoursesInfo = async() => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/dashboard/allcourses`,
        {
          methods: 'GET',
          headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setCourses(data.data);
        setFilteredCourses(data.data);
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
    }
  }

  useEffect (()=> {
    getCoursesInfo();
  }, [])

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchCourseName) {
      const nums = /\d/;
      const regex = new RegExp(searchCourseName, 'i'); 
      if (nums.test(searchCourseName)) {
        const tempArray = filteredCourses.filter((item) => {
          return regex.test(item.code);
        })
        setFilteredCourses(tempArray);
      } else {
        const tempArray = filteredCourses.filter((item) => {
          return regex.test(item.name)
        })
        setFilteredCourses(tempArray);
      }
    } else {
      setFilteredCourses(courses);
      alert('You are able to input Course initials or codes. Have a try!')
    }
  }

  const paginatedCourses = filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <Container>
      <Row>
        <Col style={{paddingLeft:'0'}}><Typography variant="h4">Course Infomation</Typography></Col>
        <Col style={{display:'flex', justifyContent:'flex-end', paddingRight:'0'}}>
          <Form inline>
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search Course"
                className="mr-sm-2"
                onChange={handleSearchFieldChange}
              />
            </Col>
            <Col xs="auto">
              <Button type="submit" onClick={handleSearch}>Search</Button>
            </Col>
          </Row>
        </Form>
        </Col>
      </Row>
      <Row style={{display:'flex', justifyContent:'space-between', marginTop:'20px', flexDirection:"row"}}>
        <DropdownButton
          align="end"
          title="Sort"
          id="dropdown-menu-align-end"
          variant='info'
          style={{padding:'0', width:'87.88px'}}
          size="lg"
          onSelect={handleSort}
        >
          <Dropdown.Item eventKey="ascend">Ascend</Dropdown.Item>
          <Dropdown.Item eventKey="descend">Descend</Dropdown.Item>
        </DropdownButton>
      </Row>
      <Row style={{overflowY:'auto', height:'770px'}}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{textAlign:"Center"}}><h4>Course Code</h4></TableCell>
                <TableCell style={{textAlign:"Center"}}><h4>Course Name</h4></TableCell>
                <TableCell style={{textAlign:"Center"}}><h4>Operations</h4></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCourses.map((item, index) => (
                <TableRow key={index}>
                  <TableCell style={{textAlign:"Center"}}>{item.code}</TableCell>
                  <TableCell style={{textAlign:"Center"}}>{item.name}</TableCell>
                  <TableCell style={{display:'flex', justifyContent:'space-between'}}>
                    <Button variant='success' onClick={()=>{setModalShow(true); setSelectedCourse(item)}}>EDIT</Button>
                    <Button variant='danger'onClick={()=>{setDeleteModalShow(true); setSelectedCourse(item)}}>DEL</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <AdminCourseModal
              show={modalShow}
              onHide={()=>{setModalShow(false); setSelectedCourse(null)}}
              course={selectedCourse}
              onSave={handleSave}
            />
            <AdminCourseDeleteModal
              show={deleteModalShow}
              onHide={() => { setDeleteModalShow(false); setSelectedCourse(null); }}
              course={selectedCourse}
              onSure={()=>handleDelete(selectedCourse)}
            />
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[8, 15, 25]}
          component="div"
          count={filteredCourses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Row>
    </Container>
  );
};

export default AdminCourseCard;