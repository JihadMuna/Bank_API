import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import CreateUser from "./components/CreateUser";
import UpdateUser from "./components/UpdateUser";
import TransferMoney from "./components/TransferMoney";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/update/:id" element={<UpdateUser />} />
          <Route path="/transfer" element={<TransferMoney />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
