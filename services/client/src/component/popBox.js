import React, { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { PopBoxCxt } from "../component/contexts";

const PopBox = ({ isShow, content, cb }) => {
  const { setPopbox } = useContext(PopBoxCxt);
  if (!cb) {
    cb = () => setPopbox({ isShow: false, content: "" });
  }
  return (
    <Modal show={isShow}>
      <Modal.Header closeButton>
        <Modal.Title>Important Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={cb}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PopBox;
