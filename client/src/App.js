import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import Sensor from "./components/sensor/Sensor";
import Navigation from "./components/navigation/Navigation";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dataset from "./components/dataset/Dataset";

const endPoint = "http://localhost:5000";
let socket;

function App() {
  const [data, setData] = useState({});
  const [eventSrc, setEventSrc] = useState(undefined);
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(false);
    setTimeout(() => {
      setRender(true);
    }, 100);
  }, [data]);

  useEffect(() => {
    console.log("eventSrc :>> ", eventSrc);
  }, [eventSrc]);

  const handleClose = () => {
    eventSrc.close();
    setEventSrc(undefined);
  };

  return (
    <Router>
      <h1 className="text-center">Dynamic Data Visualization</h1>
      <Navigation />
      <Container>
        <Routes>
          <Route path="/dataset" element={<Dataset />}></Route>
          <Route path="/sensor" element={<Sensor />}></Route>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
