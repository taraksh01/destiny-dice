import DestinyList from "./components/DestinyList";
import DestinyManager from "./components/DestinyManager";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6">
          Destiny Dice
        </h1>

        <main className="flex-1 w-full max-w-[1400px] mx-auto sm:h-[calc(100vh-180px)]">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full">
            {/* Destiny Manager */}
            <div className="h-full w-full sm:w-1/2 overflow-auto">
              <DestinyManager />
            </div>

            {/* Destiny List */}
            <div className="h-full w-full sm:w-1/2 overflow-auto">
              <DestinyList />
            </div>
          </div>
        </main>
      </div>

      <footer className="w-full py-3 text-center bg-white dark:bg-zinc-900 shadow-lg mt-4">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Made with ❤️ by{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500">
            Tarak{" "}
            <a
              href="https://github.com/taraksh01"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              (taraksh01)
            </a>
          </span>
        </p>
      </footer>
    </div>
  );
}
