function Board(){
    const data = [["", "", ""], ["", "", ""], ["", "", ""]];

    const placeSymbol = function(position, symbol){
        const result = validatePosition(position);
        if(result){
            const{row, col} = result;
            data[row][col] = symbol;
            return true;
        }
    }

    const validatePosition = function(position){
        let int = parseInt(position);
        if(isNaN(int))
            return;
        if(!(int > -1 && int < 9))
            return;
        let col = int % 3;
        let row = Math.floor(int / 3);
        if(data[row][col]==="")
            return {row, col};
    }

    const getData = function(){
        return data;
    }

    return {placeSymbol, getData}
}

function Player(name, symbol){
    this.name = name;
    this.symbol = symbol;
    this.ownSymbol = function(symbol){
        if(this.symbol === symbol)
            return this;
    }
}

function Game(p1, p2){
    const board = Board();
    let currentPlayer = p1;
    let movesLeft = 9;
    const switchPlayer = function(){
        currentPlayer === p1? currentPlayer = p2:currentPlayer = p1;
    }
    const getCurrentPlayer = function(){return currentPlayer;}
    const play = function(position){
        const result = board.placeSymbol(position, getCurrentPlayer().symbol);
        if(result){
            movesLeft --;
            let {winner} = checkWinner();
            if(winner)
                return {message : `${winner.name} won!`};
            if(checkDraw())
                return {message : "the game ended in a draw"};
            switchPlayer();
        }
        return {continuePlaying : true}
    }
    const getBoardData = function(){
        return board.getData();
    }
    const checkWinner = function(){
        const boardData = getBoardData();
        for(let i =0; i < 3; i ++){
            let a = [];
            let b = [];
            for(let j =0; j < 3; j ++){
                a.push(boardData[i][j]);
                b.push(boardData[j][i]);
            }
            if(a[0] === a[1] && a[1] === a[2] && a[0]) 
                return {winner : p1.ownSymbol(a[0]) || p2.ownSymbol(a[0])};
            if(b[0] === b[1] && b[1] === b[2] && b[0]) 
                return {winner : p1.ownSymbol(b[0]) || p2.ownSymbol(b[0])}; 
        }
        let a = [];
        let b = [];
        for(let i = 0; i < 3; i ++){
            a.push(boardData[i][i]);
            b.push(boardData[i][2 - i]);
        }
        if(a[0] === a[1] && a[1] === a[2] && a[0]) 
            return {winner : p1.ownSymbol(a[0]) || p2.ownSymbol(a[0])};
        if(b[0] === b[1] && b[1] === b[2] && b[0]) 
            return {winner : p1.ownSymbol(b[0]) || p2.ownSymbol(b[0])}; 
        return {winner : null};
        
    }
    const checkDraw = function(){
        return movesLeft === 0;
    }
    return {play, getBoardData}
}


function ScreenControl(){
    const game = Game(new Player("player 1", "X"), new Player("player 2", "O"));
    const boardDOM = document.querySelector("#board");
    const restart = document.querySelector("#restart");

    const renderBoard = function(){
        boardDOM.innerHTML = "";
        let i = 0;
        for(let a =0; a < 3; a ++){
            for(let b = 0; b < 3; b ++){
                let tile = document.createElement("div");
                tile.dataset.index = i;
                tile.classList.add("tile");
                tile.innerText = game.getBoardData()[a][b];
                if(tile.innerText !== "")tile.classList.add("occupied");
                boardDOM.appendChild(tile);
                i ++;
            }
        }
    }
    const tileEventHandler = (e)=>{
        if(!e.target.dataset.index)return;
        const {continuePlaying, message} = game.play(e.target.dataset.index);
        renderBoard();
        if(!continuePlaying)
            endGame(message);
    }


    const endGame = function(message){
        const p = document.querySelector("#message");
        const modal = document.querySelector("#end");
        p.innerText = message;
        modal.showModal();
    }


    const startUp = function(){
        renderBoard();
        boardDOM.addEventListener("click",tileEventHandler);
        restart.addEventListener("click", ()=> window.location.reload());
    }
    startUp();
}


ScreenControl();