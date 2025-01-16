// src/App.tsx
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {store } from './redux/store';
import PrivateRoute from './layouts/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/DashBoard';
import AddEmployee from './pages/AddEmployee';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen border-2 border-red-900 flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
            <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-employee" element={<AddEmployee />} />
                <Route path="/edit-employee" element={<AddEmployee />} />
              </Route>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;