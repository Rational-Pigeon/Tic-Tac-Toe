// ###### Datatypes #######

// Game : object constructor
// attrubutes:
//  - turn : boolean - true is O and false is X
//  - round : int
//  - turn_counter : int
//  - getPlayerInput() - one of: int[0-8] or getPlayerInput() interp.:
//    returns a int[0-8] after checking with board for validity
//  + playTurn() : null - plays one full turn
//  + gameOVer(hasWinner) : null - announces the winner or tie, updates score, 
//                        gives prompt for play again.
//  + newGame() : null - resets board, clears screen and updates visual display of scores.
function Game(player1, player2) {
    this.turn = true;
    this.round = 1;
    this.turn_counter = 0;

    this.getPlayerInput = function() {
        let player_input;
        do {
            player_input = parseInt(prompt(`${this.turn ? player1.getName() : player2.getName()}, enter a position (0-8):`));
        } while (isNaN(player_input) || player_input < 0 || player_input > 8 || !Gameboard.isEmpty(player_input));
        return player_input;
    };

    this.playTurn = function() {
        while (true) {
            const player_input = this.getPlayerInput();
            Gameboard.updateBoard(this.turn, player_input);

            if (Gameboard.checkWin()) {
                this.gameOver(true);
                break;
            } else if (this.turn_counter === 8) {
                this.gameOver(false);
                break;
            } else {
                this.turn = !this.turn;
                this.turn_counter++;
            }
        }
    };

    this.gameOver = function(hasWinner) {
        if (hasWinner) {
            const winner = this.turn ? player1 : player2;
            winner.incrementScore();
            alert(`${winner.getName()} wins!`);
        } else {
            alert("It's a tie!");
        }
        this.newGame();
    };

    this.newGame = function() {
        Gameboard.resetBoard();
        this.turn = true;
        this.turn_counter = 0;
        this.round++;
        const playAgain = confirm("Do you want to play again?");
        if (playAgain) {
            this.playTurn();
        } else {
            alert("Thank you for playing!");
        }
    };
}



// Gameboard
// - IIFE
// attributes:
//  - gameboard : Array of 1 of 3 ("" (empty), "X", "O");
//  + resetBoard() : null - sets all elements of gameboard to "";
//  + isEmpty(index:int[0-8]) : boolean - checks wether a given index of gameboard is empty
//  + updateBoard(turn:bool, player_input:int[0-8]) : null
//  + checkWin() : boolean
//  + boardFull() : boolean

const Gameboard = (function() {
    const gameboard = Array(9).fill("");

    const resetBoard = () => {
        for (let i = 0; i < 9; i++) {
            gameboard[i] = "";
        }
    }

    const isEmpty = (index) => { return !gameboard[index] };

    const updateBoard = (turn, player_input) => {
        gameboard[player_input] = turn ? "O" : "X";
    }

    const checkWin = () => {
        const winningCombinations = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Diagonal from top-left to bottom-right
            [2, 4, 6]  // Diagonal from top-right to bottom-left
        ];

        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (gameboard[a] && gameboard[a] === gameboard[b] && gameboard[a] === gameboard[c]) {
                return true;
            }
        }
        return false;
    }
    return {
        gameboard,
        resetBoard,
        isEmpty,
        updateBoard,
        checkWin
    };
})();

// Player : object constructor
// attributes:
//  - name : string
//  - score : int
//  + getName() : string
//  + getScore() : int
//  +incrementScore() : null - score++
function Player(name) {
    this.name = name;
    this.score = 0;

    this.getName = function() {
        return this.name;
    };

    this.getScore = function() {
        return this.score;
    };

    this.incrementScore = function() {
        this.score++;
    };
}

const player1 = new Player("Alice");
const player2 = new Player("Bob");
const game = new Game(player1, player2);
game.playTurn();
