import React, { useState, useRef, useEffect  } from 'react';
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

function Runerdle () {
    const [currentGuess, setCurrentGuess] = useState('');
    const [nextLetter, setNextLetter] = useState(0);
    const [currentRow, setCurrentRow] = useState(0);
    const [remainingGuesses, setRemainingGuesses] = useState(NUMBER_OF_GUESSES);
    const [rightGuessString, setRightGuessString] = useState("");
    const [rightGuessWiki, setRightGuessWiki] = useState("");
    const [justWords, setJustWords] = useState("");
    const [hardMode, setHardMode] = useState(false);
    const [showPlayAgain, setShowPlayAgain] = useState("none");
    const [gameBoard, setGameBoard] = useState(Array(NUMBER_OF_GUESSES).fill(null).map(() => Array(5).fill('')));


    function getWord() {
        let mode = GUESSES;
        if (hardMode) {
            mode = HARDWORDS;
        } 
        let rand = Math.floor(Math.random() * mode.length);
        setRightGuessString(mode[rand][0]);
        setRightGuessWiki(mode[rand][1]);
        setJustWords(toOneD(mode));
    }

    const [word, setWord] = useState(getWord());
    
    function toOneD(twoD) {
        let oneD = new Array(twoD.length);
        for (let i = 0; i < twoD.length; i++) {
            oneD[i] = twoD[i][0];
        }
        return oneD;
    }

    function inputLetter(pressedKey){ 
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

    useEffect(() => {
        const handleKeyDown = (event) => {
            inputLetter(event.key);
        };

        window.addEventListener('keydown',handleKeyDown);

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

    }

    function shadeKeyBoard(letter, color) {
        // for (const elem of document.getElementsByClassName("keyboard-button")) {
        //     if (elem.textContent === letter) {
        //         let oldColor = elem.style.backgroundColor;
        //         if (oldColor === 'green') {
        //             return;
        //         }
    
        //         if (oldColor === '#d9b502' && color !== 'green') {
        //             return;
        //         }
    
        //         elem.style.backgroundColor = color;
        //         break;
        //     }
        // }
    }

    const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        // const node = document.querySelector(element);
        const node = element;
        node.style.setProperty('--animate-duration', '0.3s');

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {
            once: true
        });
    });

    return(
        <>
        <h1> Old School Runescape Wordle </h1>
        
        <Popup trigger={<input type="image" src={settings} className="btn btn-primary" alt="settings" />}modal nested>
            {close => (
                <div className ="settingsModal">
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
                                    <input type="checkbox" name="hardModeButton" id="hardModeButton"></input>
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
                                    <input type="checkbox" name="dictionaryButton" id="dictionaryButton"></input>
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Popup>

        <Popup trigger={<input type="image" src={questionMark} className="btn btn-help" alt="howtoplay"/>}modal>
        {close => (
                <div className ="helpModal">
                    <button className="closeModal" onClick={close}> </button>
                    <div className="helpModalHeader"> How To Play </div>
                    <div className="helpModalContent">
                        <div className="text">
                            <div className="help">Guess the OSRS related word in six tries.</div>
                            <div className="help">Each guess must be a five-letter word. Hit enter to submit your guess.</div>
                            <div className="help">After each guess, the color of the tiles will change to show how close</div>
                            <div className="help">your guess was to the word.</div>
                            <div className="help">Green means the letter is in the word and the correct spot.</div>
                            <div className="help"> <img src={green} alt="green"/> </div>
                            <div className="help">Yellow means the letter is in the word but in the incorrect spot.</div>
                            <div className="help"> <img src={yellow} alt="yellow"/> </div>
                            <div className="help">Gray means the letter is not in the word.</div>
                            <div className="help"> <img src={gray} alt="gray"/> </div>
                        </div>
                    </div>
                </div>
            )}
        </Popup>

        {/* <Popup trigger={<input type="image" src={questionMark} className="btn btn-help" alt="howtoplay"/>}modal>
        {close => (
                <div className ="winModal">
                    <button className="closeModal" onClick={close}> </button>
                    <div className="winModalHeader"> You Won! </div>
                    <div className="winModalContent">
                        <h3>Gratz!</h3>
                        <div id="wiki-link"><a href="runerdle.com" target="_blank" rel="noopener noreferrer">What does this word mean? </a> </div>
                    </div>
                </div>
            )}
        </Popup>

        <Popup trigger={<input type="image" src={questionMark} className="btn btn-help" alt="howtoplay"/>}modal>
        {close => (
                <div className ="lossModal">
                    <button className="closeModal" onClick={close}> </button>
                    <div className="lossModalHeader"> You Lost! </div>
                    <div className="lossModalContent">
                        <h3>Maybe you should study up</h3>
                        <div id="wiki-link"><a href="runerdle.com" target="_blank" rel="noopener noreferrer">What does this word mean? </a> </div>
                    </div>
                </div>
            )}
        </Popup> */}

        <div className="game-board">
            {gameBoard.map((row, rowIndex) => (
                <div key={rowIndex} className="letter-row">
                    {row.map((box, boxIndex) => (
                        <div key={boxIndex} className={`letter-box ${box ? 'filled-box' : ''}`}>
                            {box}
                        </div>
                    ))}
                </div>
            ))}
        </div>

        <div className="keyboard-cont">
            <div className="first-row">
                <button className="keyboard-button">q</button>
                <button className="keyboard-button">w</button>
                <button className="keyboard-button">e</button>
                <button className="keyboard-button">r</button>
                <button className="keyboard-button">t</button>
                <button className="keyboard-button">y</button>
                <button className="keyboard-button">u</button>
                <button className="keyboard-button">i</button>
                <button className="keyboard-button">o</button>
                <button className="keyboard-button">p</button>
            </div>
            <div className="second-row">
                <button className="keyboard-button">a</button>
                <button className="keyboard-button">s</button>
                <button className="keyboard-button">d</button>
                <button className="keyboard-button">f</button>
                <button className="keyboard-button">g</button>
                <button className="keyboard-button">h</button>
                <button className="keyboard-button">j</button>
                <button className="keyboard-button">k</button>
                <button className="keyboard-button">l</button>
            </div>
            <div className="third-row">
                <button className="keyboard-button">Del</button>
                <button className="keyboard-button">z</button>
                <button className="keyboard-button">x</button>
                <button className="keyboard-button">c</button>
                <button className="keyboard-button">v</button>
                <button className="keyboard-button">b</button>
                <button className="keyboard-button">n</button>
                <button className="keyboard-button">m</button>
                <button className="keyboard-button">Enter</button>
            </div>
        </div>

        <div>
            <button style={{ display: {showPlayAgain} }}> Play Again?</button>
        </div>
        

        </>
    );
}

export default Runerdle;