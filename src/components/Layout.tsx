import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Anchor, LayoutDashboard, FileText, List, LogOut } from 'lucide-react';
import { useBilling } from '../context/BillingContext';

const Layout: React.FC = () => {
  const { logout } = useBilling();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Anchor size={28} color="var(--accent)" />
          <span>Sagar Fishers</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/new-bill" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <FileText size={20} />
            New Bill
          </NavLink>
          <NavLink to="/dashboard/records" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <List size={20} />
            Records
          </NavLink>
        </nav>
        <div style={{ padding: '1.5rem' }}>
          <button onClick={handleLogout} className="btn" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <h2>Sagar Fishers – Prawns Billing System</h2>
          <div className="flex-row">
            <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Admin User</span>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
