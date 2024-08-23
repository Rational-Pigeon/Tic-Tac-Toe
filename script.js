// ###### Datatypes #######

// Game : object constructor
// attrubutes:
//  -turn : boolean - true is O and false is X
//  -round : int
//  -turn_counter : int
//  -isGameOver : boolean
//  -getPlayerInput() - one of: int[0-8] or getPlayerInput() interp.:
//   returns a int[0-8] after checking with board for validity
//  +playTurn() : null - plays one full turn
//  +gameOVer(hasWinner) : null - announces the winner or tie, updates score, 
//                       gives prompt for play again.
//  +newGame() : null - resets board, clears screen and updates visual display of scores.
function Game(player1, player2) {
    this.turn = true;
    this.round = 1;
    this.turn_counter = 0;
    this.isGameOver = false;

    this.playTurn = (index) => {
        if (this.isGameOver) return;

        if (Gameboard.isEmpty(index)) {
            Gameboard.updateBoard(this.turn, index);
            displayController.updateBoard(index, this.turn ? "O" : "X");

            if (Gameboard.checkWin()) {
                this.gameOver(true);
            } else if (this.turn_counter === 8) {
                this.gameOver(false);
            } else {
                this.turn = !this.turn;
                this.turn_counter++;
                displayController.updateMessage(`${this.turn ? player1.getName() : player2.getName()}'s turn`);
            }
        }
    };

    this.gameOver = function(hasWinner) {
        this.isGameOver = true;
        if (hasWinner) {
            const winner = this.turn ? player1 : player2;
            winner.incrementScore();
            displayController.updateMessage(`${winner.getName()} wins!`);
            displayController.updateScores(player1.getScore(), player2.getScore());
        } else {
            displayController.updateMessage("It's a tie!");
        }
        displayController.disableBoard();
    };

    this.newGame = function() {
        Gameboard.resetBoard();
        this.turn = true;
        this.turn_counter = 0;
        this.round++;
        this.isGameOver = false;
        displayController.resetBoard();
        displayController.updateMessage(`${player1.getName()}'s turn`);
        // Update round display
        displayController.updateRound(this.round);
    };
}



// Gameboard : IIFE
// attributes:
//  -gameboard : Array of 1 of 3 ("" (empty), "X", "O");
//  +resetBoard() : null - sets all elements of gameboard to "";
//  +isEmpty(index:int[0-8]) : boolean - checks wether a given index of gameboard is empty
//  +updateBoard(turn:bool, player_input:int[0-8]) : null
//  +checkWin() : boolean

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
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
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
        resetBoard,
        isEmpty,
        updateBoard,
        checkWin
    };
})();

// Player : object constructor
// attributes:
//  -name : string
//  -score : int
//  +getName() : string
//  +getScore() : int
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

// displayController : IIFE
// attributes:
//  -cells : NodeList
//  -messageDiv : DOM element
//  -restartButton : DOM element
//  +updateBoard(index:int[0-8], symbol:string) : null
//  +updateMessage(message:string) : null
//  +resetBoard() : null
//  +disableBoard() : null
//  +updateScores(player1Score:int, player2Score:int) : null
//  +updateRound(round:int) : null - updates the displayed round number
const displayController = (function() {
    const cells = document.querySelectorAll('.cell');
    const messageDiv = document.getElementById('message');
    const restartButton = document.getElementById('restart');
    const player1ScoreSpan = document.getElementById('player1Score');
    const player2ScoreSpan = document.getElementById('player2Score');
    const roundSpan = document.getElementById('round');

    cells.forEach(cell => {
        cell.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            game.playTurn(parseInt(index));
        });
    });

    restartButton.addEventListener('click', () => {
        game.newGame();
    });

    const updateBoard = (index, symbol) => {
        const cell = cells[index];
        cell.textContent = symbol;
        cell.classList.add('disabled');
        cell.classList.add(symbol);  // Adds class "X" or "O" for styling
    }

    const updateMessage = (message) => {
        messageDiv.textContent = message;
    }

    const resetBoard = () => {
        cells.forEach(cell => {
            cell.textContent = "";
            cell.className = "cell";  // Resets classes
        });
    }

    const disableBoard = () => {
        cells.forEach(cell => {
            cell.classList.add('disabled');
        });
    }

    // New methods for updating scores and round
    const updateScores = (player1Score, player2Score) => {
        player1ScoreSpan.textContent = `Player 1 (O) Score: ${player1Score}`;
        player2ScoreSpan.textContent = `Player 2 (X) Score: ${player2Score}`;
    };

    const updateRound = (round) => {
        roundSpan.textContent = `Round: ${round}`;
    };

    return {
        updateBoard,
        updateMessage,
        resetBoard,
        disableBoard,
        updateScores,
        updateRound
    };
})();


const player1 = new Player("Player1 (O)");
const player2 = new Player("Player2 (X)");
const game = new Game(player1, player2);
game.playTurn();
