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
import Schedules from "./views/Schedules/Schedules";


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
          <Route path="/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>}></Route>
          <Route path="/schedules/create" element={<ProtectedRoute><Scheduler /></ProtectedRoute>}></Route>
        </Route>
        <Route path="/login" element={<CognitoLogin />} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;
