import { useEffect, useReducer } from "react";
import { Row, Col } from "react-bootstrap";
import LineChart from "../chart/LineChart";

function DataVisualization(props) {
    const [state, dispatch] = useReducer((state, action) => {
        if (action.type === 'NEW_DATA') {
            return {
                data: JSON.parse(action.data)
            };
        }
    }, { data: null })

    useEffect(() => {
        props.socket.on("return_data", (data) => {
            if (data == 'no-content') {
                props.socket.disconnect();
            }
            else {
                dispatch({ type: 'NEW_DATA', data })
            }
        });

    }, [props.socket]);

    const getDateTime = () => {
        let result;
        Object.keys(state.data).forEach((k) => {
            if (k.toLowerCase().includes("time") || k.toLowerCase().includes("date")) {
                result = k;
            }
        });
        return result;
    };

    return (
        <Row>
            {state.data &&
                Object.keys(state.data).map((k, i) => {
                    if (!k.toLowerCase().includes("time") && !k.toLowerCase().includes("date")) {
                        const d = {
                            timestamp: state.data[getDateTime()].value,
                            value: state.data[k].value,
                            min: state.data[k].min,
                            max: state.data[k].max,
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

export default DataVisualization;
