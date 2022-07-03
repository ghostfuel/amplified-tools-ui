import { FunctionComponent } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CognitoLogin from "./components/Auth/CognitoLogin";
import Appbar from "./components/Appbar/Appbar";

import "./App.css"
import logo from './logo.svg';
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./views/Dashboard/Dashboard";
import Profile from "./views/Profile/Profile";
import Tools from "./views/Tools/Tools";
import TopPlayed from "./views/TopPlayed/TopPlayed";
import Playlists from "./views/Playlists/Playlists";
import Scheduler from "./views/Scheduler/Scheduler";
// import { Col, Container } from "react-bootstrap";


const App: FunctionComponent = () => {

  return (
    <BrowserRouter>
      <Appbar logo={logo} title="Amplified" />
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        >
          <Route path="/" element={<Tools />}></Route>
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
          <Route path="/top-played" element={<ProtectedRoute><TopPlayed /></ProtectedRoute>}></Route>
          <Route path="/sort-playlist" element={<ProtectedRoute><Playlists /></ProtectedRoute>}></Route>
          <Route path="/scheduler" element={<ProtectedRoute><Scheduler /></ProtectedRoute>}></Route>
        </Route>
        <Route path="/login" element={<CognitoLogin />} />
      </Routes>
      {/* <div className="position-absolute bottom-0 w-100 mb-4">
        <Container className="justify-content-center text-center border-top border-secondary">
          <Col>
            <footer className="mt-4 text-muted">Made with 🍊<br /> Icons supplied by Freepik, Pause08, Anggara</footer>
          </Col>
        </Container>
      </div> */}
    </BrowserRouter>
  );
};


export default App;
