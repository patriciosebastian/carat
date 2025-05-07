import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const [gems, setGems] = useState([]);
  const [newGem, setNewGem] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [favoritesFeatureEnabled, setFavoritesFeatureEnabled] = useState(false);
  const [isPaidVersion, setIsPaidVersion] = useState(false);
  const [showAddGemInput, setShowAddGemInput] = useState(false);
  const showAddGemInputRef = useRef(showAddGemInput);
  const addInputRef = useRef(null);
  const editInputRef = useRef(null);
  const settingsModalRef = useRef(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    showAddGemInputRef.current = showAddGemInput;
  }, [showAddGemInput]);

  useEffect(() => {
    if (showAddGemInput && addInputRef.current) {
      addInputRef.current.focus();
    }
  }, [showAddGemInput]);

  useEffect(() => {
    setIsPaidVersion(window.api.isPaidVersion);
    if (window.api.isPaidVersion) {
      setFavoritesFeatureEnabled(window.api.getFavoritesFeatureEnabled?.() ?? false);
      setFavorites(window.api.getFavorites?.() ?? []);
    }
    try {
      const storedGems = window.api.getItems();
      setGems(storedGems || []);
    } catch (error) {
      setFeedback({ type: "error", message: "Failed to load gems." });
      console.error("Error fetching gems from store:", error);
    }
    if (window.api.onFocusAddGem) {
      const handler = () => {
        if (showAddGemInputRef.current) {
          setShowAddGemInput(false);
          setNewGem("");
        } else {
          setShowAddGemInput(true);
        }
      };
      window.api.onFocusAddGem(handler);
    }
  }, []);

  useEffect(() => {
    if (settingsOpen && settingsModalRef.current) {
      settingsModalRef.current.focus();
    }
  }, [settingsOpen]);

  const handleSettingsKeyDown = (e) => {
    if (e.key === "Escape") setSettingsOpen(false);
  };

  const handleFavoritesFeatureToggle = () => {
    const newValue = !favoritesFeatureEnabled;
    setFavoritesFeatureEnabled(newValue);
    window.api.setFavoritesFeatureEnabled?.(newValue);
  };

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
      setShowAddGemInput(false);
    } catch (error) {
      showFeedback("error", "Failed to add gem.");
      console.error(error);
    }
  };

  const handleShowAddGemInput = () => {
    if (showAddGemInputRef.current) {
      setShowAddGemInput(false);
      setNewGem("");
    } else {
      setShowAddGemInput(true);
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

  const handleToggleFavorite = (index) => {
    let updatedFavorites;
    if (favorites.includes(index)) {
      updatedFavorites = favorites.filter((i) => i !== index);
    } else {
      updatedFavorites = [...favorites, index];
    }
    setFavorites(updatedFavorites);
    window.api.setFavorites?.(updatedFavorites);
  };

  return (
    <div className="relative flex h-full min-h-[600px] w-full min-w-[400px] flex-col items-center rounded-xl bg-gray-700/95 p-4 shadow-2xl">
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
        className="absolute left-0 right-0 top-0 -z-10 h-6 w-full cursor-move bg-transparent"
        style={{ WebkitAppRegion: "drag" }}
      />

      {/* Start: Testing Add Gem Button and Settings Button Here */}

      {/* Controls */}
      <div className="mb-4 mr-24 flex w-full justify-center">
        {showAddGemInput && (
          <div className="flex gap-2 w-full max-w-[400px]">
            <input
              type="text"
              value={newGem}
              onChange={(e) => setNewGem(e.target.value)}
              placeholder="Add a new gem..."
              className="flex-1 rounded-lg bg-[#1a1a2e] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") {
                  setNewGem("");
                  setShowAddGemInput(false);
                }
              }}
              aria-label="Add new gem"
              ref={addInputRef}
            />
            <button
              onClick={handleAdd}
              className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50"
              disabled={
                !newGem.trim() ||
                gems.some(
                  (g) => g.trim().toLowerCase() === newGem.trim().toLowerCase(),
                )
              }
              aria-label="Add gem"
            >
              Add Gem
            </button>
          </div>
        )}

        <div className="absolute top-4 right-4 flex justify-center items-center gap-3 z-20">
          {/* Add Button */}
          <button
            onClick={() => handleShowAddGemInput()}
            className="rounded-lg text-3xl text-gray-200 transition hover:cursor-pointer z-30"
            aria-label="Show add gem input"
          >
            +
          </button>

          {/* Settings Icon */}
          <button
            className="rounded-full text-gray-200 hover:cursor-pointer z-30"
            aria-label="Settings"
            onClick={() => setSettingsOpen(true)}
          >
            <svg
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
            >
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
      </div>


      {/* End: Testing Add Gem Button and Settings Button Here */}

      {/* Settings Modal */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center rounded-xl bg-black/40"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-xl bg-gray-700 p-6 shadow-2xl outline-none"
            tabIndex={-1}
            ref={settingsModalRef}
            onKeyDown={handleSettingsKeyDown}
            onClick={(e) => e.stopPropagation()}
            aria-modal="true"
            role="dialog"
          >
            <h2 className="mb-4 text-lg font-bold text-white">Settings</h2>
            {isPaidVersion && (
              <div className="mb-4 flex items-center gap-3">
                <label
                  htmlFor="favorites-feature-toggle"
                  className="text-sm font-medium text-white"
                >
                  Enable favorites
                </label>
                <button
                  id="favorites-feature-toggle"
                  onClick={handleFavoritesFeatureToggle}
                  className={`flex h-6 w-10 items-center rounded-full p-1 transition-colors ${favoritesFeatureEnabled ? "bg-blue-600" : "bg-gray-400"}`}
                  aria-pressed={favoritesFeatureEnabled}
                  aria-label="Toggle favorites feature"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${favoritesFeatureEnabled ? "translate-x-4" : ""}`}
                  ></span>
                </button>
              </div>
            )}
            <button
              onClick={() => setSettingsOpen(false)}
              className="absolute right-2 top-2 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close settings"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
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
        </div>
      )}

      {/* Favorites column (paid + enabled) */}
      {isPaidVersion && favoritesFeatureEnabled && (
        <div className="mb-4 w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-blue-300 mb-2">Favorites</h3>
            {favorites.length === 0 && <span className="text-xs text-gray-400">No favorites yet.</span>}
            {favorites.map((favIdx) => (
              <div key={favIdx} className="flex items-center justify-between rounded-lg bg-[#232946] px-3 py-2">
                <span className="text-base text-white truncate">{gems[favIdx]}</span>
                <button
                  onClick={() => handleToggleFavorite(favIdx)}
                  className="ml-2 rounded p-1 text-yellow-400 hover:bg-yellow-700/30"
                  aria-label="Remove from favorites"
                >
                  ★
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gems list (excluding favorites if enabled) */}
      <ul className="w-full flex-1 space-y-3 overflow-y-auto pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 auto-rows-min gap-4">
        {gems.map((gem, index) => {
          // If favorites enabled, skip gems that are in favorites for the main grid
          if (isPaidVersion && favoritesFeatureEnabled && favorites.includes(index)) return null;
          return (
            <li
              key={index}
              className="group relative flex items-center rounded-xl px-4 py-3 hover:border hover:border-gray-400"
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
                    <span className="text-base font-semibold leading-tight text-gray-200 hover:text-gray-400">
                      {gem}
                    </span>
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
                    {/* Favorite button */}
                    {isPaidVersion && favoritesFeatureEnabled && (
                      <button
                        onClick={() => handleToggleFavorite(index)}
                        className={`rounded-lg p-2 ${favorites.includes(index) ? "text-yellow-400" : "text-gray-400"} hover:bg-yellow-700/30 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                        aria-label={favorites.includes(index) ? "Unfavorite" : "Favorite"}
                      >
                        ★
                      </button>
                    )}
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {/* Add Gem Button */}
      {/* <div className="mt-4 flex w-full justify-center">
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
      </div> */}

      {/* Settings Icon */}
      {/* <button
        className="absolute bottom-4 right-4 rounded-full bg-[#232946] p-2 text-gray-400 shadow-lg transition hover:bg-blue-700/60 hover:text-white"
        aria-label="Settings"
        onClick={() => setSettingsOpen(true)}
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
      </button> */}
    </div>
  );
}
