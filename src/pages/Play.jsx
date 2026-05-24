import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Play() {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/public/stake-tables`)
      .then(res => setTables(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 p-4 pt-32">
      
      <button
        onClick={() => navigate('/create-room')}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-[99999] bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-2xl"
      >
        ✨ Create Challenge
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center mt-16">🎮 Pick Your Arena</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tables.map(t => (
            <div key={t._id} className="bg-white/10 border border-cyan-400 rounded-xl p-6 text-center">
              <p className="text-cyan-400 text-3xl font-bold mb-2">{t.label}</p>
              <p className="text-purple-300 text-sm mb-4">Entry Fee</p>
              <button
                onClick={() => navigate(`/create-room?amount=${t.stake}`)}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded"
              >
                Create Room
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
