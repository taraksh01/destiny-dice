"use client";

import { useState, useEffect, useCallback } from "react";
import { storage } from "@/utils/storage";
import { Destiny } from "@/types/destiny";

export default function DestinyList() {
  const [destinies, setDestinies] = useState<Destiny[]>([]);
  const [editingDestiny, setEditingDestiny] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const loadItems = useCallback(() => {
    const destinies = storage.getDestinies();
    destinies.sort((a, b) => b.createdAt - a.createdAt);
    setDestinies(destinies);
  }, []);

  useEffect(() => {
    loadItems();
    window.addEventListener("storage", loadItems);
    window.addEventListener("itemsUpdated", loadItems);

    return () => {
      window.removeEventListener("storage", loadItems);
      window.removeEventListener("itemsUpdated", loadItems);
    };
  }, [loadItems]);

  const removeItem = useCallback(
    (id: string) => {
      const updatedDestinies = destinies.filter((destiny) => destiny.id !== id);
      storage.setDestinies(updatedDestinies);
      setDestinies(updatedDestinies);
    },
    [destinies]
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startEdit = (destiny: Destiny) => {
    setEditingDestiny(destiny.id);
    setEditText(destiny.text);
  };

  const saveEdit = (id: string) => {
    try {
      const updatedDestinies = destinies.map((destiny) =>
        destiny.id === id
          ? { ...destiny, text: editText.trim(), editedAt: Date.now() }
          : destiny
      );
      storage.setDestinies(updatedDestinies);
      setDestinies(updatedDestinies);
      setEditingDestiny(null);
      window.dispatchEvent(new Event("destiniesUpdated"));
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const cancelEdit = () => {
    setEditingDestiny(null);
    setEditText("");
  };

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <div className="h-full bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        All Destiny Items
      </h2>

      {destinies.length === 0 ? (
        <p className="text-center text-gray-500 italic py-8">
          No items in the destiny pool yet! Add some items to get started.
        </p>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3">
          {destinies.map((destiny) => (
            <div
              key={destiny.id}
              className="group flex items-center justify-between p-2 sm:p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:shadow-md transition-all relative"
            >
              <div className="flex-1 min-w-0">
                {editingDestiny === destiny.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-3 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-zinc-700"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(destiny.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                    <button
                      onClick={() => saveEdit(destiny.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-medium truncate">
                      {destiny.text}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {destiny.editedAt
                        ? `Edited on ${formatDate(destiny.editedAt)}`
                        : `Added on ${formatDate(destiny.createdAt)}`}
                    </p>
                  </>
                )}
              </div>
              {!editingDestiny && (
                <>
                  {/* Desktop actions */}
                  <div className="hidden sm:flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(destiny)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-all"
                      title="Edit item"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeItem(destiny.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-all"
                      title="Remove item"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Mobile menu button */}
                  <button
                    onClick={() => toggleMenu(destiny.id)}
                    className="sm:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>

                  {/* Mobile menu */}
                  {activeMenu === destiny.id && (
                    <div className="absolute right-2 top-12 sm:hidden bg-white dark:bg-zinc-700 rounded-lg shadow-lg py-2 z-10">
                      <button
                        onClick={() => {
                          startEdit(destiny);
                          setActiveMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          removeItem(destiny.id);
                          setActiveMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500 mt-4 text-center">
        Total destinies: {destinies.length}
      </p>
    </div>
  );
}
