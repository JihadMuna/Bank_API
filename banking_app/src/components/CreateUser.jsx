import React, { useState } from "react";
import axios from "axios";

function CreateUser() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    cash: 0,
    credit: 0,
  });

  // Implement your create user logic here

  return (
    <div>
      <h2>Create User</h2>
      {/* Render your form with input fields and create user logic */}
    </div>
  );
}

export default CreateUser;
