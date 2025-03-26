import { Modal, Button } from "react-bootstrap";

const ShotErrorModal = ({showErrorModal, setShowErrorModal, errorMessage }) => {
    return (
        <Modal
            show={showErrorModal}
            onHide={() => setShowErrorModal(false)}
            centered
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton style={{ background: "#1e3c72", color: "white" }}>
                <Modal.Title>Shot not fired</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: "#2a5298", color: "white", fontSize: "16px", textAlign: "center" }}>
                <p>{errorMessage}</p>
            </Modal.Body>
            <Modal.Footer style={{ background: "#1e3c72" }}>
                <Button
                    variant="danger"
                    onClick={() => setShowErrorModal(false)}
                    style={{ fontWeight: "bold", fontSize: "16px", padding: "10px 20px" }}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

    );
}
export default ShotErrorModal;