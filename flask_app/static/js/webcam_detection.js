//Sasayaki7
//Rick Momoi
//7/1/2021
//Movement Game: May rename later.

//Main script, OpenCV and movement detection script



class Square{
    static allSquares = [];
    static mSize = [80, 80];
    static tickerLimit = 2;

    constructor(position, size, color, growthFactor){
        this.position = [position[0]+parseInt(Square.mSize[0]/2), position[1]+parseInt(Square.mSize[1]/2)];
        this.size = size;
        this.growthFactor = growthFactor;
        this.color = color;
        this.initColor = color;
        this.ticker = 0;
        this.grow_ticker = 0;
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
            let col = this.color[i]-this.initColor[i]/40;
            arr.push(parseInt(col))
            sum+=col
        }
        this.color = arr;
        if (sum < 0){
            Square.removeSquare(this);
        }
        return this
    }

    calcPoints(){
        return 20-this.size[0]-this.size[1]+Square.mSize[0]+Square.mSize[1];
    }


    updateSquare(){
        if(this.size[0] < Square.mSize[0]){
            this.growSquare()
        }
        else{
            if(this.ticker < Square.tickerLimit){
                this.ticker++;
            }
            else{
                this.fadeSquare();
            }
        }
        return this
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



const backgCanvas = document.getElementById('background');
const totalSongs = parseInt(document.getElementById('total-songs').innerHTML);
const songlabel= document.getElementById('song-name');
const scoreDisplay = document.getElementById('score-display');
const myMusic = document.getElementById("music");
const songScoreDisplay = document.getElementById('song-score');
const musicSource = document.querySelector('#music source');
const musicRootURL = musicSource.getAttribute('src');
const searchForm = document.getElementById('fileform');




let duration = 0;
let streamObj = undefined;
let streaming = false;
let video = document.getElementById('videoInput');

let points = 0;

let musicIndex = 1;
let sequence = undefined;

let lowerElem = [0, 93, 44, 0];
let higherElem = [73, 255, 200, 255];
let s = new Sequencer();



function onStart(){
    if (!streaming){
        
        //Start music
        myMusic.play();

        //Load up the shape pattern for this song
        s.loadSequence(sequence);
        s.start()

        //Start up the webcam
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                streamObj = stream
            })
            .catch(function(err) {
                console.log("An error occurred! " + err);
            });
        }

    else{

        stopCam();
        
    }
    streaming = !streaming;
}


function stopCam(){
    //Stop the webcam
    streamObj.getTracks().forEach(function(track) {
        track.stop();
    });

    //Stop the audio
    myMusic.pause();

    //Delete the pattern
    s.clearSequence();
}



function fetchSequence(){
    let form = new FormData(searchForm);
    fetch("http://localhost:5000/fetch-sequence", {
    method: 'POST', // or 'PUT'
    body: form,
    })
    .then(response => response.json())
    .then(data => {
    sequence=data;
})
}

function getSong(){
    fetch(`http://localhost:5000/fetch-song?id=${musicIndex}`)
    .then(response => response.json())
    .then(data => {
    songScoreDisplay.innerHTML=data['score'] ? data['score']: 0;
    document.querySelector('#fileform input').setAttribute('value', `\\${data['sequence_file']}`);
    fetchSequence();
    songlabel.innerHTML = data['name'];
    musicSource.setAttribute('src', `${musicRootURL}${data['url']}`);
    myMusic.load();
    duration = parseInt(data['duration'])*1000;
})
}


function prevSong(){
    musicIndex--;
    if (musicIndex < 1){
        musicIndex=totalSongs;
    }
    getSong();
}

function nextSong(){
    musicIndex++;
    if (musicIndex > totalSongs){
        musicIndex=1;
    }
    getSong();
}



function submitScore(){
    let subForm = document.getElementById('submission-form')
    subForm.innerHTML = `<input type="hidden" name="score" value=${score}>
        <input type="hidden" name="song_id" value=${musicIndex}>` 
    let form = new FormData(subForm);
    fetch(`http://localhost:5000/submit_score`, {
        method: 'POST', // or 'PUT'
        body: form,
    }) 
    .then(response => {})
    document.getElementById('final-score-display').innerHTML = points;
    visible(finalBanner);
    
}

function onOpenCvReady(){


    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);
    let streaming = true;
    
    const FPS = 30;
    function processVideo() {
        if (!streaming) {
            // clean and stop.
            src.delete();
            dst.delete();
            return;
        }
        let begin = Date.now();
        // start processing.
        cap.read(src);
        let smallerSrc = new cv.Mat();
        cv.flip(src, src, 1)

        //Setting up the background
        let background = cv.imread('background')
        cv.resize(background, background, new cv.Size(video.width, video.height))

        //Creating the Mask (Black/white image)
        cv.cvtColor(src, dst, cv.COLOR_BGR2HSV)
        let mask = new cv.Mat();
        let low = new cv.Mat(dst.rows, dst.cols, dst.type(), lowerElem);
        let high = new cv.Mat(dst.rows, dst.cols, dst.type(), higherElem);
        cv.inRange(dst, low, high, mask);

        //Turning the mask into a contour
        let contours = new cv.MatVector();
        let hierarchies = new cv.Mat();
        cv.findContours(mask, contours, hierarchies, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);
        hierarchies.delete();

        //Finding the contour with the largest object.
        let max = 0;
        let maxIndex = 0;
        for(let i = 0; i < contours.size(); i++){
            let area = cv.contourArea(contours.get(i))
            if (area > 50 && area > max){
                max = area
                maxIndex=i
            } 
        }

        //Determining the center of the largest object and drawing a circle as an indicator.
        let center_x, center_y;
        if (max > 0){
            let contour = contours.get(maxIndex)
            let moment = cv.moments(contour)
            center_x = parseInt(moment.m10/moment.m00)
            center_y = parseInt(moment.m01/moment.m00)
            cv.circle(background, new cv.Point(center_x, center_y), 2, [255, 255, 255, 255], 4)
        }

        //Creating squares.
        if (s.isRunning()){
            let square = s.getNext()
            if (square){
                let x = parseInt(square.position[0]);
                let y = parseInt(square.position[1]);
                new Square([x, y], [0, 0], [255, 255, 255, 255], 10)
            }
        }


        //Copies Square.getAllSquiares into a separate array. This is necessary to prevent issues when removing.
        let all_square_copy = [];
        for (let square of Square.getAllSquares()){
            all_square_copy.push(square)
        }


        //Drawing all the squares and checking if any of the squares intersected with the hand
        for (square of all_square_copy){
            square.updateSquare();
            cv.rectangle(background, new cv.Point(square.position[0], square.position[1]), new cv.Point(square.position[0]+square.size[0], square.position[1]+square.size[1]), square.color, parseInt(square.size[0]/6));

            if(square.pointInsideSquare([center_x, center_y])){
                points+= square.calcPoints()
                new Text(square.calcPoints(), square.position)
                Square.removeSquare(square)
                scoreDisplay.innerHTML= points
            }
        }

        
        //Text that displays the points
        for (text of Text.allText){
            cv.putText(background, `+${text.text}`, new cv.Point(text.position[0], text.position[1]), cv.FONT_HERSHEY_SIMPLEX, 1, [255, 255, 0, 255]);
            text.checkRemoval()
        }

        if (s.isRunning() && (Date.now() - s.starttime) > duration*1000){
            stopCam();
            submitScore();
        }

        cv.bitwise_and(src, src, dst, mask)

        cv.resize(src, smallerSrc, new cv.Size(320, 240))
        cv.imshow('camera', smallerSrc)
        cv.imshow('canvasOutput', background);
        smallerSrc.delete();
        background.delete();
        low.delete();
        high.delete();
        mask.delete();
        contours.delete();
        // schedule the next one.
        let delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    };
    
    // schedule the first one.
    setTimeout(processVideo, 0);

}


function toggle(){
    document.getElementById('camera').classList.toggle('no-show')
}

function onBodyLoad(){

    let backImg = document.getElementById('image')
    var ctx = backgCanvas.getContext("2d");
    ctx.drawImage(backImg, 0, 0);
    getSong();
    fetchSequence();
    
    let calibrationD = document.getElementById('calibration-data')
    lowerElem = [parseInt(calibrationD.getAttribute('huemin')), parseInt(calibrationD.getAttribute('satmin')), parseInt(calibrationD.getAttribute('valmin')), 0];
    higherElem = [parseInt(calibrationD.getAttribute('huemax')), parseInt(calibrationD.getAttribute('satmax')), parseInt(calibrationD.getAttribute('valmax')), 255];
}