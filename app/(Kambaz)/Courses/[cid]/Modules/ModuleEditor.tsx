// app/(Kambaz)/Courses/[cid]/Modules/ModuleEditor.tsx
"use client";

import { Modal, Form, Button } from "react-bootstrap";

export default function ModuleEditor({
                                         show,
                                         handleClose,
                                         dialogTitle,
                                         moduleName,
                                         setModuleName,
                                         addModule
                                     }: {
    show: boolean;
    handleClose: () => void;
    dialogTitle: string;
    moduleName: string;
    setModuleName: (name: string) => void;
    addModule: () => void;
}) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{dialogTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    placeholder="Module Name"
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        addModule();
                        handleClose();
                    }}
                >
                    Add Module
                </Button>
            </Modal.Footer>
        </Modal>
    );
}