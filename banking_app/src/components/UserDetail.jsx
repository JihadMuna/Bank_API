// UserDetail.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function UserDetail({ match }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4545/users/${match.params.id}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, [match.params.id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p>
        Name: {user.firstName} {user.lastName}
      </p>
      <p>Cash: ${user.cash}</p>
      <p>Credit: ${user.credit}</p>
    </div>
  );
}

export default UserDetail;
