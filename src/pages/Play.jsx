import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Play() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([
    {_id: '1', label: '₹50', stake: 50},
    {_id: '2', label: '₹100', stake: 100},
    {_id: '3', label: '₹200', stake: 200},
    {_id: '4', label: '₹500', stake: 500}
  ]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/public/stake-tables`)
      .then(res => { if(res.data && res.data.length) setTables(res.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 p-4">
      <div className="max-w-6xl mx-auto pt-20">
        
        <button
          onClick={() => navigate('/create-room')}
          className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-5 rounded-2xl mb-8 text-2xl shadow-2xl"
        >
          ✨ Create Challenge
        </button>

        <h2 className="text-3xl font-bold text-white mb-6">🎮 Stake Tables</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {tables.map(t => (
            <div key={t._id} className="bg-white/10 border border-cyan-400 rounded-xl p-6 text-center hover:scale-105 transition">
              <p className="text-cyan-400 text-4xl font-bold mb-2">{t.label}</p>
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

        <h2 className="text-3xl font-bold text-white mb-6">🔥 Open Challenges</h2>
        <div className="bg-white/5 rounded-xl p-8 text-center text-purple-300">
          No open challenges yet
        </div>
      </div>
    </div>
  );
}
