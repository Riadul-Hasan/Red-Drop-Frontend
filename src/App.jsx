import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/bloodrequest/")
      .then(response => {
        setDonors(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Donors List</h1>
      <ul>
        {donors.map(donor => (
          <li key={donor.id}>
            {donor.name} - {donor.blood_group}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
