export const Toolbar = () => {
    return (
        <div className="toolbar w-full py-2 px-4 bg-gray-100 border-b border-gray-300">
        <div className="flex items-center justify-between">
          {/* Left Section: Ask Igor Button */}
          <div className="flex items-center space-x-2">
          <button
            className="py-2 px-4 text-white bg-[#3B82f6] rounded-sm hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Ask Igor"
          >
            Ask Igor
          </button>
          <button
            className="py-2 px-4 text-slate-500 bg-white rounded-sm hover:bg-slate-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-400 py-2 px-4 text-slate-500 bg-gray-200 rounded-sm hover:bg-slate-500 hover:text-white outline"
            aria-label="Ask Igor"
          >
            Search
          </button>
          </div>

          {/* Right Section: Formatting and Alignment Options */}
          <div className="flex items-center space-x-2">
            {/* Bold Button */}
            <button
              className="p-2 text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Bold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3H5v18h8a4 4 0 100-8H9m0-5h4"
                />
              </svg>
            </button>

            {/* Italic Button */}
            <button
              className="p-2 text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Italic"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 3h8m-4 0l-4 18m4-18h4"
                />
              </svg>
            </button>

            {/* Underline Button */}
            <button
              className="p-2 text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 3v10a4 4 0 008 0V3m-8 18h8"
                />
              </svg>
            </button>

            {/* Divider */}
            <span className="h-6 border-l border-gray-300"></span>

            {/* Align Left */}
            <button
              className="p-2 text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Align Left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h18M3 6h18M3 14h10M3 18h10"
                />
              </svg>
            </button>

            {/* Align Center */}
            <button
              className="p-2 text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Align Center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M6 10h12M4 14h16M6 18h12"
                />
              </svg>
            </button>

            {/* Align Right */}
            <button
              className="p-2 text-gray-700 bg-white rounded border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Align Right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 6h18M7 10h14M3 14h18M7 18h14"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
}

export default Toolbar;