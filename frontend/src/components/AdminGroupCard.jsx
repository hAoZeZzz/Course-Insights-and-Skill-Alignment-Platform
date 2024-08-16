import { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/esm/Container';
import Typography from '@mui/material/Typography';
import { API_ENDPOINT } from '../constants';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import AdminGroupModal from './AdminGroupModal';
import AdminGroupDeleteModal from './AdminGroupDeleteModal';

const AdminGroupCard = () => {
  const token = localStorage.getItem('token');
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchGroup, setSearchGroup] = useState('');
  const [event, setEvent] = useState('')
  
  const getGroupInfo = async() => {
    try {
      const res = await fetch(
        `${API_ENDPOINT}/dashboard/allgroups`,
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
        setGroups(data.data);
        setFilteredGroups(data.data);
      }
    } catch (error) {
      alert("Failed to fetch: " + error.message);
    }
  }

  useEffect (()=> {
    getGroupInfo();
  }, [])

  const handleSearchFieldChange = (e) => {
    setSearchGroup(e.target.value);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchGroup) {
      const regex = new RegExp(searchGroup, 'i'); 
      const tempArray = filteredGroups.filter((item) => {
        return regex.test(item.name)
      })
      setFilteredGroups(tempArray);
    } else {
      setFilteredGroups(groups);
      alert('You are able to input incomplete group name. Have a try!')
    }
  }

  const handleSort = (eventKey) => {
    setEvent(eventKey);
  }

  useEffect(() => {
    if (event === 'ascend') {
      const sortedGroups = [...filteredGroups].sort((a, b) => a.name.localeCompare(b.name));
      setFilteredGroups(sortedGroups);
    } else if (event === 'descend') {
      const sortedGroups = [...filteredGroups].sort((a, b) => b.name.localeCompare(a.name));
      setFilteredGroups(sortedGroups);
    }
  },[event])

  const handleDelete = async (group) => {
    try {
      const res = await fetch(`${API_ENDPOINT}/admin/groups?original_id=${group.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      })
      if (!res.ok) {
        throw new Error("Failed to delete group information");
      } else {
        setFilteredGroups(filteredGroups.filter(item => item !== group));
        setGroups(groups.filter(item => item !== group));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    };
    setDeleteModalShow(false);
    setSelectedGroup(null);
  }

  const handleSave = async(updatedGroup) => {
    try {
      const res = await fetch(`${API_ENDPOINT}/admin/groups`, {
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          original_id: updatedGroup.id,
          name: updatedGroup.name,
          size: updatedGroup.size,
          description: updatedGroup.desciption
        })
      });
      if (!res.ok) {
        throw new Error("Failed to update course information");
      }
      setFilteredGroups(filteredGroups.map(
        group => (
          group.id === updatedGroup.id? updatedGroup : group
        )
      ))
      setGroups(groups.map(
        group => (
          group.id === updatedGroup.id? updatedGroup : group
        )
      ))
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    };
    setModalShow(false);
    setSelectedGroup(null);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedGroups = filteredGroups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return(
    <Container>
      <Row>
        <Col style={{paddingLeft:'0'}}><Typography variant="h4">Group Infomation</Typography></Col>
        <Col style={{display:'flex', justifyContent:'flex-end', paddingRight:'0'}}>
          <Form inline>
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search Group"
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
                <TableCell style={{textAlign:"Center"}}><h4>Group Name</h4></TableCell>
                <TableCell style={{textAlign:"Center"}}><h4>Group Size</h4></TableCell>
                <TableCell style={{textAlign:"Center"}}><h4>Operations</h4></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedGroups.map((item, index) => (
                <TableRow key={index}>
                  <TableCell style={{textAlign:"Center"}}>{item.name}</TableCell>
                  <TableCell style={{textAlign:"Center"}}>{item.size}</TableCell>
                  <TableCell style={{display:'flex', justifyContent:'space-between'}}>
                    <Button variant='success' onClick={()=>{setModalShow(true); setSelectedGroup(item)}}>EDIT</Button>
                    <Button variant='danger'onClick={()=>{setDeleteModalShow(true); setSelectedGroup(item)}}>DEL</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <AdminGroupModal
              show={modalShow}
              onHide={()=>{setModalShow(false); setSelectedGroup(null)}}
              group={selectedGroup}
              onSave={handleSave}
            />
            <AdminGroupDeleteModal
              show={deleteModalShow}
              onHide={() => { setDeleteModalShow(false); setSelectedGroup(null); }}
              group={selectedGroup}
              onSure={()=>handleDelete(selectedGroup)}
            />
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[8, 15, 25]}
          component="div"
          count={filteredGroups.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Row>
    </Container>
  )
}

export default AdminGroupCard;