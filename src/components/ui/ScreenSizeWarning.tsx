import { useEffect, useState } from "react";

const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;

function ScreenSizeWarning({ children }: { children: React.ReactNode }) {
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const isTooSmall =
        window.innerWidth < MIN_WIDTH || window.innerHeight < MIN_HEIGHT;
      setIsScreenTooSmall(isTooSmall);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isScreenTooSmall) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mx-auto mb-4 text-gray-600 dark:text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Screen Too Small
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please resize your browser window to at least {MIN_WIDTH}x
            {MIN_HEIGHT} pixels to play chess.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Current size: {window.innerWidth}x{window.innerHeight}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ScreenSizeWarning;
