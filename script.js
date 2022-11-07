/*  
--------------------------------------
Game Module
-------------------------------------- 
*/


const game = (function() {

    let whosMove = 1;
    let array = [];

    const xSymbol = "x";
    const oSymbol = "o";
    
    function startNewGame() {
        resetArray();
        gameBoard.renderArray(array);
        player1.resetScore();
        player2.resetScore();
        display.displayScore();
        whosMove = 1;
    }
    
    function startNewRound() {
        whosMove = 1;
        resetArray();
        gameBoard.renderArray(array);
    }

    function processMove(cell) {

        if (isMoveAllowed(cell) == true) {
            addMoveToArray(cell);
            gameBoard.renderArray(array);
            assessArray();
            display.displayScore();
        }

    }

    function isMoveAllowed(cell) {
        if (cell.innerText == "") return true;
    }
    
    function addMoveToArray(cell) {
        array[cell.id] = whosMove;

        if (whosMove == 1) whosMove = 2;
            else whosMove = 1;
    }

    function assessArray() {
        checkLine("horizontal");
        checkLine("vertical");
        checkLine("diagonal");
        checkIfDraw();
    }

    function checkLine(line) {

        let a0, a1, a2, b0, b1, b2, c0, c1, c2;

        if (line == "horizontal") {
            a0 = 0;
            a1 = 1;
            a2 = 2;
            b0 = 3;
            b1 = 4;
            b2 = 5;
            c0 = 6;
            c1 = 7;
            c2 = 8;
        } else if (line == "vertical") {
            a0 = 0;
            a1 = 3;
            a2 = 6;
            b0 = 1;
            b1 = 4;
            b2 = 7;
            c0 = 3;
            c1 = 5;
            c2 = 8;
        } else if (line == "diagonal") {
            a0 = 0;
            a1 = 4;
            a2 = 8;
            b0 = 2;
            b1 = 4;
            b2 = 6;
            c0 = 0;
            c1 = 4;
            c2 = 8;
        }

        if ((array[a0]) && (array[a0] == array[a1]) && (array[a1] == array[a2])) {
            highlightLine(a0, a1, a2);
            declareRoundWinner(array[a0]);
        } 
        else if ((array[b0]) && (array[b0] == array[b1]) && (array[b1] == array[b2])) {
            highlightLine(b0, b1, b2);
            declareRoundWinner(array[b0]);
            
        } else if ((array[c0]) && (array[c0] == array[c1]) && (array[c1] == array[c2])) {
            highlightLine(c0, c1, c2);
            declareRoundWinner(array[c0]);
        }
    }

    function highlightLine(cell1, cell2, cell3) {
        const cells = [];
        cells.push(document.getElementById(cell1));
        cells.push(document.getElementById(cell2));
        cells.push(document.getElementById(cell3));
        cells.forEach(item => item.classList.add("gameboard-cell-highlighted"));
        setTimeout(() => {
            cells.forEach(item => item.classList.remove("gameboard-cell-highlighted"));
        }, 800);
    }

    function checkIfDraw() {
        if (!array.includes("")) declareRoundDraw(); 
    }
    
    function declareRoundWinner(arrayItem) {
        
        let roundWinner;
        
        if (arrayItem == 1) roundWinner = 1;
        else roundWinner = 2;
        
        addScoreToPlayer(roundWinner);
        
        setTimeout((arrayItem) => {
            if (assessScore()) declareGameWinner(roundWinner);
            else {
                popUp(`Player ${roundWinner} won this round!`)
                startNewRound();
            }
        }, 800);
    }

    function declareRoundDraw() {
        popUp("Draw!");
        startNewRound();
    }

    function resetArray() {
        for (let i = 0; i < 9; i++) array[i] = "";
    }

    function assessScore() {
        if ((player1.getScore() > 2) && (player1.getScore() > player2.getScore())) return 1;

        else if ((player2.getScore() > 2) && (player2.getScore() > player1.getScore())) return 1;
    }  

    function declareGameWinner(playerNumber) {
        popUp(`Player ${playerNumber} won the game!`);
        startNewGame();
    }

    function addScoreToPlayer(playerNumber) {
        if (playerNumber == 1) player1.addScore();
        else player2.addScore();
    }

    return {
        startNewGame,
        processMove,
        xSymbol,
        oSymbol
    };

})();

/*  
--------------------------------------
Game Board Module
-------------------------------------- 
*/

const gameBoard = (function() {

    function reset() {
        const allCells = document.querySelectorAll(".gameboard-cell");

        allCells.forEach(item => item.innerText = "");
    }
    
    function addEventListeners() {
        const allCells = document.querySelectorAll(".gameboard-cell");
        
        allCells.forEach(cell => cell.addEventListener("click", () => game.processMove(cell)));
    }

    function renderArray(array) {
        const allCells = document.querySelectorAll(".gameboard-cell");
        
        allCells.forEach((cell) => {
            if (array[cell.id] == 1) cell.innerText = game.xSymbol;
            else if (array[cell.id] == 2) cell.innerText = game.oSymbol;
            else cell.innerText = "";
        });
    }

    return {
        reset,
        addEventListeners,
        renderArray
    };
    
    
})();

/*  
--------------------------------------
Display Module
-------------------------------------- 
*/

const display = (function() {

    const player1Score = document.getElementById("player-1-score");
    const player2Score = document.getElementById("player-2-score");

    function displayScore() {
        player1Score.innerText = player1.getScore();
        player2Score.innerText = player2.getScore();
    }

    return {
        displayScore
    };

})();

/*  
--------------------------------------
Player Object
-------------------------------------- 
*/

const createPlayer = () => {
    let score = 0;

    function addScore() {
        score += 1;
    }

    function getScore() {
        return score;
    }

    function resetScore() {
        score = 0;
    }

    return {
        getScore,
        addScore,
        resetScore
    };
} 

/*  
--------------------------------------
Pop Up
-------------------------------------- 
*/

function popUp(message) {
    // const popUpContainer = document.getElementById("popUp-container");
    // popUpContainer.style.display = "flex";

    const popUpContainer = document.createElement("div");
    popUpContainer.innerHTML = `
        <div id="popUp-messageWindow">
            <h1 id="popUp-message">${message}</h1>
        </div>
    `;
    popUpContainer.id = "popUp-container";

    const section = document.querySelector("section");
    section.appendChild(popUpContainer);

    setTimeout(() => {popUpContainer.remove()}, 2300);
}

/*  
--------------------------------------
Reset Button
-------------------------------------- 
*/

const resetButton = (function() {
    const button = document.getElementById("resetButton");
    button.addEventListener("click", buttonClicked);

    function buttonClicked() {
        game.startNewGame();
    }

})();

/*  
--------------------------------------
Invocations
-------------------------------------- 
*/

let player1 = createPlayer();
let player2 = createPlayer();
gameBoard.addEventListeners();
game.startNewGame();
