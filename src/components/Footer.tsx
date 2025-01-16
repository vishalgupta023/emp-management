// src/components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container-wrapper py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Employee Manager</h3>
            <p className="text-gray-300 text-sm">
              Streamline your employee management with our comprehensive solution.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a href="/dashboard" className="hover:text-white">Dashboard</a>
              </li>
              <li>
                <a href="/add-employee" className="hover:text-white">Add Employee</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>Email: support@empmanager.com</li>
              <li>Phone: (555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Employee Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;