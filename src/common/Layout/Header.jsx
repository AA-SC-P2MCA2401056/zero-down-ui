import React from 'react';

const Header = () => {
  return (
    <header className="bg-emerald-950 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="text-xl font-semibold">Greenhouse Dashboard</h1>
      <div className="flex gap-4 items-center">
        <button className="hover:bg-emerald-500 px-3 py-1 rounded">Settings</button>
        <button className="hover:bg-emerald-500 px-3 py-1 rounded">Logout</button>
      </div>
    </header>
  );
};

export default Header;
