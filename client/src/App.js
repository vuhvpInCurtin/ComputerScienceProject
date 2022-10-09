import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Container } from "react-bootstrap";
import Sensor from "./components/sensor/Sensor";
import Navigation from "./components/navigation/Navigation";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dataset from "./components/dataset/Dataset";
import CreateForm from "./components/form/CreateForm";
import StreamForm from "./components/form/StreamForm";

function App() {
  return (
    <Router>
      <h1 className="text-center">Dynamic Data Visualization</h1>
      <Navigation />
      <Container>
        <Routes>
          <Route path="/dataset" element={<Dataset />}></Route>
          <Route path="/sensor" element={<Sensor />}></Route>
          <Route path="/form" element={<CreateForm />}></Route>
          <Route path="/get-data" element={<StreamForm />}></Route>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
