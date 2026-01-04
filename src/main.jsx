import React from 'react';
import ReactDOM from 'react-dom/client';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { Toaster } from 'react-hot-toast';
import { LoadingProvider } from './common/LoadingContext';
import Loading from './common/Loading';
import "react-datepicker/dist/react-datepicker.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <LoadingProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Loading />
      <App />
    </LoadingProvider>
  //</React.StrictMode>
);
