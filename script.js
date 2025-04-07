function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];


    /*
    **Create GameBoard 2d array
    */
    for (let i=0;i<rows;i++){
        board[i] = [];
        for (let j=0; j<columns;j++){
            board[i].push(Cell());
        }
    };

    const getBoard = () => board;

    const resetBoard = () => {
        for (let i=0;i<rows;i++){
            board[i] = [];
            for (let j=0; j<columns;j++){
                board[i].push(Cell());
            }
        };
    };

    const dropToken = (row, column, player) => {
        if (board[row][column].getValue() != 0) return false;

        board[row][column].addToken(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
      };

      return {
        dropToken,
        printBoard,
        getBoard,
        resetBoard
      }


}

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {
        addToken,
        getValue
      };
}


function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();
    const boardArray = board.getBoard();

    const players = [
        {
            name: playerOneName,
            token: 'X',
            score: parseInt(localStorage.getItem(playerOneName) || 0)
        },
        {
            name: playerTwoName,
            token: 'O',
            score: parseInt(localStorage.getItem(playerTwoName) || 0)
        },
        {
            name: 'TIE'
        }
    ];
    const winConditions = [
        [[0,0],[0,1],[0,2]], //row1
        [[1,0],[1,1],[1,2]], //row2
        [[2,0],[2,1],[2,2]], //row3
        [[0,0],[1,0],[2,0]], //column1
        [[0,1],[1,1],[2,1]], //column2
        [[0,2],[1,2],[2,2]], //column3
        [[0,0],[1,1],[2,2]], //diognal1
        [[0,2],[1,1],[2,0]] //diognal2
    ]

    let activePlayer = players[0];
    let movesCount = 0;
    let gameWinner;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer == players[0] ? players[1] : players[0]
    };

    const getActivePlayer = () => activePlayer;

    const getPlayers = () => players;

    const getGameWinner = () => gameWinner;

    const resetGameWinner = () => gameWinner = undefined;

    const resetGame = () => {
        resetGameWinner();
        board.resetBoard();
        localStorage.clear();
    }

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s Turn`)
    };

    const playRound = (row, column) => {
            
        if (boardArray[row][column].getValue() != 0){
            printNewRound();
        } else {

        console.log(`Marking Field with ${getActivePlayer().name}'s token`);
        board.dropToken(row, column, getActivePlayer().token);

        for (const win of winConditions){
            if (checkWinConditions(boardArray, win)){
              board.resetBoard();
              movesCount = 0;
              gameWinner = activePlayer;
              activePlayer.score += 1;
              localStorage.setItem(activePlayer.name, activePlayer.score);
              activePlayer = players[0];
              return printNewRound();
            }
        }

        if (movesCount == 8) {
            board.resetBoard();
            //activePlayer.score += 1;
            gameWinner = players[2];
            activePlayer = players[0];
            movesCount = 0;
            return printNewRound();
        }

        // if (board.dropToken(row, column, getActivePlayer().token)){
        //     console.log('Invalid move!');
        //     return printNewRound();
        // }
        movesCount += 1;
        switchPlayerTurn();
        printNewRound();
        }
    };

    /*
    ** helper function to check the win conditions
    */
    function checkWinConditions(board, winConditions){
        const [r1, c1] = winConditions[0];
        const [r2, c2] = winConditions[1];
        const [r3, c3] = winConditions[2];

        const val1 = board[r1][c1].getValue();
        const val2 = board[r2][c2].getValue();
        const val3 = board[r3][c3].getValue();

        return val1 == val2 && val2 == val3 && val1 != 0;
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        getPlayers,
        getGameWinner,
        resetGameWinner,
        resetGame
    };


}

//const game = GameController();


function ScreenController() {
    const game = GameController('Mārcis', 'Krista');
    const gameBoard = document.querySelector('.game');
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const p1ScoreDiv = document.querySelector('.p1Score');
    const p2ScoreDiv = document.querySelector('.p2Score');
    const newGameDiv = document.querySelector('.newGame');
    const winner = document.querySelector('.winner');
    const newGameBtn = document.querySelector('.newGameBtn');
    const resetGameBtn = document.querySelector('.resetGameBtn');
    

    const updateScreen = () => {
        
        boardDiv.textContent = '';

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const players = game.getPlayers();
        const gameWinner = game.getGameWinner();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        p1ScoreDiv.textContent = `${players[0].name} score: ${players[0].score}`;
        p2ScoreDiv.textContent = `${players[1].name} score: ${players[1].score}`;
        if (gameWinner == undefined) {
            board.forEach((row, rowIndex) => {
                row.forEach((cell, columnIndex) => {
                    const cellButton = document.createElement('button');
                    cellButton.classList.add('cell');

                    cellButton.dataset.row = rowIndex;
                    cellButton.dataset.column = columnIndex;
                    if (cell.getValue() == 0){
                        cellButton.textContent = '';
                    }else {
                        cellButton.textContent = cell.getValue();
                    }
                    
                    boardDiv.appendChild(cellButton);
                })
            })
        } else {
            newGame();
        }
    }


    const newGame = () => {
        const gameWinner = game.getGameWinner();

        gameBoard.style.display = 'none';
        newGameDiv.style.display = 'flex';

        if (gameWinner != undefined){
            if (gameWinner.name != 'TIE') {
                winner.innerText = `Winner of the game is:\n${gameWinner.name}`;
                game.resetGameWinner();
            } else {
                winner.innerText = `Last game was tied!`;
                game.resetGameWinner();
            }
        }
    }

    function newGameBtnHandler() {
        gameBoard.style.display = 'block';
        newGameDiv.style.display = 'none';
        updateScreen();
    }

    function resetGameBtnHandler() {
        game.resetGame();
        newGame();
        location.reload();
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener('click', clickHandlerBoard);
    newGameBtn.addEventListener('click', newGameBtnHandler);
    resetGameBtn.addEventListener('click', resetGameBtnHandler);

    newGame();
}

ScreenController()