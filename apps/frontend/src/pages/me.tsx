import { Navigate } from "react-router-dom";

// Account now lives inside the workspace (open it from the sidebar user menu).
export default function MePage() {
  return <Navigate to="/" replace />;
}
