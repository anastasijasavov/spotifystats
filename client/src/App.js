import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Stats } from "./components/stats/Stats";
import Main from "./components/main/Main";
import Header from "./components/header/Header";
// import Tab from '@mui/material/Tab';
import { useState, useMemo } from "react";
import SpotifyWebApi from "spotify-web-api-node";
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

function App() {
  const spotifyApi = useMemo(() => new SpotifyWebApi({ clientId: "0cc65edbfc7649b087b605c605e9aade" }), []);


  function SetToken(code) {
    const accessToken = useAuth(code);
    spotifyApi.setAccessToken(accessToken);
    console.log("trying to authenticate user");
    window.localStorage.setItem("accessToken", accessToken);
    return <></>;
  }
  // const [value, setValue] = useState(0);
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  if (code == null)
    return <Login />;

  const token = window.localStorage.getItem("accessToken")
  //console.log("local storage is null but code is not");
  //window.localStorage.setItem("accessToken", accessToken);
  if (token == null || token === "undefined") {
    SetToken(code);
  }

  if (token != null && token !== "undefined") {

    return (
      <Router>
        <div style={{ /*backgroundColor: "#121212" */ }}>
          <Header />
          <Routes>
            <Route path="/" element={<Main spotifyApi={spotifyApi} />}></Route>
            <Route path="/stats" element={<Stats spotifyApi={spotifyApi} />}></Route>
            <Route path="/me" element={<h2>Me</h2>}></Route>

          </Routes>
        </div>
      </Router>
    );
  }



}

export default App;
