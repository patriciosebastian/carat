import React from 'react'

export default function App() {
  return (
    <div className="relative w-full h-full flex justify-center items-center bg-gray-500/65 rounded-xl"> {/* possible backdrop-blur */}
      {/* Draggable area */}
      <div
        className="absolute top-0 left-0 w-full h-8 bg-transparent cursor-move -z-10"
        style={{ WebkitAppRegion: 'drag' }}
      ></div>

      {/* Main content */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome to Carat</h1>
        <p className="text-white mt-2">
          Your Newest Experience.
        </p>
      </div>
        
      {/* Close button */}
      <button
        onClick={() => window.close()}
        className="absolute top-2 right-2 text-white hover:text-red-500 z-10"
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        ✖
      </button>
    </div>
  );
}
