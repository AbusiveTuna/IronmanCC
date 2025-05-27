import React from 'react';

const AdminTable = ({ buyins, setBuyins, onDelete, onUpdate }) => {
    const handleAmountChange = (index, newAmount) => {
        setBuyins(prev =>
            prev.map((row, i) =>
                i === index ? { ...row, amount: Number(newAmount) } : row
            )
        );
    };

    return (
        <div className="buyins-section">
            <h2>Existing Buy-Ins</h2>
            <table className="buyins-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Event</th>
                        <th>Amount (m)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {buyins.map((b, index) => (
                        <tr key={`${b.player_name}-${b.event_name}-${index}`}>
                            <td>{b.player_name}</td>
                            <td>{b.event_name}</td>
                            <td>
                                <input
                                    type="number"
                                    value={b.amount}
                                    min="1"
                                    onChange={(e) => handleAmountChange(index, e.target.value)}
                                    className="buyin-input buyin-amount-input"
                                />

                            </td>
                            <td>
                                <button className="buyin-action-button" onClick={() => onUpdate(b.player_name, b.event_name, b.amount)}>
                                    Update
                                </button>
                                <button className="buyin-action-button" onClick={() => onDelete(b.player_name, b.event_name)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTable;
