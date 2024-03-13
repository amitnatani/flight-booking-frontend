import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './pages/navbar';
import { lazy, Suspense } from 'react';

const Flights = lazy(() => import('./pages/flights'));

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="container">Loading...</div>}>
        <Routes>
          <Route path="*" element={<Flights />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </>
  );
}

export default App;
