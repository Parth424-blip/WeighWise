import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import "./App.css";

function App() {
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("entries");
    return saved ? JSON.parse(saved) : [];
  });
  const [goalWeight, setGoalWeight] = useState(() => {
    const saved = localStorage.getItem("goalWeight");
    return saved ? JSON.parse(saved) : 0;
  });
  const [goalDate, setGoalDate] = useState(() => {
    const saved = localStorage.getItem("goalDate");
    return saved ? JSON.parse(saved) : "";
  });
  const [inputGoalWeight, setInputGoalWeight] = useState(() => {
    const saved = localStorage.getItem("goalWeight");
    return saved ? JSON.parse(saved) : "";
  });
  const [inputGoalDate, setInputGoalDate] = useState(() => {
    const saved = localStorage.getItem("goalDate");
    return saved ? JSON.parse(saved) : "";
  });
  const [height, setHeight] = useState(() => {
    const saved = localStorage.getItem("height");
    return saved ? JSON.parse(saved) : "";
  });
  const [inputHeight, setInputHeight] = useState(() => {
    const saved = localStorage.getItem("height");
    return saved ? JSON.parse(saved) : "";
  });

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);
  useEffect(() => {
    localStorage.setItem("goalWeight", JSON.stringify(goalWeight));
    localStorage.setItem("goalDate", JSON.stringify(goalDate));
  }, [goalWeight, goalDate]);
  
  useEffect(() => {
    localStorage.setItem("height", JSON.stringify(height));
  }, [height]);

  function handleSubmit(e) {
    e.preventDefault();
    if (weight <= 0 || date === "") {
      toast.error("Please enter a valid weight and date");
      return;
    }

    if (editingId) {
      setEntries(
        entries.map((entry) =>
          entry.id === editingId
            ? { ...entry, weight: Number(weight), date: date }
            : entry
        )
      );
      setEditingId(null);
      toast.success("Entry updated successfully!");
    } else {
      const newEntry = {
        id: Date.now(),
        weight: Number(weight),
        date: date,
      };
      setEntries([...entries, newEntry]);
      toast.success("Entry added successfully!");
    }

    setDate("");
    setWeight("");
  }

  function handleEditEntry(entry) {
    setWeight(entry.weight);
    setDate(entry.date);
    setEditingId(entry.id);
  }

  function confirmDelete() {
    if (entryToDelete) {
      setEntries(entries.filter((entry) => entry.id !== entryToDelete));
      setEntryToDelete(null);
      toast.success("Entry deleted!");
    }
  }
  function handleGoalSubmit(e) {
    e.preventDefault();
    if (inputGoalWeight <= 0 || inputGoalDate === "") {
      toast.error("Please enter a valid goal weight and date");
      return;
    }
    setGoalWeight(Number(inputGoalWeight));
    setGoalDate(inputGoalDate);
    toast.success("Target goal set!");
  }

  function handleRemoveGoal() {
    setGoalWeight(0);
    setGoalDate("");
    setInputGoalWeight("");
    setInputGoalDate("");
  }

  function handleHeightSubmit(e) {
    e.preventDefault();
    if (inputHeight <= 0) {
      toast.error("Please enter a valid height");
      return;
    }
    setHeight(Number(inputHeight));
    toast.success("Height saved!");
  }

  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  const latestWeight = sortedEntries[sortedEntries.length - 1]?.weight || "N/A";
  const allWeight = sortedEntries.map((entry) => entry.weight) || [];

  const lowestWeight = allWeight.length > 0 ? Math.min(...allWeight) : "N/A";
  const highestWeight = allWeight.length > 0 ? Math.max(...allWeight) : "N/A";
  
  let bmi = "N/A";
  if (latestWeight !== "N/A" && height > 0) {
    const heightInMeters = height / 100;
    bmi = (latestWeight / (heightInMeters * heightInMeters)).toFixed(1);
  }

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
    {
      label: "Current BMI",
      value: bmi,
    },
  ];

  return (
    <div className="app-container">
      <Toaster position="top-center" />
      
      {entryToDelete && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h3>Delete Entry?</h3>
            <p>Are you sure you want to delete this weight entry? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setEntryToDelete(null)}>Cancel</button>
              <button className="delete-btn" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="header">
        <h1>WeighWise</h1>
        <p className="subtitle">Track your weight journey with simplicity</p>
        {goalWeight > 0 && (
          <div className="goal-banner">
            🎯 Target: <strong>{goalWeight} kg</strong>
            {goalDate && (
              <span>
                {" "}
                by{" "}
                <strong>
                  {new Date(goalDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="forms-container">
        <div className="form-wrapper">
          <div className="form-title">Log Daily Weight</div>
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

            <button type="submit">
              {editingId ? "Update Entry" : "Add Entry"}
            </button>
            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setWeight("");
                  setDate("");
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="form-wrapper">
          <div className="form-title">Target Goal</div>
          <form onSubmit={handleGoalSubmit} className="goal-form">
            <input
              type="number"
              step="0.1"
              value={inputGoalWeight}
              onChange={(e) => setInputGoalWeight(e.target.value)}
              placeholder="Enter Goal Weight (kg)"
            />
            <input
              type="date"
              value={inputGoalDate}
              onChange={(e) => setInputGoalDate(e.target.value)}
              placeholder="Enter Goal Date"
            />
            <button type="submit" className="goal-btn">
              Set Goal
            </button>
            {goalWeight > 0 && (
              <button
                type="button"
                className="remove-goal-btn"
                onClick={handleRemoveGoal}
              >
                Remove
              </button>
            )}
          </form>
        </div>

        <div className="form-wrapper">
          <div className="form-title">Your Height</div>
          <form onSubmit={handleHeightSubmit} className="goal-form">
            <input
              type="number"
              value={inputHeight}
              onChange={(e) => setInputHeight(e.target.value)}
              placeholder="Height (cm)"
            />
            <button type="submit" className="goal-btn">
              Save
            </button>
          </form>
        </div>
      </div>

      <div className="stats-section">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">
              {stat.value}{" "}
              {stat.value !== "N/A" && stat.label !== "Total Entries" && stat.label !== "Current BMI" && "kg"}
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>
            Your weight progress chart will appear here once you add an entry.
          </p>
        </div>
      ) : (
        <div
          className="chart-container"
          style={{ width: "100%", minWidth: 0, overflow: "hidden" }}
        >
          <ResponsiveContainer width="99%" height={300}>
            <LineChart
              data={sortedEntries}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border-color)"
              />
              {goalWeight > 0 && (
                <ReferenceLine
                  y={goalWeight}
                  stroke="var(--text-secondary)"
                  strokeDasharray="3 3"
                  label={{
                    position: "top",
                    value: "Goal",
                    fill: "var(--text-secondary)",
                    fontSize: 12,
                  }}
                />
              )}
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }
                stroke="var(--text-secondary)"
                tick={{ fill: "var(--text-secondary)" }}
                tickMargin={10}
              />
              <YAxis
                stroke="var(--text-secondary)"
                tick={{ fill: "var(--text-secondary)" }}
                tickMargin={10}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "var(--shadow-md)",
                  backgroundColor: "var(--surface-color)",
                  color: "var(--text-primary)",
                }}
                itemStyle={{ color: "var(--text-primary)" }}
                formatter={(value) => {
                  return `${value}kg`;
                }}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--chart-line)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--chart-line)", strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="entries-list">
        {sortedEntries
          .slice()
          .reverse()
          .map((entry) => (
            <div className="entry-card" key={entry.id}>
              <div className="entry-info">
                <div className="entry-weight">{entry.weight} kg</div>
                <div className="entry-date">
                  {new Date(entry.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="entry-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditEntry(entry)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => setEntryToDelete(entry.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
