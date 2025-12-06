import Header from "./Header";
import Sidebar from "./Sidebar";
import React from 'react'
import PropTypes from 'prop-types'

const Layout = (props) => {
  const { children } = props;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;