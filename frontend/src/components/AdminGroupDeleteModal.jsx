import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AdminGroupDeleteModal = (props) => {
  const handleDelete = () => {
    props.onHide();
    props.onSure();
  };

  if (!props.group) {
    return null; 
  }
  
  return(
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete This Group? Please Double Check</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>The group name is {props.group.name}.</h4><br />
        <h5>Warning: If you delete it, it will be removed forever!</h5>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" onClick={handleDelete}>
          Sure
        </Button>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
};

export default AdminGroupDeleteModal;