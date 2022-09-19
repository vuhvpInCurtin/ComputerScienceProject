import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import LineChart from "../chart/LineChart";

function SensorVisualization(props) {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    if (props.eventSrc) {
      props.eventSrc.addEventListener("dataStream", (e) => {
        console.log(JSON.parse(e.data), "data");
        setData(JSON.parse(e.data));
      });
      props.eventSrc.addEventListener("closedConnection", (e) => {
        console.log(JSON.parse(e.data));
      });
    }
    return () => {
      props.eventSrc.close();
    };
  }, [props.eventSrc]);

  return (
    <Row>
      {data &&
        Object.keys(data).map((k, i) => {
          if (!k.includes("time")) {
            const d = {
              time: data["time"],
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
