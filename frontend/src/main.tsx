import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import Booking from "./pages/ReserveTime/ReserveTime";
import { store } from "./store/store";
import ProfileForm from "./pages/Profile/Profile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { AppProvider } from "./context/LanguageContext";
import "./i18n";
import AddNewCompany from "./pages/AddNewCompany/AddNewCompany";
import AddedService from "./pages/AddedService/AddedService";
import AddCompanyService from "./pages/AddUserService/AddCompanyService";
import AddAvailableTime from "./pages/AddAvailableTime/AddAvailableTime";
import { Dashboard, HomePage } from "./pages";
import { MainLayout } from "./layouts";
import ReserveTime from "./pages/ReserveTime/ReserveTime";
import './global.css'
import "./styles/index.scss";


const container = document.getElementById("root")!;
const root = createRoot(container);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/reserveTime" element={<Booking />} />
                <Route path="/profile" element={<ProfileForm />} />
                <Route path="/add-new-company" element={<AddNewCompany />} />
                <Route path="/add-new-service" element={<AddedService />} />
                <Route path="/add-company-service" element={<AddCompanyService />} />
                <Route path="/available-time" element={<AddAvailableTime />} />
                <Route path="/dashboard/:url" element={<Dashboard />} />
                <Route path="/:url" element={<ReserveTime />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
