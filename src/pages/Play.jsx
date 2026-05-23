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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">🎮 Pick Your Arena</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tables.map(t => (
            <div key={t._id} className="bg-white/10 border border-cyan-400 rounded-xl p-6 text-center hover:scale-105 transition">
              <p className="text-cyan-400 text-3xl font-bold mb-2">{t.label}</p>
              <p className="text-purple-300 text-sm mb-4">Entry Fee</p>
              <button
                onClick={() => navigate(`/create-room?amount=${t.stake}`)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 rounded"
              >
                ✅ Create Room
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
