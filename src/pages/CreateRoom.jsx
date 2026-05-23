import React, { useState } from 'react';
import axios from 'axios';

export default function CreateRoom() {
  const [amount, setAmount] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/room/create`,
        { amount },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setRoom(response.data);
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 p-4">
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white/10 rounded-2xl p-8 border border-purple-500/50">
          <h1 className="text-3xl font-bold text-white mb-8">🎮 Create Room</h1>
          
          {!room ? (
            <>
              <div className="mb-8">
                <label className="text-white font-bold mb-3 block">Select Amount</label>
                <div className="grid grid-cols-2 gap-3">
                  {[50, 100, 500, 1000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className={`p-4 rounded font-bold ${amount === amt ? 'bg-pink-500 text-white' : 'bg-white/10 text-white'}`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleCreate}
                disabled={!amount || loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded"
              >
                {loading ? 'Creating...' : '✅ Create Room'}
              </button>
            </>
          ) : (
            <div className="bg-cyan-500/20 border-2 border-cyan-400 rounded-lg p-6">
              <p className="text-white text-sm mb-2">🎮 Room Code:</p>
              <p className="text-cyan-400 text-3xl font-bold mb-4">{room.roomCode}</p>
              
              <p className="text-white text-sm mb-2">🔐 Password:</p>
              <p className="text-cyan-400 text-3xl font-bold mb-4">{room.password}</p>
              
              <p className="text-white text-sm mb-4">💰 Entry: ₹{room.amount}</p>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${room.roomCode} - ${room.password}`);
                  alert('Copied!');
                }}
                className="w-full bg-cyan-500 text-black font-bold py-2 rounded"
              >
                📋 Copy Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
