import "./App.css";
import ContextState from "./Context/ContextState";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Blog from "./Pages/Blog/Blog";
import AddBlog from "./Pages/Blog/AddItem";
import EditItem from "./Pages/Blog/EditItem";
import Sidenav from "./Component/Sidenav/Sidenav";
import Topbar from "./Component/Sidenav/Topbar";


function App() {
  return (
    <ContextState>
      <Router>
        <div className="App">
        <Sidenav />
          <div className="content">
            <Topbar />
            <Routes>
              <Route path="/blog" exact element={<Blog />} />
              <Route path="/blog/add" exact element={<AddBlog />} />
              <Route path="/blog/edit/:id" exact element={<EditItem />} />
              <Route path="/login" exact element={<Login />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ContextState>
  );
}

export default App;
