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
}

function Game(p1, p2){
    const board = Board();
    let currentPlayer = p1;
    const switchPlayer = function(){
        currentPlayer === p1? currentPlayer = p2:currentPlayer = p1;
    }
    const getCurrentPlayer = function(){return currentPlayer;}
    const play = function(position){
        const result = board.placeSymbol(position, getCurrentPlayer().symbol);
        if(result){
            switchPlayer();
        }
    }
    const getBoardData = function(){
        return board.getData();
    }

    return {play, getBoardData}
}


function ScreenControl(){
    const game = Game(new Player("player 1", "X"), new Player("player 2", "O"));
    const boardDOM = document.querySelector("#board");


    const renderBoard = function(){
        boardDOM.innerHTML = "";
        let i = 0;
        for(let a =0; a < 3; a ++){
            for(let b = 0; b < 3; b ++){
                let tile = document.createElement("div");
                tile.dataset.index = i;
                tile.classList.add("tile");
                tile.innerText = game.getBoardData()[a][b];
                boardDOM.appendChild(tile);
                i ++;
            }
        }
    }
    const addEventListener = function(){
        boardDOM.addEventListener("click", (e)=>{
            if(!e.target.dataset.index)return;
            game.play(e.target.dataset.index);
            renderBoard();
        })
    }

    renderBoard();
    addEventListener();
}


ScreenControl();