// src/components/Header.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../utils/authHelpers';
import { logout } from '../redux/slices/authSlice';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
     {isAuthenticated ? (<div className="container-wrapper">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Employee Manager
            </Link>
          </div>

          {isAuthenticated && (
            <nav className="hidden md:flex space-x-4">
              <Link
                to="/dashboard"
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link
                to="/add-employee"
                className={`nav-link ${location.pathname === '/add-employee' ? 'active' : ''}`}
              >
                Add Employee
              </Link>
              <button
                onClick={handleLogout}
                className="nav-link text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </nav>
          )}

          {/* Mobile menu button */}
          {isAuthenticated && (
            <div className="md:hidden">
              <button className="mobile-menu-button p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                <span className="sr-only">Open menu</span>
                {/* Hamburger icon */}
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>) :null}
    </header>
  );
};

export default Header;