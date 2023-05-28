import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/index.css";
import { App } from "./App";
import { TRPCProvider } from "./context/trpc";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TRPCProvider>
      <App />
    </TRPCProvider>
  </React.StrictMode>,
);
