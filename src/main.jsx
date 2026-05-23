import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {UserProvider} from "./UserContext.js";
import {BrowserRouter} from "react-router-dom";

import axios from "axios";
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <UserProvider>
        <BrowserRouter>
              <App />
          </BrowserRouter>
      </UserProvider>
  </StrictMode>,
)
