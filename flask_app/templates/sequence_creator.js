

let s = undefined;

class SequenceCreator{
    constructor(){
        this.startTime = Date.now();
        this.sequence = {}
    }

    addSequence(element){
        let key = Math.floor(Date.now()-this.startTime)
        this.sequence[key] = element
    }

    saveFile(){
        let data = JSON.stringify(this.sequence)

        var myFile = new File([data], "1.json", {type: "text/plain;charset=utf-8"});
        saveAs(myFile);
    }
}


function onStart(){
    s = new SequenceCreator();
}

function stop(){
    s.saveFile()
    s = undefined;
}


document.onkeydown = function(e){
    if(e.keyCode == 32) { // SPACE
        if(s){
            s.addSequence('Square');
        }
    }
}