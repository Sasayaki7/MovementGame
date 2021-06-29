class Sequencer{
    constructor(){
        this.sequence = [];
        this.keyval = {};
        this.starttime = undefined;
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
            key = this.sequence.shift();
            return this.keyval[key]
        }
        return None
    }
    start(){
        this.sortSequence();
        this.starttime = Date.now();
    }

    loadSequence(fileName){

    }

    clearSequence(){
        this.sequence = [];
        this.keyval = {};
    }
}