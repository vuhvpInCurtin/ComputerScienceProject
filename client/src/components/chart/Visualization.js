import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import LineChart from "./LineChart";

function Visualization({ eventSrc }) {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (eventSrc) {
      eventSrc.onmessage = (e) => {
        if (e.data == "no-content") {
          eventSrc.close();
        } else {
          console.log('e.data :>> ', JSON.parse(e.data));
          setData(JSON.parse(e.data));
        }
      };
    }
    return () => {
      eventSrc.close();
    };
  }, [eventSrc]);

  const getDateTime = () => {
    let result;
    Object.keys(data).forEach((k) => {
      if (k.toLowerCase().includes("time") || k.toLowerCase().includes("date")) {
        result = k;
      }
    });
    return result;
  };

  return (
    <Row>
      {data &&
        Object.keys(data).map((k, i) => {
          if (!k.toLowerCase().includes("time") && !k.toLowerCase().includes("date")) {
            const d = {
              timestamp: data[getDateTime()].value,
              value: data[k].value,
              min: data[k].min,
              max: data[k].max,
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

export default Visualization;
