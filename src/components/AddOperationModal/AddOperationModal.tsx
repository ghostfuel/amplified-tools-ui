import { FunctionComponent, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';

type AddOperationModalProps = {
    show: boolean;
    onHide: () => void;
    children: ReactNode;
}

const AddOperationModal: FunctionComponent<AddOperationModalProps> = (props: AddOperationModalProps) => {
    return (
        <Modal centered show={props.show} onHide={props.onHide} className="text-dark">
            <Modal.Header closeButton>
                <Modal.Title>Add Operation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
        </Modal>
    );
}

export default AddOperationModal;