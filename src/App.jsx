import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
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
    if (weight <= 0 || date === "") {
      alert("Please enter a valid weight and date");
      return;
    }
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

  const latestWeight = sortedEntries[sortedEntries.length - 1]?.weight || "N/A";
  const allWeight = sortedEntries.map((entry) => entry.weight) || [];

  const lowestWeight = allWeight.length > 0 ? Math.min(...allWeight) : "N/A";
  const highestWeight = allWeight.length > 0 ? Math.max(...allWeight) : "N/A";
  const stats = [
    {
      label: "Latest Weight",
      value: latestWeight,
    },
    {
      label: "Lowest Weight",
      value: lowestWeight,
    },
    {
      label: "Highest Weight",
      value: highestWeight,
    },
    {
      label: "Total Entries",
      value: entries.length,
    },
  ];

  return (
    <div className="app-container">
      <div className="header">
        <h1>WeighWise</h1>
        <p className="subtitle">Track your weight journey with simplicity</p>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          step="0.1"
          placeholder="Enter weight (kg)"
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

        <button type="submit">Add Entry</button>
      </form>

      <div className="stats-section">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">
              {stat.value} {stat.value !== "N/A" && stat.label !== "Total Entries" && "kg"}
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>Your weight progress chart will appear here once you add an entry.</p>
        </div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sortedEntries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)' }}
                tickMargin={10}
              />
              <YAxis 
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)' }}
                tickMargin={10}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--chart-line)"
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--chart-line)', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="entries-list">
        {sortedEntries.slice().reverse().map((entry) => (
          <div className="entry-card" key={entry.id}>
            <div className="entry-info">
              <div className="entry-weight">{entry.weight} kg</div>
              <div className="entry-date">
                {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
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
