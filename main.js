const createPlayer = (playerName, playerMark) => {
  const name = playerName;
  const mark = playerMark;
  let score = 0;

  const getName = () => name;
  const getMark = () => mark;
  const getScore = () => score;
  const addScore = () => ++score;

  return { getName, getMark, getScore, addScore };
};

const gameBoard = (() => {
  const board = [];

  const square = '';

  const createBoard = () => {
    for (let i = 0; i < 9; i++) {
      board.push(square);
    }
  };

  const getBoard = () => {
    return board;
  };

  const markBoard = (idx) => {
    mark = gameController.getCurrentPlayer().getMark();
    board[idx] = mark;
    gameController.switchPlayer();
  };

  const clearBoard = () => {
    board.fill('');
  };

  return {
    createBoard,
    getBoard,
    markBoard,
    clearBoard,
  };
})();

const gameController = (() => {
  let gameActive = false;
  const getGameActive = () => gameActive;
  const toggleGameActive = () => (gameActive = !gameActive);

  const playerX = createPlayer('Player X', 'X');
  const playerO = createPlayer('Player O', 'O');

  const getPlayerX = () => playerX;
  const getPlayerO = () => playerO;

  let currentPlayer = playerX;
  const getCurrentPlayer = () => currentPlayer;

  const switchPlayer = () => {
    currentPlayer === playerX
      ? (currentPlayer = playerO)
      : (currentPlayer = playerX);

    gameDisplay.displayCurrentPlayer();
  };

  const winningCombinations = [
    // rows
    { combo: [0, 1, 2], strikeClass: 'strike-row-1' },
    { combo: [3, 4, 5], strikeClass: 'strike-row-2' },
    { combo: [6, 7, 8], strikeClass: 'strike-row-3' },
    //columns
    { combo: [0, 3, 6], strikeClass: 'strike-column-1' },
    { combo: [1, 4, 7], strikeClass: 'strike-column-2' },
    { combo: [2, 5, 8], strikeClass: 'strike-column-3' },
    //diagonal
    { combo: [0, 4, 8], strikeClass: 'strike-diagonal-1' },
    { combo: [2, 4, 6], strikeClass: 'strike-diagonal-2' },
  ];

  const checkWinner = () => {
    const strike = document.querySelector('.strike');

    for (const winningCombination of winningCombinations) {
      const { combo, strikeClass } = winningCombination;
      const squareValue0 = board[combo[0]];
      const squareValue1 = board[combo[1]];
      const squareValue2 = board[combo[2]];

      if (
        squareValue0 !== '' &&
        squareValue0 === squareValue1 &&
        squareValue0 === squareValue2
      ) {
        strike.classList.add(strikeClass);
        gameOver('win');
      }
    }

    //check for tie
    const allSquaresFilled = board.every((sqr) => sqr !== '');
    if (getGameActive() && allSquaresFilled) {
      gameOver('tie');
    }
  };

  const gameOver = (status) => {
    if (status === 'win') {
      switchPlayer();
      currentPlayer.addScore();
      gameDisplay.displayScores();
      gameDisplay.displayGameOver('win');
    } else if (status === 'tie') {
      gameDisplay.displayGameOver('tie');
    }

    toggleGameActive();
  };

  return {
    getGameActive,
    toggleGameActive,
    getPlayerX,
    getPlayerO,
    getCurrentPlayer,
    switchPlayer,
    checkWinner,
  };
})();

const gameDisplay = (() => {
  const startBtn = document.querySelector('.start-btn');
  startBtn.addEventListener('click', () => {
    gameBoard.createBoard();
    gameController.toggleGameActive();
    displayCurrentPlayer();
    startBtn.disabled = true;
  });

  const resetBtn = document.querySelector('.reset-btn');
  resetBtn.addEventListener('click', () => {
    location.reload();
  });

  const squareEl = document.querySelectorAll('.square');
  squareEl.forEach((sqr) => {
    sqr.addEventListener('click', (e) => {
      active = gameController.getGameActive();
      board = gameBoard.getBoard();
      index = e.target.getAttribute('data-index');
      currPlayer = gameController.getCurrentPlayer();

      if (active === true && board[index] === '') {
        e.target.textContent = currPlayer.getMark();
        gameBoard.markBoard(index);
        gameController.checkWinner();

        const clickSound = new Audio('assets/sounds/click.mp3');
        clickSound.play();

        if (currPlayer.getMark() === 'X') {
          e.target.classList.add('x-mark');
        } else if (currPlayer.getMark() === 'O') {
          e.target.classList.add('o-mark');
        }
      }
    });
  });

  const displayCurrentPlayer = () => {
    const currentPlayerEl = document.querySelector('.current-player');

    currentPlayerEl.textContent = `${gameController
      .getCurrentPlayer()
      .getName()}'s turn`;
  };

  const displayScores = () => {
    const playerXScoreEl = document.querySelector('.player-x-score');
    const playerOScoreEl = document.querySelector('.player-o-score');

    if (gameController.getPlayerX().getScore() !== 0) {
      playerXScoreEl.textContent = `Score: ${gameController
        .getPlayerX()
        .getScore()}`;
    }

    if (gameController.getPlayerO().getScore() !== 0) {
      playerOScoreEl.textContent = `Score: ${gameController
        .getPlayerO()
        .getScore()}`;
    }
  };

  const dialogEl = document.querySelector('dialog');

  const displayGameOver = (status) => {
    dialogEl.showModal();
    const messageEl = document.querySelector('.game-over');

    if (status === 'win') {
      messageEl.textContent = `${gameController
        .getCurrentPlayer()
        .getName()} wins!`;
    } else if (status === 'tie') {
      messageEl.textContent = "It's a tie!";
    }

    const gameOverSound = new Audio('assets/sounds/game-over.mp3');
    gameOverSound.play();
  };

  const nextMatchBtn = document.querySelector('.next-match-btn');
  nextMatchBtn.addEventListener('click', () => {
    dialogEl.close();
    gameBoard.clearBoard();
    gameController.toggleGameActive();

    squareEl.forEach((sqr) => {
      sqr.textContent = '';
      sqr.classList.remove('x-mark');
      sqr.classList.remove('o-mark');
    });

    //remove strike by removing the second class
    const strike = document.querySelector('.strike');
    const strikeClasses = strike.classList;
    if (strikeClasses.length === 2) {
      const secondStrikeClass = strikeClasses[1];
      strikeClasses.remove(secondStrikeClass);
    }
  });

  return {
    displayCurrentPlayer,
    displayScores,
    displayGameOver,
  };
})();
