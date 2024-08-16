import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AdminProjectDeleteModal = (props) => {
  const handleDelete = () => {
    props.onHide();
    props.onSure();
  };

  if (!props.project) {
    return null; // 如果 props.project 为空，则不渲染任何内容
  }
  
  return(
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete This Project? Please Double Check</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>The project name is {props.project.name}.</h4><br />
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

export default AdminProjectDeleteModal;