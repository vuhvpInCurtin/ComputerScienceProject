import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import LineChart from "../chart/LineChart";

function SensorVisualization({ eventSrc }) {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (eventSrc) {
      eventSrc.onmessage = (e) => {
        setData(JSON.parse(e.data));
      };
    }
    return () => {
      eventSrc.close();
    };
  }, [eventSrc]);

  const getColumnName = (name) => {
    let result;
    Object.keys(data).forEach((k) => {
      if (k.toLowerCase().includes(name)) {
        result = k;
      }
    });
    return result;
  };

  return (
    <Row>
      {data &&
        Object.keys(data).map((k, i) => {
          if (!k.toLowerCase().includes("time")) {
            const d = {
              timestamp: data[getColumnName("time")],
              value: data[k],
            };
            return (
              <Col md={6} key={i}>
                <LineChart label={k} data={d} />
              </Col>
            );
          }
        })}
    </Row>
  );
}

export default SensorVisualization;
