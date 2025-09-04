// Settings.js
// Component for the settings menu in Unicorn Jump

import React, { useState } from 'react';

const Settings = ({ onClose, onSave }) => {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [difficulty, setDifficulty] = useState('normal');

    const handleSave = () => {
        onSave({ soundEnabled, musicEnabled, difficulty });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={() => setSoundEnabled(!soundEnabled)}
                            className="mr-2"
                        />
                        Sound Effects
                    </label>
                </div>
                
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={musicEnabled}
                            onChange={() => setMusicEnabled(!musicEnabled)}
                            className="mr-2"
                        />
                        Background Music
                    </label>
                </div>
                
                <div className="mb-4">
                    <label className="block mb-2">Difficulty</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="easy">Easy</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;