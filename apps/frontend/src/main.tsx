import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Providers } from "@/app/providers";
import { AppRouter } from "@/app/router";
import "@lovable/ui/styles.css";

document.documentElement.classList.add("dark");
document.documentElement.style.colorScheme = "dark";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Providers>
  </React.StrictMode>,
);
