import "./App.css";
import Logo from "./assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faHouse, faTable } from "@fortawesome/free-solid-svg-icons";
import Tables from "./pages/tables";
import SingleTable from "./pages/single-table";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <nav className="navigation">
          <div className="logo">
            <img src={Logo} />
          </div>
          <ul className="nav-list">
            <li key="nav-home">
              <Link to="/">
                <span className="icon">
                  <FontAwesomeIcon icon={faHouse} size="lg" />
                </span>
                <span className="text">Home</span>
              </Link>
            </li>
            <li key="nav-tables">
              <Link to="/tables">
                <span className="icon">
                  <FontAwesomeIcon icon={faTable} size="lg" />
                </span>
                <span className="text">Tables</span>
              </Link>
            </li>
            <li key="nav-dictionary">
              <Link to="/dictionary">
                <span className="icon">
                  <FontAwesomeIcon icon={faBook} size="lg" />
                </span>
                <span className="text">Data Dictionary</span>
              </Link>
            </li>
          </ul>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/tables" element={<Tables />} />
            <Route path="/table/:uuid" element={<SingleTable />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
