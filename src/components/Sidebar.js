/* eslint-disable arrow-body-style */
import React from 'react';
import DashboardToggle from './dashboard/DashboardToggle';

const Sidebar = () => {
  return (
    <div className="h-100 pt-2">
      <div>
        <DashboardToggle />
      </div>
      Bottom
    </div>
  );
};

export default Sidebar;
