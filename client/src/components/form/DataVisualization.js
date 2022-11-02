import { useState, useEffect, useReducer } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import LineChart from "../chart/LineChart";

function DataVisualization(props) {
    const [state, dispatch] = useReducer((state, action) => {
        if (action.type === 'NEW_DATA') {
            return {
                data: JSON.parse(action.data),
                init: true
            };
        }
    }, { data: null, init: false })

    const [attributes, setAttributes] = useState([])
    const [timeLabel, setTimeLabel] = useState("")
    const [weight, setWeight] = useState({})
    const [disabled, setDisabled] = useState(true)
    const [start, setStart] = useState(false)

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

    useEffect(() => {
        if (state.data) {
            Object.keys(state.data).forEach((k) => {
                if (k.toLowerCase().includes("time") || k.toLowerCase().includes("date")) {
                    setTimeLabel(k)
                }
                else {
                    setAttributes(prev => [...prev, k])
                }
            });
        }
    }, [state.init])

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

    const onSubmit = (e) => {
        setStart(true)
    };

    const handleChange = (value, att) => {
        setWeight(prev => ({ ...prev, [att]: +value }))
    }

    const getWeight = (total, current) => {
        return total += state.data[current].value * weight[current]
    }

    const getWeightMax = (total, current) => {
        return total += state.data[current].max * weight[current]
    }

    const getWeightMin = (total, current) => {
        return total += state.data[current].min * weight[current]
    }

    useEffect(() => {
        if (attributes.length > 0 && Object.keys(weight).length == attributes.length) {
            setDisabled(false)
        }
    }, [weight]);

    return (
        <>
            {state.data &&
                <Form>
                    <Row className="mb-3">
                        {attributes.map((att, i) => {
                            return (
                                <Form.Group key={i} as={Col} >
                                    <Form.Label>Weight of {att}</Form.Label>
                                    <Form.Control type="text" onChange={e => handleChange(e.target.value, att)} />
                                </Form.Group>
                            );
                        })}
                    </Row>
                    <Button variant="primary" type="button" disabled={disabled} onClick={onSubmit}>
                        Start
                    </Button>
                </Form>

            }
            {start && 
                <Row>
                    {[...attributes, 'Weight'].map((att, i) => {
                        const d = {
                            timestamp: state.data[timeLabel].value,
                            value: att == 'Weight' ? attributes.reduce(getWeight, 0) : state.data[att].value,
                            max: att == 'Weight' ? attributes.reduce(getWeightMax, 0) : state.data[att].max,
                            min: att == 'Weight' ? attributes.reduce(getWeightMin, 0) : state.data[att].min,
                        };

                        return (
                            <Col md={6} key={i}>
                                <LineChart label={att} data={d} />
                            </Col>
                        );
                    })}
                </Row>
            }
        </>
    );
}

export default DataVisualization;
