import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function CreateForm(props) {
  const [id, setID] = useState(undefined)

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      start: e.target.start.value,
      end: e.target.end.value,
      format: e.target.format.value,
      duration: e.target.duration.value,
    }

    const url = `http://${process.env.REACT_APP_FLASK_SERVER}/form/create`;
    fetch(url, {
      method: "POST", headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((res) => {
        setID(res.id)
        console.log(res, 'res');
      });
  };

  return (
    <>
      <Form onSubmit={onSubmit} className="w-25">
        <Form.Group className="mb-3">
          <Form.Label>Start time</Form.Label>
          <Form.Control type="date" name="start" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>End time</Form.Label>
          <Form.Control type="date" name="end" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Interval Format</Form.Label>
          <Form.Select name="format" >
            <option value="second">Second</option>
            <option value="minute">Minute</option>
            <option value="hour">Hour</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Interval Duration</Form.Label>
          <Form.Control type="text" name="duration" />
        </Form.Group>
        <Button variant="primary" type="submit" className="me-2">
          Create
        </Button>
      </Form>
      {id && <p>{id}</p>}
    </>
  );
}

export default CreateForm;
