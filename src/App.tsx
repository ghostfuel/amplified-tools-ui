import { FunctionComponent, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import logo from './logo.svg';
import "./App.css"
import { ReactFlowProvider } from "react-flow-renderer";

// Lazy imports for splitting code
const Appbar = lazy(() => import("./components/Appbar/Appbar"));
const VerificationForm = lazy(() => import("./components/VerificationForm/VerificationForm"));
const TopPlayed = lazy(() => import("./views/TopPlayed/TopPlayed"));
const Playlists = lazy(() => import("./views/Playlists/Playlists"));
const Schedules = lazy(() => import("./views/Schedules/Schedules"));
const CreateSchedule = lazy(() => import("./views/CreateSchedule/CreateSchedule"));
const CreateWorkflow = lazy(() => import("./views/CreateWorkflow/CreateWorkflow"));
const SignIn = lazy(() => import("./views/SignIn/SignIn"));
const Dashboard = lazy(() => import("./views/Dashboard/Dashboard"));
const Profile = lazy(() => import("./views/Profile/Profile"));
const Tools = lazy(() => import("./views/Tools/Tools"));

const App: FunctionComponent = () => {

  return (
    <BrowserRouter>
      <Suspense fallback={"Loading..."}>
        <Appbar logo={logo} title="Amplified" />
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route path="/" element={<Tools />}></Route>
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
            <Route path="/top-played" element={<ProtectedRoute><TopPlayed /></ProtectedRoute>}></Route>
            <Route path="/sort-playlist" element={<ProtectedRoute><Playlists /></ProtectedRoute>}></Route>
            <Route path="/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>}></Route>
            <Route path="/schedules/create" element={<ProtectedRoute><CreateSchedule /></ProtectedRoute>}></Route>
            <Route path="/schedules/:scheduleId" element={<ProtectedRoute><CreateSchedule edit={true} /></ProtectedRoute>}></Route>
            <Route path="/workflow/create" element={<ProtectedRoute><ReactFlowProvider><CreateWorkflow /></ReactFlowProvider></ProtectedRoute>}></Route>
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/verify" element={<VerificationForm />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
