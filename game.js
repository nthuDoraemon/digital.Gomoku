const B_SIZE = 14;
let board = [];
let currentPlayer = 'B';
let gameOver = true; 
let stats = {
    'B': { wins: 0, losses: 0, draws: 0 },
    'W': { wins: 0, losses: 0, draws: 0 }
};
let timerInterval;
let seconds = 0;

function initBoard() {
    let boardContainer = document.getElementById('board');
    boardContainer.innerHTML = '';

    for (let i = 0; i < B_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < B_SIZE; j++) {
            board[i][j] = '-';
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            cell.addEventListener('click', function() {
                if (!gameOver) {
                    handleClick(i, j);
                }
            });

            if (!gameOver) {
                cell.addEventListener('mouseover', function() {
                    if (board[i][j] !== '-') {
                        cell.style.border = '5px solid red';
                    } else {
                        cell.style.border = '5px solid green';
                    }
                });

                cell.addEventListener('mouseout', function() {
                    cell.style.border = '1.5px solid black';
                });
            }

            boardContainer.appendChild(cell);
        }
    }
}

function printBoard() {
    let table = document.getElementById('board');
    for (let i = 0; i < B_SIZE; i++) {
        for (let j = 0; j < B_SIZE; j++) {
            let cell = table.rows[i].cells[j];
            cell.textContent = board[i][j];
        }
    }
}

function updateStats(player, result) {
    if (player !== 'draw') {
        stats[player][result]++;
    } else {
        stats['B'].draws++;
        stats['W'].draws++;
    }
}

function displayStats() {
    const statsContainer = document.getElementById('stats');
    const tableWidth = 5;
    const gameTime = updateTimerDisplay(); 
    statsContainer.innerHTML = `
    <table>
        <tr>
            <th></th>
            <th>勝利</th>
            <th>失敗</th>
            <th>平局</th>
        </tr>
        <tr>
            <td>B</td>
            <td>${stats['B'].wins}</td>
            <td>${stats['B'].losses}</td>
            <td>${stats['B'].draws}</td>
        </tr>
        <tr>
            <td>W</td>
            <td>${stats['W'].wins}</td>
            <td>${stats['W'].losses}</td>
            <td>${stats['W'].draws}</td>
        </tr>
        <tr>
            <th>用時</th> 
            <td colspan="${tableWidth}">${gameTime}</td> 
        </tr>
    </table>
`;
}

function isDraw() {
    for (let i = 0; i < B_SIZE; i++) {
        for (let j = 0; j < B_SIZE; j++) {
            if (board[i][j] === '-') {
                return false;
            }
        }
    }
    return true;
}

function checkWin(row, col, player) {
    // 水平方向
    let count = 0;
    for (let i = Math.max(0, col - 4); i <= Math.min(B_SIZE - 1, col + 4); i++) {
        if (board[row][i] === player) {
            count++;
            if (count === 5) return true;
        } else {
            count = 0;
        }
    }

    // 垂直方向
    count = 0;
    for (let i = Math.max(0, row - 4); i <= Math.min(B_SIZE - 1, row + 4); i++) {
        if (board[i][col] === player) {
            count++;
            if (count === 5) return true;
        } else {
            count = 0;
        }
    }

    // 主對角方向
    count = 0;
    for (let i = -4; i <= 4; i++) {
        let r = row + i;
        let c = col + i;
        if (r >= 0 && r < B_SIZE && c >= 0 && c < B_SIZE) {
            if (board[r][c] === player) {
                count++;
                if (count === 5) return true;
            } else {
                count = 0;
            }
        }
    }

    // 副對角方向
    count = 0;
    for (let i = -4; i <= 4; i++) {
        let r = row + i;
        let c = col - i;
        if (r >= 0 && r < B_SIZE && c >= 0 && c < B_SIZE) {
            if (board[r][c] === player) {
                count++;
                if (count === 5) return true;
            } else {
                count = 0;
            }
        }
    }

    return false;
}

function handleClick(row, col) {
    if (board[row][col] === '-') {
        board[row][col] = currentPlayer;
        let cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }

        if (currentPlayer === 'B') {
            let blackPiece = document.createElement('div');
            blackPiece.classList.add('black');
            cell.appendChild(blackPiece);
        } else {
            let whitePiece = document.createElement('div');
            whitePiece.classList.add('white');
            cell.appendChild(whitePiece);
        }

        if (!gameOver && !timerInterval) {
            startTimer();
        }

        if (checkWin(row, col, currentPlayer)) {
            document.getElementById('winner').textContent = `${currentPlayer} wins!`;
            document.getElementById('winner').style.display = 'block';
            updateStats(currentPlayer, 'wins');
            updateStats(currentPlayer === 'B' ? 'W' : 'B', 'losses');
            displayStats();
            gameOver = true;
            clearInterval(timerInterval); 
            document.getElementById('button').style.display = 'block';
        } else {
            currentPlayer = (currentPlayer === 'B') ? 'W' : 'B';
            document.getElementById('currentPlayer').textContent = `${currentPlayer === 'B' ? "Black's Turn" : "White's Turn"}`;
            
            updatePlayerIcon(currentPlayer === 'B');
        }
    } else {
        console.log("Invalid move. Try again.");
    }

    if (isDraw()) {
        document.getElementById('winner').textContent = "It's a draw!";
        document.getElementById('winner').style.display = 'block';
        updateStats(currentPlayer, 'draws');
        displayStats();
        clearInterval(timerInterval); 
    }
}

function updatePlayerIcon(isBlackTurn) {
    var playerIcon = document.getElementById('playerIcon');
    playerIcon.innerHTML = ''; 

    if (isBlackTurn) {
        let blackPiece = document.createElement('div');
        blackPiece.classList.add('black');
        playerIcon.appendChild(blackPiece);
    } else {
        let whitePiece = document.createElement('div');
        whitePiece.classList.add('white');
        playerIcon.appendChild(whitePiece);
    }
}

function newGame() {
    document.getElementById('button').style.display = 'none';
    clearInterval(timerInterval); // 清除之前的計時器
    seconds = 0; // 重置秒數
    startTimer(); // 啟動新的計時器
    console.log("New game started!"); 
    gameOver = false;
    currentPlayer = 'B';
    updatePlayerIcon(currentPlayer === 'B');
    document.querySelector('.game-info2').classList.add('show-info');
    document.getElementById('currentPlayer').textContent = `${currentPlayer === 'B' ? "Black's Turn" : "White's Turn"}`;
    document.getElementById('winner').textContent = '';
    initBoard(); 
    printBoard();
    displayStats();
    if (!gameOver) {
        addHoverListeners();
    }

}
function addHoverListeners() {
    let cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        let row = parseInt(cell.getAttribute('data-row'));
        let col = parseInt(cell.getAttribute('data-col'));

        cell.addEventListener('mouseover', function() {
            if (!gameOver) {
                if (board[row][col] !== '-') {
                    cell.style.border = '5px solid red';
                } else {
                    cell.style.border = '5px solid green';
                }
            }
        });

        cell.addEventListener('mouseout', function() {
            if (!gameOver) {
                cell.style.border = '1.5px solid black';
            }
        });
    });
}

function removeHoverListeners() {
    let cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.removeEventListener('mouseover', handleMouseOver);
        cell.removeEventListener('mouseout', handleMouseOut);
    });
}
function startTimer() {
    timerInterval = setInterval(updateTimerDisplay, 1000);
}


function updateTimerDisplay() {
    seconds++;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('timer-text').textContent = `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;

}

function pad(val) {
    return val < 10 ? '0' + val : val;
}

window.onload = function() {
    initBoard();
    printBoard();
    displayStats();
    startTimer(); 
    document.getElementById('button').addEventListener('click', newGame);
};
