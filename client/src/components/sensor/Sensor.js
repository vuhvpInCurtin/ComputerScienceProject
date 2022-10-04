import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Visualization from "../chart/Visualization";

function Sensor() {
  const [eventSrc, setEventSrc] = useState(undefined);

  const onSubmit = (e) => {
    e.preventDefault();
    const url = `http://${e.target.ip.value}:${e.target.port.value}/sensor/stream`;
    setEventSrc(new EventSource(url));
  };

  const handleClose = () => {
    eventSrc.close();
    setEventSrc(undefined);
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Ip Address</Form.Label>
          <Form.Control type="text" name="ip" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Port</Form.Label>
          <Form.Control type="text" name="port" />
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

export default Sensor;
