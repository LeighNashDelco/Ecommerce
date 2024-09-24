import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
    return (
        <nav>
            <Link to="/">Home</Link> <br />
            <Link to="/about-us">About Us</Link> <br />
            <Link to="/contact-us">Contact Us</Link> <br />
        </nav>
    );
}
