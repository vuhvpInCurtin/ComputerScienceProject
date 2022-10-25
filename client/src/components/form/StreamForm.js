import { useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import io from 'socket.io-client';
import DataVisualization from "./DataVisualization";

let socket;

function StreamForm() {
    const endPoint = `${process.env.REACT_APP_HOSTNAME}`;

    socket = io(endPoint, { transports: ["websocket", "polling", "flashsocket"] });

    const onSubmit = (e) => {
        e.preventDefault();
        const data_id = e.target.id.value
        const url = `${process.env.REACT_APP_HOSTNAME}/check-id`;
        fetch(url, {
            method: "POST", headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ data_id })
        }).then((res) => res.json()).then((res) => {
            if (res) {
                const name = "react-client"
                const room = e.target.id.value
                socket.emit('join', { name, room });
            }
            else {
                console.log('not');
            }
        });
    };

    useEffect(() => {
        socket.on('joined', () => {
            socket.emit('request_stream_from_server');
        })

        return () => {
            socket.disconnect()
        }
    }, []);

    const handleClose = () => {
        socket.disconnect()
    };

    return (
        <>
            <Form onSubmit={onSubmit} className='w-25 mb-5'>
                <Form.Group className="mb-3">
                    <Form.Label>ID</Form.Label>
                    <Form.Control type="text" name="id" />
                </Form.Group>
                <Button variant="primary" type="submit" className="me-2">
                    Connect
                </Button>
                {/* <Button variant="primary" type="button" onClick={handleClose}>
                    Close
                </Button> */}
            </Form>
            <DataVisualization socket={socket} />
        </>
    );
}

export default StreamForm;
