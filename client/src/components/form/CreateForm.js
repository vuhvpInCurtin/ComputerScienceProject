import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function CreateForm(props) {
  const [id, setID] = useState(undefined)

  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      date: new Date(e.target.date.value + ' 23:59:59').toLocaleString(),
      format: e.target.format.value,
      duration: e.target.duration.value,
    }

    const url = `${process.env.REACT_APP_NODE_IP}:5001/create`;
    fetch(url, {
      method: "POST", headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((res) => {
        setID(res.insertedId)
      });
  };

  return (
    <>
      <Form onSubmit={onSubmit} className="w-25">
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" name="date" min={new Date().toJSON().split('T')[0]} />
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
