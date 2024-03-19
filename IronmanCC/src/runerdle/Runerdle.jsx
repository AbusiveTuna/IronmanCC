import React, { useEffect, useState } from 'react';
import './style.css';
import toastr from 'toastr';
import { GUESSES } from "./WordLists/guesses.js";
import { WORDS } from "./WordLists/dictionary.js";
import { HARDWORDS } from "./WordLists/hardWords.js";

const NUMBER_OF_GUESSES = 6;
const NUMBER_OF_LETTERS = 5;

function Runerdle() {
    const [board, setBoard] = useState([]);
    const [guessesRemaining, setGuessesRemaining] = useState(NUMBER_OF_GUESSES);
    const [currentGuess, setCurrentGuess] = useState([]);
    const [nextLetter, setNextLetter] = useState(0);
    const [rightGuessString, setRightGuessString] = useState([]);
    const [rightGuessWiki, setRightGuessWiki] = useState([]);
    const [justWords, setJustWords] = useState([]);
    const [hardMode, setHardMode] = useState(false);
    const [allWords, setAllWords] = useState(false);


    useEffect(() => {
        const handleKeyUp = (e) => {
            if (guessesRemaining === 0) {
                return;
            }

            const pressedKey = e.key;

            if (pressedKey === 'Backspace' || pressedKey === 'Del') {
                deleteLetter();
                return;
            }

            if (pressedKey === 'Enter') {
                checkGuess();
                return;
            }

            const lowerKey = pressedKey.toLowerCase();

            if (lowerKey.length === 1 && lowerKey.charCodeAt() >= 97 && lowerKey.charCodeAt() <= 122) {
                insertLetter(lowerKey);
            }
        };

        window.addEventListener('keyup', handleKeyUp);
        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [guessesRemaining, currentGuess, nextLetter]);

    function insertLetter(pressedKey) {
        if (nextLetter < NUMBER_OF_LETTERS) {
            const updatedGuess = [...currentGuess];
            updatedGuess[nextLetter] = pressedKey;
            setCurrentGuess(updatedGuess);
            setNextLetter(nextLetter + 1);
        }
    }

    function deleteLetter() {
        if (nextLetter > 0) {
            const updatedGuess = [...currentGuess];
            updatedGuess.pop();
            setCurrentGuess(updatedGuess);
            setNextLetter(nextLetter - 1);
        }
    }

    function reset() {
        setGuessesRemaining(NUMBER_OF_GUESSES);
        setCurrentGuess([]);
        setNextLetter(0);
        initBoard();
    }

    function initBoard() {
        const initialBoard = [];
        for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
          let row = [];
          for (let j = 0; j < NUMBER_OF_LETTERS; j++) {
            row.push({ letter: '', state: 'empty' });
          }
          initialBoard.push(row);
        }
        setBoard(initialBoard);
        getWord();
    }

    function getWord() {
        let rand = 0;
        if (hardMode) {
            rand = Math.floor(Math.random() * HARDWORDS.length);
            setRightGuessString(GUESSES[rand[0]]);
            setRightGuessWiki(GUESSES[rand][1]);
            setJustWords(toOneD(HARDWORDS));
        } else {
            rand = Math.floor(Math.random() * GUESSES.length);
            setRightGuessString(GUESSES[rand[0]]);
            setRightGuessWiki(GUESSES[rand][1]);
            setJustWords(toOneD(GUESSES));
        }
    }

    function toOneD(twoD) {
        let oneD = new Array(twoD.length);
        for (let i = 0; i < twoD.length; i++) {
            oneD[i] = twoD[i][0];
        }
        return oneD;
    }

  return (
    <div>
      <div id="game-board">
        {renderBoard()}
      </div>
      <button id="playAgainButton" onClick={reset} style={{ display: 'none' }}>
        Play Again
      </button>
      <div className="keyboard">
        {/* Keyboard rendering logic */}
      </div>
      <div>
            <input
                type="checkbox"
                id="hardModeButton"
                checked={hardMode}
                onChange={() => setHardMode(!hardMode)}
            />
            <label htmlFor="hardModeButton">Hard Mode</label>

            <input
                type="checkbox"
                id="dictionaryButton"
                checked={allWords}
                onChange={() => setAllWords(!allWords)}
            />
            <label htmlFor="dictionaryButton">All Words</label>
        </div>
    </div>
    );
}

function checkGuess() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let guessString = '';
    let rightGuess = Array.from(rightGuessString);

    for (const val of currentGuess) {
        guessString += val;
    }

    if (guessString.length != 5) {
        toastr.error("Not enough letters!");
        return;
    }

    if (allWords) { //Dictionary is on
        if (!justWords.includes(guessString) && !WORDS.includes(guessString)) {
            toastr.error("Word not in list!");
            return;
        }
    } else {
        if (!justWords.includes(guessString)) { //nothing is on
            toastr.error("Word not in list!");
            return;
        }
    }

    for (let i = 0; i < 5; i++) {
        let letterColor = '';
        let box = row.children[i];
        let letter = currentGuess[i];

        let letterPosition = rightGuess.indexOf(currentGuess[i]);
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = 'grey';
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (currentGuess[i] === rightGuess[i]) {
                // shade green 
                letterColor = 'green';
            } else {
                // shade box yellow
                letterColor = '#d9b502';
            }

            rightGuess[letterPosition] = "#";
        }

        let delay = 250 * i;
        setTimeout(() => {
            //flip box
            animateCSS(box, 'flipInX');
            //shade box
            box.style.backgroundColor = letterColor;
            shadeKeyBoard(letter, letterColor);
        }, delay)
    }

    if (guessString === rightGuessString) {
	    
	$("#wiki-link a").attr("href", rightGuessWiki);
   	$("#wiki-link a").text("Your word was: " + rightGuessString);

        $('#settingsModal').modal('hide');
        setTimeout(function() {
            $('#endScreenModal').modal('show');
            $('#playAgainButton').show();
        }, 1500);
        guessesRemaining = 0;
        return;
    } else {
	$("#wiki-link a").attr("href", rightGuessWiki);
   	$("#wiki-link a").text("Your word was: " + rightGuessString);
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            $('#settingsModal').modal('hide');
            setTimeout(function() {
                $('#lossScreenModal').modal('show');
                $('#playAgainButton').show();
            }, 1500);
        }
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === 'green') {
                return;
            }

            if (oldColor === '#d9b502' && color !== 'green') {
                return;
            }

            elem.style.backgroundColor = color;
            break;
        }
    }
}

$('#hardModeButton').click(function() {
    if (this.checked) {
        hardMode = true;
    } else {
        hardMode = false;
    }

});

$('#dictionaryButton').click(function() {
    if (this.checked) {
        allWords = true;
    } else {
        allWords = false;
    }
});

$('#newWordButton').click(function() {
    $('#endScreenModal').modal('hide');
    reset();
});

$('#tryAgainButton').click(function() {
    $('#lossScreenModal').modal('hide');
    reset();
});

$('#playAgainButton').click(function() {
    $('#playAgainButton').hide();
    reset();
});
         
$('.keyboard-button').click(function(){
    
    if (guessesRemaining === 0) {
        return;
    }
    
    inputLetter(String($(this).text()));
    
});

document.querySelectorAll("button").forEach( function(item) {
    item.addEventListener('focus', function() {
        this.blur();
    })
})

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

export default Runerdle;
