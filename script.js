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
        getBoard
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

    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer == players[0] ? players[1] : players[0]
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s Turn`)
    };

    const playRound = (row, column) => {
        console.log(`Marking Field with ${getActivePlayer().name}'s token`);
        board.dropToken(row, column, getActivePlayer().token);

        // if (board.dropToken(row, column, getActivePlayer().token)){
        //     console.log('Invalid move!');
        //     return printNewRound();
        // }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };


}

//const game = GameController();


function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        
        boardDiv.textContent = '';

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

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
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();
}

ScreenController()