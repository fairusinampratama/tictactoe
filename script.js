const Gameboard = (() => {
    let board = [
        "", "", "",
        "", "", "",
        "", "", "",
    ];

    const getBoard = () => board;
    const setBoard = (index, value) => {
        if (board[index] === "") {
            board[index] = value;
        }
    };

    const resetBoard = () => {
        board = [
            "", "", "",
            "", "", "",
            "", "", "",  
        ]
    };

    return { getBoard, setBoard, resetBoard };
})();

const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    return { getName, getMarker };
}

const GameController = (() => {
    let player1, player2, currentPlayer;
    let isGameOver = false;

    const initGame = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        isGameOver = false;
        Gameboard.resetBoard();
    };

    const playTurn = (index) => {
        const resultTextElement = document.querySelector(".result");
        if (isGameOver) return;
    
        Gameboard.setBoard(index, currentPlayer.getMarker());
        if (checkWinner()) {
            resultTextElement.textContent = `${currentPlayer.getName()} wins!`;
            isGameOver = true;
        } else if (isBoardFull()) {
            resultTextElement.textContent = "It's a tie!";
            isGameOver = true;
        } else {
            switchPlayer();
        }
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        const playerTurnTextElement = document.querySelector(".playerTurn");
        playerTurnTextElement.textContent = `${currentPlayer.getName()}'s turn`;
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],    // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],    // columns
            [0, 4, 8], [2, 4, 6]                // diagonals
        ];

        return winningCombinations.some(combination => 
            board[combination[0]] === currentPlayer.getMarker() &&
            board[combination[0]] === board[combination[1]] &&
            board[combination[0]] === board[combination[2]]
        );
    };

    const isBoardFull = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    return { initGame, playTurn };
})();

const DisplayController = (() => {
  const boardCells = document.querySelectorAll(".cell");

  const render = () => {
    const board = Gameboard.getBoard();
    boardCells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const addEventListeners = () => {
    boardCells.forEach((cell, index) => {
      cell.addEventListener("click", () => {
        GameController.playTurn(index);
        render();
      });
    });
  };

  return { render, addEventListeners };
})();

GameController.initGame("Player One", "Player Two");
DisplayController.addEventListeners();


