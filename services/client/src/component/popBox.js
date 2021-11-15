import React, { useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { PopBoxCxt } from "../component/contexts";

const PopBox = ({ isShow, content, cb }) => {
	const { setPopbox } = useContext(PopBoxCxt);
	return (
		<Modal show={isShow} onHide={cb}>
			<Modal.Header closeButton>
				<Modal.Title>Important Note</Modal.Title>
			</Modal.Header>
			<Modal.Body>{content}</Modal.Body>
			<Modal.Footer>
				<Button
					variant="primary"
					onClick={() => setPopbox({ isShow: false, content: "" })}>
					OK
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default PopBox;
