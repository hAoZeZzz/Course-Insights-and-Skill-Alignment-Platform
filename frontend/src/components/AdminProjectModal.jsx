import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AdminProjectModal = (props) => {
  const [formData, setFormData] = useState({
    id:'',
    name: '',
    due_date: '',
    description: '',
    skills: [],
  });

  const project = props.project;
  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id || '',
        name: project.name || '',
        due_date: project.due_date || '',
        description: project.description || '',
        skills: project.skills || [],
      });
    }
  }, [props.project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({...prevFormData, [name]:value, }));
  };

  const handleSave = () => {
    props.onSave(formData);
    props.onHide();
  }
  
  if (!props.project) {
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
          Edit Project Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="changeUserName">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
                type="text"
                name="name"
                placeholder={`${project.name}`}
                autoFocus
                onChange={handleChange}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="changeUserEmail">
            <Form.Label>Project Due Date</Form.Label>
            <Form.Control
                type="date"
                name="due_date"
                value={`${project.due_date}`}
                autoFocus
                onChange={handleChange}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="changeUserBio">
            <Form.Label>Project Description</Form.Label>
            <Form.Control
                type="text"
                name="bio"
                placeholder={`${project.description}`}
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
  );
};

export default AdminProjectModal;