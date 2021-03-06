
let myMusic= document.getElementById("music");
let s = undefined;

class SequenceCreator{
    constructor(){
        this.startTime = Date.now();
        this.sequence = {}
    }

    addSequence(element){
        let key = Math.floor(Date.now()-this.startTime)
        this.sequence[key] = element
        console.log(key)
    }

    saveFile(){
        let data = JSON.stringify(this.sequence)

        var myFile = new File([data], "all-of-the-world.json", {type: "text/plain;charset=utf-8"});
        saveAs(myFile);
    }
}


function onStart(){
    myMusic.play();
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