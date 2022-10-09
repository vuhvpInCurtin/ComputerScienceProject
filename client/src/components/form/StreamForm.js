import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Visualization from "../chart/Visualization";

function StreamForm() {
    const [eventSrc, setEventSrc] = useState(undefined);

    const onSubmit = (e) => {
        e.preventDefault();
        const url = `http://${process.env.REACT_APP_FLASK_SERVER}/form/get-data/${e.target.id.value}`;
        fetch(url)
            .then((res) => res.json())
            .then((res) => {
                if (res.streaming) {
                    setEventSrc(new EventSource(url));
                }
                else {
                    alert("ID is not streaming")
                }
            });
    };

    const handleClose = () => {
        eventSrc.close();
        setEventSrc(undefined);
    };

    return (
        <>
            <Form onSubmit={onSubmit} className='w-25'>
                <Form.Group className="mb-3">
                    <Form.Label>ID</Form.Label>
                    <Form.Control type="text" name="id" />
                </Form.Group>
                <Button variant="primary" type="submit" className="me-2">
                    Connect
                </Button>
                <Button variant="primary" type="button" onClick={handleClose}>
                    Close
                </Button>
            </Form>
            {eventSrc && <Visualization eventSrc={eventSrc} />}
        </>
    );
}

export default StreamForm;
