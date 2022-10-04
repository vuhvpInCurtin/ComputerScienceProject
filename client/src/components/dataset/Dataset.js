import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Visualization from "../chart/Visualization";

function Dataset() {
  const [file, setFile] = useState(undefined);
  const [eventSrc, setEventSrc] = useState(undefined);
  const [isPaused, setIsPaused] = useState(false);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = () => {
    setEventSrc(undefined);
    const data = new FormData();
    data.append("file", file);

    const url = `http://${process.env.REACT_APP_FLASK_SERVER}/dataset/upload`;
    fetch(url, { method: "POST", body: data })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const url = `http://${process.env.REACT_APP_FLASK_SERVER}/dataset/stream`;
          setEventSrc(new EventSource(url));
        }
      });
  };

  const handleContinue = () => {
    const url = `http://${process.env.REACT_APP_FLASK_SERVER}/dataset`;
    const data = new FormData();
    data.append("button", "Start");

    fetch(url, { method: "POST", body: data }).then((res) => {
      if (res.status == 200) {
        setIsPaused(false);
      }
    });
  };

  const handlePause = () => {
    const url = `http://${process.env.REACT_APP_FLASK_SERVER}/dataset`;
    const data = new FormData();
    data.append("button", "Stop");

    fetch(url, { method: "POST", body: data }).then((res) => {
      if (res.status == 200) {
        setIsPaused(true);
      }
    });
  };

  return (
    <>
      <Form className="w-50 d-flex align-items-end">
        <Form.Group className="me-3" controlId="formFile">
          <Form.Label>Upload File</Form.Label>
          <Form.Control type="file" onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="button" className="me-3" onClick={uploadFile}>
          Upload
        </Button>
        {eventSrc && (
          <Button variant="primary" type="button" className="me-3" onClick={handleContinue} disabled={!isPaused}>
            Continue
          </Button>
        )}
        {eventSrc && (
          <Button variant="primary" type="button" onClick={handlePause} disabled={isPaused}>
            Pause
          </Button>
        )}
      </Form>
      {eventSrc && <Visualization eventSrc={eventSrc} />}
    </>
  );
}
// "9a19e36032584078a115a0a92869bc8d"

export default Dataset;
