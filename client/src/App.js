import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import { Stats } from "./components/stats/Stats";
import Main from "./components/main/Main";

let code = new URLSearchParams(window.location.search).get("code");
function App() {
  if (code == null) return <Login />;

  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/stats">
              <h3>Stats</h3>
              {/* <Stats code={code} /> */}
            </Link>
          </li>
          <li>
            <Link to="/me">
              <h2>Me</h2>
            </Link>
          </li>
        </ul>

        <Routes>
          <Route path="/" element={<Main code={code} />}></Route>
          <Route path="/stats" element={<h2>Stats</h2>}></Route>
          <Route path="/me" element={<h2>Me</h2>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
