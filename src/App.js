import React, { useState } from "react";
import {
  Routes,
  BrowserRouter as Router,
  Route,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Main from "./pages/Main.jsx";
import "./static/css/App.css";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://lionreport.pixeller.net/log",
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: 1.0,
});

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

function App() {
  const [isListOpen, setIsListOpen] = useState(false);
  return (
    <Router>
      <SentryRoutes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={ <Main isListOpen={isListOpen} setIsListOpen={setIsListOpen} /> }/>
        <Route path="*" element={<NotFound />} />
      </SentryRoutes>
    </Router>
  );
}

export default App;
