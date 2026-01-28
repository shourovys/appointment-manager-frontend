import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <header>
        <h1>Dashboard Header</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>Dashboard Footer</p>
      </footer>
    </div>
  );
};

export default DashboardLayout;
