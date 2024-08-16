import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AdminCourseModal = (props) => {
  const courses = props.course;
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    url: '',
    detail: ''
  });
  useEffect(()=>{
    if(props.course) {
      setFormData({
        code: props.course.code || '',
        name: props.course.name || '',
        url: props.course.url || '',
        detail: props.course.detail || ''
      })
    }
  },[props.course])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]:value, });
  };

  const handleSave = () => {
    props.onSave(formData);
    props.onHide();
  }
  if (!props.course) {
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
          Edit {courses.code} Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="changeUserEmail">
            <Form.Label>Course Name</Form.Label>
            <Form.Control
                type="text"
                name="name"
                placeholder={`${courses.name}`}
                autoFocus
                onChange={handleChange}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="changeUserEmail">
            <Form.Label>Course Detail</Form.Label>
            <Form.Control
                type="text"
                name="detail"
                placeholder={`${courses.detail}`}
                autoFocus
                onChange={handleChange}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="changeUserEmail">
            <Form.Label>Course URL</Form.Label>
            <Form.Control
                type="text"
                name="URL"
                placeholder={`${courses.url}`}
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

export default AdminCourseModal;