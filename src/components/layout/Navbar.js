import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Navbar = () => {
  return (
    <nav className="nav-wrapper gray darken-3">
      <div className="container">
        <Link to="/" className="brand-logo">
          OneNightWerewolf
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
