
class Square{
    static allSquares = [];
    static mSize = [60, 60];
    static tickerLimit = 2;

    constructor(position, size, color, growthFactor){
        this.position = [position[0]+parseInt(Square.mSize[0]/2), position[1]+parseInt(Square.mSize[1]/2)];
        this.size = size;
        this.growthFactor = growthFactor;
        this.color = color;
        this.initColor = color;
        this.ticker = 0;
        this.grow_ticker = 0;
        this.activated = false;
        this.grown = false;
        this.startTime = undefined;
        Square.allSquares.push(this);
    }

    growSquare(){
        this.size = this.size[0]<Square.mSize[0] ? [this.size[0]+this.growthFactor, this.size[1]+this.growthFactor] : this.size
        this.position = [this.position[0]-parseInt(this.growthFactor/2), this.position[1]-parseInt(this.growthFactor/2)]
        return this
    }



    fadeSquare(){
        let arr = [];
        let sum = 0;
        for (let i =0; i < this.color.length; i++){
            let col = this.color[i]-this.initColor[i]/60;
            arr.push(parseInt(col))
            sum+=col
        }
        this.color = arr;
        if (sum < 0){
            Square.removeSquare(this);
            return null;
        }
        return this
    }

    calcPoints(){
        return Math.max(20, parseInt((1000-(Date.now()-this.startTime))/5));
    }


    updateSquare(){
        if(this.size[0] < Square.mSize[0]){
            this.growSquare()
            return this
        }
        else{
            if (!(this.grown)){
                this.startTime = Date.now();
                this.grown = true;
            }
            if(this.ticker < Square.tickerLimit){
                this.ticker++;
                return this
            }
            else{
                return this.fadeSquare();
            }
        }
        
    }


    pointInsideSquare(point){
        return (this.position[0] < point[0]  && point[0] < this.position[0]+this.size[0] &&  this.position[1] < point[1] && point[1] < this.position[1]+this.size[1])
    }

    static getAllSquares(){
        return Square.allSquares;
    }


    static removeSquare(square){
        let allSquares = Square.getAllSquares()
        for(let i = 0; i < allSquares.length; i++){
            if(square === allSquares[i]){
                Square.allSquares.splice(i, 1)
                break
            }
        }
    }

}

class Text{
    static allText = [];

    constructor(text, position){
        this.position = position;
        this.text = text;
        this.life = 0;
        Text.allText.push(this);
    }

    checkRemoval(){
        this.life++;
        if (this.life > 30){
            Text.removeText(this)
        }
    }

    static getAllText(){
        return Text.allText;
    }



    static removeText(text){
        let allText = Text.getAllText()
        for(let i = 0; i < allText.length; i++){
            if(text === allText[i]){
                Text.allText.splice(i, 1)
                break
            }
        }
    }
}



class Sequencer{
    constructor(){
        this.sequence = [];
        this.keyval = {};
        this.starttime = undefined;
        this.running = false;
    }

    static quickSort(arr){
        if (arr.length <= 1){
            return arr
        }
        let lowerThan = [];
        let upperThan = [];
        let pivot = arr[0];
        for(let i =1; i < arr.length; i++){
            if (arr[i] < pivot){
                lowerThan.push(arr[i])
            }
            else{
                upperThan.push(arr[i])
            }
        }
        return [...Sequencer.quickSort(lowerThan), ...[pivot], ...Sequencer.quickSort(upperThan)]
    }

    sortSequence(){
        this.sequence=Sequencer.quickSort(this.sequence);
    }

    static binaryInsert(arr, start, end, value){
        if(start == end){
            arr.splice(start, 0, value)
        }
        let mid = Math.floor(start+end/2)
        if (arr[mid] < value){
            Sequencer.binaryInsert(arr, start, mid, value)
        }
        else if(arr[mid] > value){
            Sequencer.binaryInsert(arr, mid, end, value)
        }
        else{
            arr.splice(mid, 0, value)
        }
    }

    addItemToSequence(time, item){
        Sequencer.binaryInsert(this.sequence, 0, this.sequence.length-1, time)
        this.keyval[time] = item
    }

    getNext(){
        if ((Date.now()-this.starttime) >= this.sequence[0]){
            let key = this.sequence.shift();
            return this.keyval[key]
        }
        return null;
    }
    start(){
        this.sortSequence();
        this.running = true;
        this.starttime = Date.now();
    }

    isRunning(){
        return this.running;
    }

    loadSequence(seq){
        
        this.keyval = seq
        for (let key in seq){
            this.sequence.push(parseInt(key))
        }
        this.sortSequence()
    }

    clearSequence(){
        this.sequence = [];
        this.keyval = {};
        this.running = false;
    }
}