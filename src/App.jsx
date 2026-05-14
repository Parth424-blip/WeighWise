import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import "./App.css";

function App() {
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const prevEntries = JSON.parse(localStorage.getItem("entries")) || [];
    setEntries(prevEntries);
  }, []);

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  function handleSubmit(e) {
    e.preventDefault();

    const newEntry = {
      id: Date.now(),
      weight: Number(weight),
      date: date,
    };

    setEntries([...entries, newEntry]);

    setDate("");
    setWeight("");
  }

  function handleDeleteEntry(id) {
    setEntries(entries.filter((entry) => entry.id !== id));
  }

  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="app-container">
      <h1>Weight Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter weight"
          value={weight}
          onChange={(e) => {
            setWeight(e.target.value);
          }}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />

        <button type="submit">Submit</button>
      </form>

      <div className="chart-container">
        <LineChart width={700} height={250} data={sortedEntries}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="weight"
            stroke="#8884d8"
            strokeWidth={3}
          />
        </LineChart>
      </div>

      <div className="entries-list">
        {entries.map((entry) => (
          <div className="entry-card" key={entry.id}>
            <div className="entry-info">
              <div className="entry-date">
                {new Date(entry.date).toLocaleDateString()}
              </div>

              <div className="entry-weight">{entry.weight} kg</div>
            </div>

            <button
              className="delete-btn"
              onClick={() => handleDeleteEntry(entry.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
