import { FunctionComponent } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Appbar from "./components/Appbar/Appbar";
import ProtectedRoute from "./components/ProtectedRoute";
import VerificationForm from "./components/VerificationForm/VerificationForm";

import Dashboard from "./views/Dashboard/Dashboard";
import Profile from "./views/Profile/Profile";
import Tools from "./views/Tools/Tools";
import TopPlayed from "./views/TopPlayed/TopPlayed";
import Playlists from "./views/Playlists/Playlists";
import Scheduler from "./views/Scheduler/Scheduler";
import Schedules from "./views/Schedules/Schedules";
import SignIn from "./views/SignIn/SignIn";

import logo from './logo.svg';
import "./App.css"

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
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/verify" element={<VerificationForm />} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;
