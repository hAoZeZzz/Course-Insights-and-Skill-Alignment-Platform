import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AdminGroupModal = (props) => {
  const group = props.group;
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    size: '',
    description: ''
  });
  useEffect(()=>{
    if(props.group) {
      setFormData({
        id: props.group.id || '',
        name: props.group.name || '',
        size: props.group.size || '',
        description: props.group.description || ''
      })
    }
  },[props.group])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]:value, });
  };

  const handleSave = () => {
    props.onSave(formData);
    props.onHide();
  }
  if (!props.group) {
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
          Edit {group.code} Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="changeUserEmail">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
                type="text"
                name="name"
                placeholder={`${group.name}`}
                autoFocus
                onChange={handleChange}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="changeUserEmail">
            <Form.Label>Group Size</Form.Label>
            <Form.Control
                type="text"
                name="size"
                placeholder={`${group.size}`}
                autoFocus
                onChange={handleChange}
              />
          </Form.Group>
          <Form.Group className="mb-3" controlId="changeUserEmail">
            <Form.Label>Group description</Form.Label>
            <Form.Control
                type="text"
                name="URL"
                placeholder={`${group.description}`}
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

export default AdminGroupModal;