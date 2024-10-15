import { Modal, Button } from 'react-bootstrap';

const TileInfoModal = ({ modalInfo, show, handleClose }) => {
    return (
      <Modal className="additonal-info-modal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Additonal Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalInfo}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  export default TileInfoModal;