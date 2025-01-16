import { useState } from 'react';
const Cannon = ({ onFire }) => {
    const [coordinate, setCoordinate] = useState('');

    const handleInputChange = (e) => {
        setCoordinate(e.target.value.toUpperCase());
    };

    const handleFire = () => {
        if (validateCoordinate(coordinate)) {
            onFire(coordinate);
            setCoordinate('');
        } else {
            //notify user its bad
        }
    }

    const validateCoordinate = (input) => {
        const validRegex = /^[A-J](10|[1-9])$/; // Matches A1-J10
        return validRegex.test(input);
    };

    return (
        <div className="cannon">
            <input
                type="text"
                placeholder="Enter coordinate (e.g., A1)"
                value={coordinate}
                onChange={handleInputChange}
                maxLength={3}
                className="cannon-input"
            />
            <button onClick={handleFire} className="fire-button">
                Fire!
            </button>
        </div>
    );
};

export default Cannon;