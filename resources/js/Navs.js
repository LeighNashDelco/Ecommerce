import React from "react";
import { Link } from "react-router-dom";

export default function Navs() {
  return (
    <nav>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        <li>
          <Link to="/page1">1</Link> {/* Navigate to Page 1 */}
        </li>
        <li>
          <Link to="/page2">2</Link> {/* Navigate to Page 2 */}
        </li>
        <li>
          <Link to="/page3">3</Link> {/* Navigate to Page 3 */}
        </li>
        <li>
          <Link to="/page4">4</Link> {/* Navigate to Page 4 */}
        </li>
        <li>
          <Link to="/page5">5</Link> {/* Navigate to Page 5 */}
        </li>
        <li>
          <Link to="/page6">6</Link> {/* Navigate to Page 6 */}
        </li>
        <li>
          <Link to="/page7">7</Link> {/* Navigate to Page 7 */}
        </li>
        <li>
          <Link to="/page8">8</Link> {/* Navigate to Page 8 */}
        </li>
      </ul>
    </nav>
  );
}
