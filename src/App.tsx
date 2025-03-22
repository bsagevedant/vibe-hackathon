import React from 'react';
import Scene from './components/Scene';
import { MonitorCheck, Twitter } from 'lucide-react';

function App() {
  return (
    <div className="relative w-full h-screen bg-black">
      <Scene />
      
      {/* Overlay UI */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center text-cyan-400 pointer-events-none">
        <div className="flex items-center space-x-2">
          <MonitorCheck className="w-6 h-6" />
          <span className="font-mono text-lg">bolt.new</span>
        </div>
        <div className="font-mono text-sm">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-cyan-400 font-mono text-sm pointer-events-none">
        <p>DRAG to rotate | SCROLL to zoom</p>
        <p>HOVER over orbs to interact</p>
      </div>

      {/* X Profile Link */}
      <a 
        href="https://x.com/sagevedant" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="absolute bottom-4 right-4 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 font-mono text-sm"
      >
        <Twitter className="w-4 h-4" />
        x.com/sagevedant
      </a>
    </div>
  );
}

export default App;