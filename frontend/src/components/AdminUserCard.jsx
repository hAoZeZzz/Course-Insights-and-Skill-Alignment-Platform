import { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import Container from 'react-bootstrap/esm/Container';
import Typography from '@mui/material/Typography';
import { API_ENDPOINT } from '../constants';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import AdminUserModal from './AdminUserModal';
import AdminDeleteModal from './AdminDeleteModal';
const AdminUserCard = () => {
  const [userInfo, setUserInfo] = useState([]);
  const [filteredUserInfo, setFilteredUserInfo] = useState([]);
  const [eventKey, setEventKey] = useState(null);
  const [searchUserName, setSearchUserName] = useState('')
  const [modalShow, setModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const token = localStorage.getItem("token");

  const getUserInfo = async() => {
    try{
      const res = await fetch(
        `${API_ENDPOINT}/admin/users`,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setUserInfo(data.data);
      }
    } catch(error) {
      alert("Failed to fetch: " + error.message);
    }
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  useEffect(() => {
    if (eventKey === 'student') {
      const tempArray = userInfo.filter((item) => {
        return item.role === 'student'
      })
      setFilteredUserInfo(tempArray);
    } else if (eventKey === 'academic') {
      const tempArray = userInfo.filter((item) => {
        return item.role === 'academic'
      })
      setFilteredUserInfo(tempArray);
    } else if (eventKey === 'ascend') {
      const sortedUsers = [...filteredUserInfo].sort((a, b) => a.user_name.localeCompare(b.user_name));
      setFilteredUserInfo(sortedUsers);
    } else if (eventKey === 'descend') {
      const sortedUsers = [...filteredUserInfo].sort((a, b) => b.user_name.localeCompare(a.user_name));
      setFilteredUserInfo(sortedUsers);
    } else {
      setFilteredUserInfo(userInfo);
    }
  }, [userInfo, eventKey]) 

  const handleSelect = (eventKey) => {
    setEventKey(eventKey);
    getUserInfo();
  }

  const handleSearchFieldChange = (e) => {
    setSearchUserName(e.target.value)
  }
  
  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    if(searchUserName) {
      const regex = new RegExp(searchUserName, 'i'); 
      const tempArray = filteredUserInfo.filter((item) => {
        return regex.test(item.user_name)
      })
      setFilteredUserInfo(tempArray);
    } else {
      setFilteredUserInfo(userInfo);
      alert('You are able to input incomplete name. Have a try!')
    }
  }

  const handleSave = async(updatedUser) => {
    try {
      const res = await fetch(`${API_ENDPOINT}/admin/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: updatedUser.id,
          user_name: updatedUser.user_name,
          email: updatedUser.email,
          bio: updatedUser.bio
        })
      });
      if (!res.ok) {
        throw new Error("Failed to update user information");
      }
    //   console.log(1111111);
      setFilteredUserInfo(filteredUserInfo.map(
        user => (
          user.id === updatedUser.id ? updatedUser : user
        ))
      );
      setUserInfo(userInfo.map(
        user => (
          user.id === updatedUser.id ? updatedUser : user
        ))
      );
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    }
    // console.log(updatedUser);
    setModalShow(false);
    setSelectedUser(null);
  }

  const handleSort = (eventKey) => {
    setEventKey(eventKey);
  }
  useEffect(() => {
    console.log(filteredUserInfo);
  },[filteredUserInfo])

  const handleDelete = async (user) => {
    // console.log(user);
    try {
      const res = await fetch(`${API_ENDPOINT}/admin/users?email=${user.email}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      })
      if (!res.ok) {
        throw new Error("Failed to delete user information");
      } else {
        setFilteredUserInfo(filteredUserInfo.filter(item => item !== user));
        setUserInfo(filteredUserInfo.filter(item => item !== user));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch: " + error.message);
    };
    setDeleteModalShow(false);
    setSelectedUser(null); 
  }
  return ( 
    <Container>
      <Row>
        <Col style={{paddingLeft:'0'}}><Typography variant="h4">User Infomation</Typography></Col>
        <Col style={{display:'flex', justifyContent:'flex-end', paddingRight:'0'}}>
          <Form inline>
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search User Name"
                className="mr-sm-2"
                onChange={handleSearchFieldChange}
              />
            </Col>
            <Col xs="auto">
              <Button type="submit" onClick={handleSearchButtonClick}>Search</Button>
            </Col>
          </Row>
        </Form>
        </Col>
      </Row>
      <Row style={{display:'flex', justifyContent:'space-between', marginTop:'20px', flexDirection:"row"}}>
        <DropdownButton
          align="end"
          title="Filter"
          id="dropdown-menu-align-end"
          variant='warning'
          style={{padding:'0', width:'20%'}}
          size="lg"
          onSelect={handleSelect}
        >
          <Dropdown.Item eventKey="all">All</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="academic">Academic</Dropdown.Item>
          <Dropdown.Item eventKey="student">Student</Dropdown.Item>
        </DropdownButton>
        <DropdownButton
          align="end"
          title="Sort"
          id="dropdown-menu-align-end"
          variant='danger'
          style={{padding:'0', width:'87.88px'}}
          size="lg"
          onSelect={handleSort}
        >
          <Dropdown.Item eventKey="ascend">Ascend</Dropdown.Item>
          <Dropdown.Item eventKey="descend">Descend</Dropdown.Item>
        </DropdownButton>
      </Row>
      <Row>
        <div style={{ marginTop: "20px", width: '100%', maxHeight: '750px', overflowY: 'auto' }}>
          <Table striped bordered hover variant="secondary" style={{marginTop:"20px", width:'100%'}}>
            <thead>
              <tr style={{textAlign:'center'}}>
                <th>Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              {filteredUserInfo.map((item, index) => (
                <tr key={index}>
                <td>{item.user_name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td style={{display:'flex', justifyContent:'space-between'}}>
                  <Button variant='success' onClick={() => {setModalShow(true); setSelectedUser(item)}}>EDIT</Button>
                  <Button variant='info' onClick={() => {setDeleteModalShow(true); setSelectedUser(item)}}>DEL</Button>
                </td>
              </tr>
              ))}
            </tbody>
            <AdminUserModal
              show={modalShow}
              onHide={() => { setModalShow(false); setSelectedUser(null); }}
              user={selectedUser}
              onSave={handleSave}
            />
            <AdminDeleteModal
              show={deleteModalShow}
              onHide={() => { setDeleteModalShow(false); setSelectedUser(null); }}
              user={selectedUser}
              onSure={()=>handleDelete(selectedUser)}
            />
          </Table>
        </div>
      </Row>
    </Container>
  )
}

export default AdminUserCard;