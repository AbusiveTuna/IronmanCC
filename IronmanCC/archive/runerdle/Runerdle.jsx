import React, { useState, useEffect } from 'react';
import settings from './images/Settings.png';
import questionMark from './images/questionMark.png';
import green from './images/green.png';
import yellow from './images/yellow.png';
import gray from './images/gray.png';
import { GUESSES } from "./WordLists/guesses.js";
import { WORDS } from "./WordLists/dictionary.js";
import { HARDWORDS } from "./WordLists/hardWords.js";
import Popup from 'reactjs-popup';
import './RunerdleStyle.css';

const NUMBER_OF_GUESSES = 6;

function Runerdle() {
    const [rightGuessWiki, setRightGuessWiki] = useState("");
    const [showWinModal, setShowWinModal] = useState(false);
    const [showLoseModal, setShowLoseModal] = useState(false);
    const [tileColors, setTileColors] = useState(Array(NUMBER_OF_GUESSES).fill(null).map(() => Array(5).fill('')));
    const [currentGuess, setCurrentGuess] = useState('');
    const [nextLetter, setNextLetter] = useState(0);
    const [currentRow, setCurrentRow] = useState(0);
    const [rightGuessString, setRightGuessString] = useState("");
    const [hardMode, setHardMode] = useState(false);
    const [gameBoard, setGameBoard] = useState(Array(NUMBER_OF_GUESSES).fill(null).map(() => Array(5).fill('')));
    const [showPlayAgain, setShowPlayAgain] = useState(false);
    const [keyColors, setKeyColors] = useState({});
    const [useDictionary, setUseDictionary] = useState(true);

    function getWord() {
        let mode = hardMode ? HARDWORDS : GUESSES;
        let rand = Math.floor(Math.random() * mode.length);
        let chosenWord = mode[rand];
        setRightGuessString(chosenWord[0]);
        setRightGuessWiki(chosenWord[1]);
    }

    useEffect(() => {
        getWord();
    }, [hardMode]);

    function inputLetter(pressedKey) {
        if ((pressedKey === "Backspace" || pressedKey === "Del") && nextLetter !== 0) {
            deleteLetter();
            return;
        }

        if (pressedKey === "Enter") {
            checkGuess();
            return;
        }

        pressedKey = pressedKey.toLowerCase();

        if (pressedKey.length === 1 && pressedKey.charCodeAt() >= 97 && pressedKey.charCodeAt() <= 122) {
            insertLetter(pressedKey);
        }

    }

    function resetGame() {
        setGameBoard(Array(NUMBER_OF_GUESSES).fill(null).map(() => Array(5).fill('')));
        setTileColors(Array(NUMBER_OF_GUESSES).fill(null).map(() => Array(5).fill('')));
        setCurrentGuess('');
        setNextLetter(0);
        setCurrentRow(0);
        setShowPlayAgain(false);
        setKeyColors({});

        getWord();
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            inputLetter(event.key);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [inputLetter]);

    function insertLetter(pressedKey) {
        if (nextLetter === 5) {
            return;
        }

        const updatedBoard = gameBoard.map((row, rowIndex) => {
            if (rowIndex === currentRow) {
                return row.map((cell, cellIndex) => cellIndex === nextLetter ? pressedKey : cell);
            }
            return row;
        });

        setGameBoard(updatedBoard);
        setCurrentGuess(prevGuess => {
            return prevGuess + pressedKey;
        });
        setNextLetter(prevLetter => {
            return prevLetter + 1;
        });
    }


    function deleteLetter() {
        if (nextLetter === 0) return;

        const updatedBoard = [...gameBoard];
        updatedBoard[currentRow][nextLetter - 1] = '';
        setGameBoard(updatedBoard);
        setCurrentGuess(prevGuess => prevGuess.slice(0, -1));
        setNextLetter(prevLetter => prevLetter > 0 ? prevLetter - 1 : 0);
    }

    function checkGuess() {
        const guessLowerCase = currentGuess.toLowerCase();

        const isValidWord = useDictionary && WORDS.includes(guessLowerCase) ||
            GUESSES.some(pair => pair[0] === guessLowerCase) ||
            HARDWORDS.some(pair => pair[0] === guessLowerCase);

        if (!isValidWord) {
            alert("That word isn't valid.");
            return;
        }

        if (currentGuess.length !== 5) {
            alert("Word must be 5 letters");
            return;
        }

        const newTileColors = [...tileColors];
        let correctCount = 0;

        const letterCounts = {};
        for (const letter of rightGuessString) {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }

        currentGuess.split('').forEach((letter, index) => {
            if (letter === rightGuessString[index]) {
                newTileColors[currentRow][index] = 'green';
                correctCount++;
                shadeKeyBoard(letter, 'green');
                letterCounts[letter]--;
            }
        });

        currentGuess.split('').forEach((letter, index) => {
            if (letter !== rightGuessString[index] && rightGuessString.includes(letter) && letterCounts[letter] > 0) {
                newTileColors[currentRow][index] = 'Gold';
                shadeKeyBoard(letter, 'Gold');
                letterCounts[letter]--;
            } else if (newTileColors[currentRow][index] !== 'green') {
                newTileColors[currentRow][index] = 'gray';
                shadeKeyBoard(letter, 'gray');
            }
        });

        setTileColors(newTileColors);

        setTimeout(() => {
            if (correctCount === 5) {
                setShowWinModal(true);
                setShowPlayAgain(true);
            } else if (currentRow === NUMBER_OF_GUESSES - 1) {
                setShowLoseModal(true);
                setShowPlayAgain(true);
            } else {
                setCurrentRow(currentRow + 1);
                setCurrentGuess('');
                setNextLetter(0);
            }
        }, 1000);

        const newBoard = [...gameBoard];
        newBoard[currentRow] = currentGuess.split('');
        setGameBoard(newBoard);
    }



    const shadeKeyBoard = (letter, color) => {
        setKeyColors(prevColors => {
            const currentColor = prevColors[letter];

            if (currentColor === 'green' || (currentColor === 'Gold' && color !== 'green')) {
                return prevColors;
            }

            return { ...prevColors, [letter]: color };
        });
    };

    return (
        <div className="runerdle">
            <h1> Old School Runescape Wordle </h1>

            <Popup trigger={<input type="image" src={settings} className="btn btn-primary" alt="settings" />} modal nested>
                {close => (
                    <div className="settingsModal">
                        <button className="closeModal" onClick={close}> </button>
                        <div className="settingsModalHeader"> Settings </div>
                        <div className="settingsModalContent">
                            <div className="runerdleSetting">
                                <div className="text">
                                    <div className="title">Hard Mode</div>
                                    <div className="description"> Adds lesser known npcs and items to the possible word list. </div>
                                </div>
                                <div className="control">
                                    <label className="settingsSwitch">
                                        <input
                                            type="checkbox"
                                            name="hardModeButton"
                                            id="hardModeButton"
                                            checked={hardMode}
                                            onChange={() => setHardMode(!hardMode)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                            <div className="runerdleSetting">
                                <div className="text">
                                    <div className="title">Use Dictionary</div>
                                    <div className="description"> Allows you to submit words not found in the osrs word list. (Ex: Radio) </div>
                                </div>
                                <div className="control">
                                    <label className="settingsSwitch">
                                        <input
                                            type="checkbox"
                                            name="dictionaryButton"
                                            id="dictionaryButton"
                                            checked={useDictionary}
                                            onChange={() => setUseDictionary(!useDictionary)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>

            <Popup trigger={<input type="image" src={questionMark} className="btn btn-help" alt="howtoplay" />} modal>
                {close => (
                    <div className="helpModal">
                        <button className="closeModal" onClick={close}> </button>
                        <div className="helpModalHeader"> How To Play </div>
                        <div className="helpModalContent">
                            <div className="text">
                                <div className="help">Guess the OSRS related word in six tries.</div>
                                <div className="help">Each guess must be a five-letter word. Hit enter to submit your guess.</div>
                                <div className="help">After each guess, the color of the tiles will change to show how close</div>
                                <div className="help">your guess was to the word.</div>
                                <div className="help">Green means the letter is in the word and the correct spot.</div>
                                <div className="help"> <img src={green} alt="green" /> </div>
                                <div className="help">Yellow means the letter is in the word but in the incorrect spot.</div>
                                <div className="help"> <img src={yellow} alt="yellow" /> </div>
                                <div className="help">Gray means the letter is not in the word.</div>
                                <div className="help"> <img src={gray} alt="gray" /> </div>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>

            <Popup open={showWinModal} modal onClose={() => setShowWinModal(false)}>
                <div className="winModal">
                    <button className="closeModal" onClick={() => setShowWinModal(false)}> </button>
                    <div className="winModalHeader"> You Won! </div>
                    <div className="winModalContent">
                        <h2> The word was {rightGuessString} </h2>
                        <h3>Gratz!</h3>
                        <div id="wiki-link"><a href={rightGuessWiki} target="_blank" rel="noopener noreferrer">What does this word mean?</a></div>
                    </div>
                </div>
            </Popup>

            <Popup open={showLoseModal} modal onClose={() => setShowLoseModal(false)}>
                <div className="lossModal">
                    <button className="closeModal" onClick={() => setShowLoseModal(false)}> </button>
                    <div className="lossModalHeader"> You Lost! </div>
                    <div className="lossModalContent">
                        <h2> The word was {rightGuessString} </h2>
                        <h3>Maybe you should study up</h3>
                        <div id="wiki-link"><a href={rightGuessWiki} target="_blank" rel="noopener noreferrer">What does this word mean?</a></div>
                    </div>
                </div>
            </Popup>

            <div className="game-board">
                {gameBoard.map((row, rowIndex) => (
                    <div key={rowIndex} className="letter-row">
                        {row.map((cell, cellIndex) => {
                            const transitionDelay = `${cellIndex * 0.1}s`;

                            return (
                                <div
                                    key={cellIndex}
                                    className={`letter-box ${tileColors[rowIndex][cellIndex] ? 'flip' : ''}`}
                                >
                                    <div className="letter-box-inner" style={{ transitionDelay }}>
                                        <div className="letter-front">
                                            {cell}
                                        </div>
                                        <div className="letter-back" style={{ backgroundColor: tileColors[rowIndex][cellIndex] }}>
                                            {cell}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>



            <div className="keyboard-cont">
                {["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((row, index) => (
                    <div key={index} className="keyboard-row">
                        {row.split('').map((letter) => (
                            <button
                                key={letter}
                                className={`keyboard-button ${keyColors[letter]}`}
                                style={{ backgroundColor: keyColors[letter] }}
                                onClick={() => inputLetter(letter)}
                            >
                                {letter}
                            </button>
                        ))}
                        {index === 2 && (
                            <>
                                <button
                                    className="keyboard-button"
                                    onClick={() => deleteLetter()}
                                >
                                    Del
                                </button>
                                <button
                                    className="keyboard-button"
                                    onClick={() => checkGuess()}
                                >
                                    Enter
                                </button>
                            </>
                        )}
                    </div>
                ))}

                {showPlayAgain && (
                    <button className="playAgainBtn" onClick={resetGame}>
                        Play Again?
                    </button>
                )}
            </div>


        </div>
    );
}

export default Runerdle;