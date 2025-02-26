const GameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const setBoard = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
    }
  };

  const resetBoard = () => {
    board.fill("");
  };

  return { getBoard, setBoard, resetBoard };
})();

const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;

  return { getName, getMarker };
};

const GameController = (() => {
  let player1, player2, currentPlayer;
  let isGameOver;

  const initGame = (name1, name2) => {
    player1 = Player(name1, "X");
    player2 = Player(name2, "O");
    currentPlayer = player1;
    isGameOver = false;
    GameBoard.resetBoard();
  };

  const playTurn = (index) => {
    if (isGameOver) return "Game is already over!";

    if (GameBoard.getBoard()[index] !== "") {
      return "This spot is already taken! Choose another.";
    }

    GameBoard.setBoard(index, currentPlayer.getMarker());

    const gameStatus = checkWin();
    if (gameStatus === 1 || gameStatus === 2) {
      isGameOver = true;
      return `${currentPlayer.getName()} wins!`;
    }
    if (gameStatus === 3) {
      isGameOver = true;
      return "The game ends in a draw!";
    }

    switchPlayer();
    return `Next turn: ${currentPlayer.getName()}`;
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWin = () => {
    const board = GameBoard.getBoard();

    const winningCombination = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombination.length; i++) {
      let [a, b, c] = winningCombination[i];
      if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
        return board[a] === "X" ? 1 : 2;
      }
    }

    return board.includes("") ? 0 : 3;
  };

  return { initGame, playTurn };
})();

const DisplayController = (() => {
  const messageText = document.getElementById("message-text");
  const buttonRestart = document.getElementById("button-restart");
  const gameSquare = document.querySelectorAll(".game-square");
  const formBoard = document.getElementById("form-board");
  const gameBoard = document.getElementById("game-board");

  const valueFormBoard = () => {
    const formData = new FormData(formBoard);
    const getPlayerOneName = () => formData.get("player-one-input");
    const getPlayerTwoName = () => formData.get("player-two-input");

    return { getPlayerOneName, getPlayerTwoName };
  };

  const updateBoard = () => {
    const board = GameBoard.getBoard();
    gameSquare.forEach((square, index) => {
      square.setAttribute("data-symbol", board[index]);
    });
  };

  const handleSquareClick = (event) => {
    const index = event.target.getAttribute("data-position");
    if (index !== undefined) {
      const result = GameController.playTurn(Number(index));
      console.log(result);
      updateBoard();
      updateMessage(result);
    }
  };

  const updateMessage = (msg) => {
    messageText.textContent = msg;
  };

  const init = () => {
    const startGame = () => {
      const players = valueFormBoard();
      GameController.initGame(
        players.getPlayerOneName(),
        players.getPlayerTwoName()
      );
      updateBoard();
    };

    formBoard.addEventListener("submit", (event) => {
      event.preventDefault();
      formBoard.style.display = "none";
      gameBoard.style.display = "flex";
      startGame();
    });

    buttonRestart.addEventListener("click", () => {
      formBoard.style.display = "flex";
      gameBoard.style.display = "none";
      updateMessage("");
      formBoard.reset();
    });

    gameSquare.forEach((square) => {
      square.addEventListener("click", handleSquareClick);
    });

    startGame();
  };

  return { init, updateMessage, updateBoard };
})();

document.addEventListener("DOMContentLoaded", DisplayController.init);
