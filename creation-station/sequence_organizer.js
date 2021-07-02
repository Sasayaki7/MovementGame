
let myMusic= document.getElementById("music");
let s = undefined;

class SequenceCreator{
    constructor(){
        this.startTime = Date.now();
        this.sequence = {}
    }

    addSequence(position){
        this.sequence[counter] = position
        console.log(counter)
    }

    saveFile(){
        let data = JSON.stringify(this.sequence)

        var myFile = new File([data], "all-of-the-world-pos.json", {type: "text/plain;charset=utf-8"});
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

let div = document.getElementById('div-1');
let counter= 0;
div.addEventListener('click', (event)=> {
    if(s){
        counter++;
        s.addSequence([Math.round(event.x/18)*18, Math.round(event.y/12)*12]);
    }    
})