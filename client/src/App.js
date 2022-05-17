import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Stats } from "./components/stats/Stats";
import Main from "./components/main/Main";
// import Tab from '@mui/material/Tab';
// import { useState } from "react";
import useAuth from "./useAuth";

// function LinkTab(props) {
//   return (
//     <Tab
//       component="a"
//       onClick={(event) => {
//         event.preventDefault();
//       }}
//       {...props}
//     />
//   );
// }
let code = new URLSearchParams(window.location.search).get("code");

function SetToken(code) {
  const accessToken = useAuth(code);
  console.log("trying to authenticate user");
  window.localStorage.setItem("accessToken", accessToken);
  return <></>;
}
function App() {
  // const [value, setValue] = useState(0);
  document.title = "Spotify stats";

  if (code == null) return <Login />;

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  if (window.localStorage.getItem("accessToken") == null) {
    SetToken(code);
  }
  if (window.localStorage.getItem("accessToken") != null)
    return (

      <Router>
        <div>
          <div style={{ margin: "auto " }}>
            {/* <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
              <LinkTab label="Home" href="/" ><Link to="/" /></LinkTab>
              <LinkTab label="Stats" href="/stats" ><Link to="/stats" /></LinkTab>
              <LinkTab label="Profile" href="/profile" ><Link to="/me" /></LinkTab>
            </Tabs>
          </Box> */}
            <ul>
              <li><Link to="/" >Home</Link></li>
              <li><Link to="/stats" >Stats</Link></li>
              <li><Link to="/me" >Profile</Link></li>
            </ul>



          </div>
          <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="/stats" element={<Stats />}></Route>
            <Route path="/me" element={<h2>Me</h2>}></Route>
          </Routes>
        </div>
      </Router>
    );
}

export default App;
