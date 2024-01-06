import React, { useState, useEffect } from "react";
import axios from "axios";

function UpdateUser({ match }) {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    cash: 0,
    credit: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4545/users/${match.params.id}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, [match.params.id]);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4545/users/${match.params.id}`,
        userData
      );
      console.log("User updated successfully:", response.data);
      // You might want to redirect to the user detail page or display a success message.
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error, display a message, or redirect as needed.
    }
  };

  return (
    <div>
      <h2>Update User</h2>
      <form>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Cash:</label>
          <input
            type="number"
            name="cash"
            value={userData.cash}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Credit:</label>
          <input
            type="number"
            name="credit"
            value={userData.credit}
            onChange={handleInputChange}
          />
        </div>
        <button type="button" onClick={handleUpdateUser}>
          Update User
        </button>
      </form>
    </div>
  );
}

export default UpdateUser;
