import { useEffect, useState } from "react";
import { from, of, map, delay, concatAll, zip } from "rxjs";
import { Row, Col } from "react-bootstrap";
import LineChart from "../chart/LineChart";

function DatasetVisualization(props) {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [value, setValue] = useState([]);

  const dataListener = (items) => {
    return from(items).pipe(
      map((x) => of(x).pipe(delay(2000))),
      concatAll()
    );
  };

  useEffect(() => {
    Object.keys(props.data).forEach((key) => {
      setLabels((prev) => [...prev, key]);
      setData((prev) => [...prev, props.data[key]]);
    });
  }, [props.data]);

  useEffect(() => {
    const obs = [];
    data.forEach((d) => {
      obs.push(dataListener(d));
    });
    zip(...obs).subscribe((d) => setValue(d));
  }, [data]);

  return (
    <Row>
      {value.map((v, i) => {
        return (
          <Col md={6} key={i}>
            <LineChart label={labels[i]} data={v} />
          </Col>
        );
      })}
    </Row>
  );
}

export default DatasetVisualization;
