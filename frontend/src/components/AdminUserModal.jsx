import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AdminUserModal = (props) => {
  const [formData, setFormData] = useState({
    id: '',
    user_name: '',
    email: '',
    bio: '',
    role: '',
  });
  const user = props.user;
  useEffect(() => {
    if (props.user) {
      setFormData({
        id: props.user.id || '',
        user_name: props.user.user_name || '',
        email: props.user.email || '',
        bio: props.user.bio || '',
        role: props.user.role || '',
      });
    }
  }, [props.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({...prevFormData, [name]:value, }));
  };
  useEffect(() => {
    console.log(formData);
  }, [formData])
  const handleSave = () => {
    props.onSave(formData);
    props.onHide();
  }
  if (!props.user) {
    return null;
  }

  return(
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit User Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="changeUserName">
            <Form.Label>User Name</Form.Label>
            <Form.Control
                type="text"
                name="user_name"
                placeholder={`${user.user_name}`}
                autoFocus
                onChange={handleChange}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="changeUserEmail">
            <Form.Label>User Email</Form.Label>
            <Form.Control
                type="email"
                name="email"
                placeholder={`${user.email}`}
                autoFocus
                onChange={handleChange}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="changeUserBio">
            <Form.Label>User Bio</Form.Label>
            <Form.Control
                type="text"
                name="bio"
                placeholder={`${user.bio}`}
                autoFocus
                onChange={handleChange}
              />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave}>Save</Button>
        <Button variant="danger" onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AdminUserModal;