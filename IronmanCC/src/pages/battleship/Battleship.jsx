import {useState} from 'react';
import GameBoard from './gameboard/GameBoard';
import Cannon from './Cannon';

import './Battleship.css';

const Battleship = () => {

    const [firedCoordinate, setFiredCoordinate] = useState(null);

    const [playerBoards, setPlayerBoards] = useState({
        player1: initializeBoard(),
        player2: initializeBoard(),
    });

    const [currentPlayer, setCurrentPlayer] = useState('player1');

    const handleCannonFire = (coordinate) => {
        const opponent = currentPlayer === 'player1' ? 'player2' : 'player1';

        setPlayerBoards((prevBoards) => {
            const updatedBoard = prevBoards[opponent].map((row) =>
                row.map((tile) =>
                    tile.position === coordinate
                        ? { ...tile, isHit: true }
                        : tile
                )
            );

            return {
                ...prevBoards,
                [opponent]: updatedBoard,
            };
        });


        setCurrentPlayer(opponent);
    }

    return (
        <>
            <div className="boards"> 
                <h2> Player 1 </h2>
                <GameBoard tiles = {playerBoards.player1}/>

                <h2> Player 2 </h2>
                <GameBoard tiles = {playerBoards.player2}/>
            </div>
           
            <Cannon onFire={handleCannonFire} />
        </>
    );
}

const initializeBoard = () => {
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    return Array.from({ length: 10 }, (_, rowIndex) =>
        Array.from({ length: 10 }, (_, colIndex) => ({
            position: `${rowLabels[rowIndex]}${colIndex + 1}`,
            row: rowLabels[rowIndex],
            col: colIndex + 1,
            hasShip: Math.random() < 0.2, // Randomly place ships for now
            isHit: false,
        }))
    );
};

export default Battleship;