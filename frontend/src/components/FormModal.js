import React from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import X from "@primer/octicons-react"

const FormModal = ({ show, closeModal, heading, children }) => {
	return (
		<Modal size="lg" show={show} onHide={closeModal}>
			<Modal.Header>
				<h2>{heading}</h2>
				<Button
					onClick={closeModal}
					variant="outline-dark"
					className="float-right"
				>
					<X />
				</Button>
			</Modal.Header>
			<Modal.Body>{children}</Modal.Body>
		</Modal>
	)
}

export default FormModal
