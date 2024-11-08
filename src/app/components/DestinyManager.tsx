"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { storage } from "@/utils/storage";
import {
  Destiny,
  HistoryItem,
  HISTORY_SIZE_OPTIONS,
  HistorySize,
  MAX_STORED_HISTORY,
} from "@/types/destiny";

export default function DestinyManager() {
  const [destinies, setDestinies] = useState<Destiny[]>([]);
  const [newDestiny, setNewDestiny] = useState("");
  const [selectedDestiny, setSelectedDestiny] = useState<Destiny | null>(null);
  const [selectionHistory, setSelectionHistory] = useState<HistoryItem[]>([]);
  const [historySize, setHistorySize] = useState<HistorySize>(5);

  useEffect(() => {
    const destinies = storage.getDestinies();
    const history = storage.getHistory();
    const storedHistorySize = localStorage.getItem("historySize");

    setDestinies(destinies);

    if (history.length > 0) {
      setSelectionHistory(history);
      setSelectedDestiny(history[0]);
    }

    if (storedHistorySize) {
      setHistorySize(Number(storedHistorySize) as HistorySize);
    }
  }, []);

  const saveDestiny = () => {
    const trimmedDestiny = newDestiny.trim();
    if (!trimmedDestiny) return;

    const isDuplicate = destinies.some(
      (destiny) => destiny.text.toLowerCase() === trimmedDestiny.toLowerCase()
    );

    if (isDuplicate) {
      alert("This destiny already exists!");
      return;
    }

    const destiny: Destiny = {
      id: Date.now().toString(),
      text: trimmedDestiny,
      createdAt: Date.now(),
    };

    const updatedDestinies = [...destinies, destiny];
    setDestinies(updatedDestinies);
    storage.setDestinies(updatedDestinies);
    setNewDestiny("");
  };

  const selectRandomItem = () => {
    if (destinies.length === 0) {
      alert("Please add some destinies first!");
      return;
    }

    const randomIndex = Math.floor(Math.random() * destinies.length);
    const randomDestiny = destinies[randomIndex];

    // Create history item first
    const historyItem: HistoryItem = {
      ...randomDestiny,
      selectedAt: Date.now(),
    };

    // Update selected item and history
    setSelectedDestiny(historyItem);

    // Store up to MAX_STORED_HISTORY items
    const allHistory = [historyItem, ...selectionHistory].slice(
      0,
      MAX_STORED_HISTORY
    );

    setSelectionHistory(allHistory);
    storage.setHistory(allHistory);

    // Get the button's position for the confetti origin
    const button = document.querySelector("#destinyButton");
    if (button) {
      const rect = button.getBoundingClientRect();
      const buttonCenter = {
        x: (rect.left + rect.right) / 2 / window.innerWidth,
        y: (rect.top + rect.height) / window.innerHeight,
      };

      // Fire confetti from both sides of the button
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: buttonCenter.x - 0.1, y: buttonCenter.y },
        angle: 60,
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: buttonCenter.x + 0.1, y: buttonCenter.y },
        angle: 120,
      });
    }
  };

  const handleHistorySizeChange = (newSize: HistorySize) => {
    setHistorySize(newSize);
    localStorage.setItem("historySize", newSize.toString());
    // Trim history if needed
    if (selectionHistory.length > newSize) {
      const trimmedHistory = selectionHistory.slice(0, newSize);
      setSelectionHistory(trimmedHistory);
      storage.setHistory(trimmedHistory);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full w-full bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col">
      <h2 className="text-xl sm:text-2xl font-bold py-3 sm:py-4 text-center">
        Add new Destiny
      </h2>

      <div className="space-y-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newDestiny}
            onChange={(e) => setNewDestiny(e.target.value)}
            placeholder="Enter an destiny"
            className="flex-1 px-3 sm:px-4 py-2 rounded-lg border text-black text-base sm:text-xl italic border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && saveDestiny()}
          />
          <button
            onClick={saveDestiny}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap text-sm sm:text-base"
          >
            Add Destiny ⚡
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <button
          id="destinyButton"
          onClick={selectRandomItem}
          disabled={destinies.length === 0}
          className={`w-full px-4 sm:px-6 py-2 sm:py-3 text-lg sm:text-2xl text-white rounded-lg transition-colors ${
            destinies.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          🎲 Roll The Dice of Destiny! 🎲
        </button>

        {selectedDestiny && (
          <div className="animate-fadeIn text-center mt-4 sm:mt-6">
            <h2 className="text-xl sm:text-3xl font-bold py-3 sm:py-4">
              🎉 Your Destiny is 🎉
            </h2>
            <div className="px-3 sm:px-8 py-3 sm:py-4 rounded-lg bg-gray-50 dark:bg-zinc-800 shadow-lg">
              <p className="text-xl sm:text-4xl font-bold text-blue-500 break-words">
                {selectedDestiny.text}
              </p>
            </div>
          </div>
        )}

        {/* Selection History with Size Selector */}
        {selectionHistory.length > 0 && (
          <div className="mt-4 py-4 sm:py-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-row sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-semibold">History</h3>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="historySize"
                  className="text-sm text-gray-600 dark:text-gray-300"
                >
                  Show last
                </label>
                <select
                  id="historySize"
                  value={historySize}
                  onChange={(e) =>
                    handleHistorySizeChange(
                      Number(e.target.value) as HistorySize
                    )
                  }
                  className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                >
                  {HISTORY_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} rolls
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3 overflow-y-auto max-h-[30vh]">
              {selectionHistory
                .slice(0, historySize)
                .map((historyItem, index) => (
                  <div
                    key={`${historyItem.id}-${historyItem.selectedAt}`}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 text-sm sm:text-base"
                  >
                    <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                      {formatTime(historyItem.selectedAt)}
                    </span>
                    <span className="flex-1 truncate">{historyItem.text}</span>
                    {index === 0 && (
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                        Latest
                      </span>
                    )}
                  </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Storing last {historySize} rolls in history
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
