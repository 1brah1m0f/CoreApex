import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { CitizenDashboard } from "./components/CitizenDashboard";
import { InspectorDashboard } from "./components/InspectorDashboard";
import { ExecutiveDashboard } from "./components/ExecutiveDashboard";

type Role = "citizen" | "inspector" | "executive";
type View = "landing" | Role;

export default function App() {
  const [view, setView] = useState<View>("landing");

  return (
    <div className="size-full">
      {view === "landing" && <LandingPage onLogin={(role) => setView(role)} />}
      {view === "citizen" && <CitizenDashboard onLogout={() => setView("landing")} />}
      {view === "inspector" && <InspectorDashboard onLogout={() => setView("landing")} />}
      {view === "executive" && <ExecutiveDashboard onLogout={() => setView("landing")} />}
    </div>
  );
}
