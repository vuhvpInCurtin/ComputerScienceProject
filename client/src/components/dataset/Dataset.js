import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import SensorVisualization from "../sensor/SensorVisualization";
import DatasetVisualization from "./DatasetVisualization";

function Dataset(props) {
  const [file, setFile] = useState(undefined);
  const [data, setData] = useState({});
  const [header, setHeader] = useState([]);
  const [rows, setRows] = useState([]);
  const [eventSrc, setEventSrc] = useState(undefined);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = () => {
    // const reader = new FileReader();
    // reader.onload = (evt) => {
    //   const bstr = evt.target.result;
    //   const wb = XLSX.read(bstr, { type: "binary" });
    //   const wsName = wb.SheetNames[0];
    //   const ws = wb.Sheets[wsName];
    //   const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    //   setHeader(data[0]);
    //   setRows(data.slice(1));
    // };
    // reader.readAsBinaryString(file);
    const data = new FormData();
    data.append("file", file);

    const url = `http://${process.env.REACT_APP_FLASK_SERVER}/upload`;
    fetch(url, { method: "POST", body: data })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const url = `http://${process.env.REACT_APP_FLASK_SERVER}/stream-dataset`;
          setEventSrc(new EventSource(url));
        }
      });
  };

  // useEffect(() => {
  //   const _data = {};
  //   header.forEach((h, i) => {
  //     if (!h.toLowerCase().includes("date")) {
  //       const value = rows.map((row) => {
  //         return { time: row[0], value: row[i] };
  //       });
  //       _data[h] = value;
  //     }
  //   });
  //   setData(_data);
  // }, [header, rows]);

  return (
    <>
      <Form className="w-50 d-flex align-items-end">
        <Form.Group className="me-3" controlId="formFile">
          <Form.Label>Upload File</Form.Label>
          <Form.Control type="file" onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="button" onClick={uploadFile}>
          Upload
        </Button>
      </Form>
      {eventSrc && <SensorVisualization eventSrc={eventSrc} />}
    </>
  );
}

export default Dataset;
