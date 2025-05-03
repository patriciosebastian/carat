import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const [gems, setGems] = useState([]);
  const [newGem, setNewGem] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const filters = ["All", "Development", "Social", "Videos"];
  const addInputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    // const storedItems = window.api.getItems();
    // setItems(storedItems);
    console.log("window api info from useEffect:", window.api);
    try {
      console.log("Fetching gems from store");
      const storedGems = window.api.getItems();
      setGems(storedGems || []);
    } catch (error) {
      setFeedback({ type: "error", message: "Failed to load gems." });
      console.error("Error fetching gems from store:", error);
    }
  }, []);

  useEffect(() => {
    if (editIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editIndex]);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
  };

  const handleAdd = () => {
    const trimmed = newGem.trim();
    if (!trimmed) {
      showFeedback("error", "Gem cannot be empty.");
      return;
    }
    if (gems.some((g) => g.trim().toLowerCase() === trimmed.toLowerCase())) {
      showFeedback("error", "Duplicate gem.");
      return;
    }
    try {
      window.api.addItem(trimmed);
      setGems([...gems, trimmed]);
      setNewGem("");
      showFeedback("success", "Gem added!");
      addInputRef.current && addInputRef.current.focus();
    } catch (error) {
      showFeedback("error", "Failed to add gem.");
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(gems[index]);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      showFeedback("error", "Gem cannot be empty.");
      return;
    }
    if (
      gems.some(
        (g, i) =>
          i !== editIndex && g.trim().toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      showFeedback("error", "Duplicate gem.");
      return;
    }
    try {
      window.api.updateItem(editIndex, trimmed);
      const updatedGems = [...gems];
      updatedGems[editIndex] = trimmed;
      setGems(updatedGems);
      setEditIndex(null);
      setEditValue("");
      showFeedback("success", "Gem updated!");
    } catch (error) {
      showFeedback("error", "Failed to update gem.");
      console.error(error);
    }
  };

  const handleDelete = (index) => {
    try {
      window.api.deleteItem(index);
      const updatedGems = gems.filter((_, i) => i !== index);
      setGems(updatedGems);
      showFeedback("success", "Gem deleted.");
    } catch (error) {
      showFeedback("error", "Failed to delete gem.");
      console.error(error);
    }
  };

  const handleCopy = (value) => {
    try {
      navigator.clipboard.writeText(value);
      showFeedback("success", "Copied!");
    } catch (error) {
      showFeedback("error", "Failed to copy.");
    }
  };

  return (
    <div className="relative flex h-full min-h-[600px] w-full min-w-[400px] max-w-[480px] flex-col items-center rounded-xl bg-gradient-to-br from-[#232946] to-[#16161a] p-4 shadow-2xl">
      {/* Feedback message */}
      {feedback.message && (
        <div
          className={`absolute left-1/2 top-2 z-50 -translate-x-1/2 rounded px-4 py-2 text-sm font-semibold shadow-lg ${feedback.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
        >
          {feedback.message}
        </div>
      )}
      {/* Draggable area */}
      <div
        className="absolute left-0 right-0 top-0 -z-10 h-8 w-full cursor-move bg-transparent"
        style={{ WebkitAppRegion: "drag" }}
      />

      {/* Search bar and filter chips */}
      <div className="mb-4 flex w-full flex-col gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search gems..."
          className="w-full rounded-lg bg-[#1a1a2e] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search gems"
        />
        <div className="mt-1 flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full border border-transparent px-3 py-1 text-xs font-semibold transition ${activeFilter === f ? "bg-blue-600 text-white" : "bg-[#232946] text-gray-300 hover:bg-blue-700/60"}`}
              aria-pressed={activeFilter === f}
              aria-label={`Filter by ${f}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Gems list */}
      <ul className="w-full flex-1 space-y-3 overflow-y-auto pb-4">
        {gems.map((gem, index) => (
          <li
            key={index}
            className="group relative flex items-center rounded-xl border border-[#2e2e3a] bg-[#232946] px-4 py-3 shadow-lg"
          >
            {editIndex === index ? (
              <div className="flex w-full items-center gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 rounded-lg bg-[#1a1a2e] px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Edit gem"
                  ref={editInputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") setEditIndex(null);
                  }}
                />
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-green-600 px-3 py-2 text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
                  aria-label="Save"
                  disabled={
                    !editValue.trim() ||
                    gems.some(
                      (g, i) =>
                        i !== editIndex &&
                        g.trim().toLowerCase() ===
                          editValue.trim().toLowerCase(),
                    )
                  }
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setEditIndex(null)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Cancel"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-1 flex-col">
                  <span className="text-base font-semibold leading-tight text-white">
                    {gem}
                  </span>
                  {/* Optionally, add a subtitle or tags here */}
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(index)}
                    className="rounded-lg p-2 text-blue-400 hover:bg-blue-700/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Edit gem"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleCopy(gem)}
                    className="rounded-lg p-2 text-green-400 hover:bg-green-700/60 focus:outline-none focus:ring-2 focus:ring-green-400"
                    aria-label="Copy gem"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <rect
                        x="3"
                        y="3"
                        width="13"
                        height="13"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-700/60 focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label="Delete gem"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 6h18M9 6v12a2 2 0 002 2h2a2 2 0 002-2V6m-6 0V4a2 2 0 012-2h2a2 2 0 012 2v2"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Add Gem Button */}
      <div className="mt-4 flex w-full justify-center">
        <input
          type="text"
          value={newGem}
          onChange={(e) => setNewGem(e.target.value)}
          placeholder="Add a new gem..."
          className="max-w-[320px] flex-1 rounded-lg bg-[#1a1a2e] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          aria-label="Add new gem"
          ref={addInputRef}
        />
        <button
          onClick={handleAdd}
          className="ml-2 rounded-lg bg-blue-600 px-5 py-2 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50"
          disabled={
            !newGem.trim() ||
            gems.some(
              (g) => g.trim().toLowerCase() === newGem.trim().toLowerCase(),
            )
          }
          aria-label="Add gem"
        >
          +
        </button>
      </div>

      {/* Settings Icon */}
      <button
        className="absolute bottom-4 right-4 rounded-full bg-[#232946] p-2 text-gray-400 shadow-lg transition hover:bg-blue-700/60 hover:text-white"
        aria-label="Settings"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7zm7.94-2.06a1.5 1.5 0 00.33-1.64l-1-1.73a1.5 1.5 0 01.11-1.64l.95-1.64a1.5 1.5 0 00-.33-1.64l-1.5-1.5a1.5 1.5 0 00-1.64-.33l-1.64.95a1.5 1.5 0 01-1.64-.11l-1.73-1a1.5 1.5 0 00-1.64.33l-1.5 1.5a1.5 1.5 0 00-.33 1.64l.95 1.64a1.5 1.5 0 01-.11 1.64l-1 1.73a1.5 1.5 0 00.33 1.64l1.5 1.5a1.5 1.5 0 001.64.33l1.64-.95a1.5 1.5 0 011.64.11l1.73 1a1.5 1.5 0 001.64-.33l1.5-1.5z"
          />
        </svg>
      </button>
    </div>
  );
}
