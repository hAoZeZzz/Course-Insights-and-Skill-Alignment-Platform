import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AdminDeleteModal = (props) => {
  const handleDelete = () => {
    props.onHide();
    props.onSure();
  };

  if (!props.user) {
    return null; 
  }
  
  return(
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete This User? Please Double Check</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>The user name is {props.user.user_name}.</h4><br />
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

export default AdminDeleteModal;