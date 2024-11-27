import React from 'react';

export default function Header() {
  return (
    <header className="bg-red-600 text-white p-4 flex justify-between items-center">
      <div className="flex-1 flex justify-center">
        <img 
          src="../../../../public/images/logoFR.svg" 
          alt="TGI Fridays Logo" 
          className="h-10 object-contain" 
        />
      </div>
      <div className="absolute right-4">
        <button className="hover:bg-red-700 px-4 py-2 rounded">
          Mensajes
        </button>
      </div>
    </header>
  );
}

