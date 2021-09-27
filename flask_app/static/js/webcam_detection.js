//Sasayaki7
//Rick Momoi
//7/1/2021
//Movement Game: May rename later.

//Main script, OpenCV and movement detection script


const backgCanvas = document.getElementById('background');
const totalSongs = parseInt(document.getElementById('total-songs').innerHTML);
const songlabel= document.getElementById('song-name');
const scoreDisplay = document.getElementById('score-display');
const myMusic = document.getElementById("music");
const songScoreDisplay = document.getElementById('song-score');
const musicSource = document.querySelector('#music source');
const musicRootURL = musicSource.getAttribute('src');
const searchForm = document.getElementById('fileform');
const streakLabel = document.getElementById('streak-display');
const songConfirmLabel = document.getElementById('song-final-id');
const songDurationLabel = document.getElementById('song-duration-check');
const userIdDisplay = document.getElementById('update-id');



let duration = 0;
let streamObj = undefined;
let streaming = false;
let video = document.getElementById('videoInput');

let points = 0;
let streak = 0;

let musicIndex = 1;
let sequence = undefined;

let isCalibrating = false;

let calibrationId = parseInt(document.getElementById('update-id').innerHTML)


let hueMin = document.querySelector('.huemin');
let hueMax = document.querySelector('.huemax');
let satMin = document.querySelector('.satmin');
let satMax = document.querySelector('.satmax');
let valMin = document.querySelector('.valmin');
let valMax = document.querySelector('.valmax');



let lowerElem = [hueMin.value, satMin.value, valMin.value, 0];
let higherElem = [hueMax.value, satMax.value, valMax.value, 255];
let s = new Sequencer();



function onStart(){
    //Start music
    myMusic.play();

    //Load up the shape pattern for this song
    s.loadSequence(sequence);
    s.start();
    points = 0;
    streak = 0;
    startCam();
    
}


function startCam(){
    //Start up the webcam
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
        streamObj = stream
        streaming = true;

    })
    .catch(function(err) {
        console.log("An error occurred! " + err);
    });
}


function stopCam(){
    //Stop the webcam
    streamObj.getTracks().forEach(function(track) {
        track.stop();
    });

    streaming = false;

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
    songConfirmLabel.innerHTML = data['name'];
    let second = parseInt(data['duration']%60).toString();
    if (second.length == 1){
        second = '0'+second;
    }
    songDurationLabel.innerHTML = `${Math.floor(data['duration']/60)}:${second}`
    duration = (parseInt(data['duration'])+3)*1000;
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

function updateStreak(){
    streakLabel.innerHTML = streak;
}


function scaleFactor(pos, size, factor){
    let center = size/2
    let newZero = center-(size/factor)/2
    return (parseInt(newZero + pos/factor))
}


function submitScore(){
    if (userIdDisplay.value != 0){
        let subForm = document.getElementById('submission-form')
        subForm.innerHTML = `<input type="hidden" name="score" value=${points}>
            <input type="hidden" name="song_id" value=${musicIndex}> 
            <input type="hidden" name="mode" value=1>` 

        let form = new FormData(subForm);
            fetch(`/submit_score`, {
                method: 'POST', // or 'PUT'
                body: form,
            }) 
            .then(response => {})
    }
    document.getElementById('final-score-display').innerHTML = points;

    visible(finalBanner);
    invisible(gameScoreDisplay);
    musicLDBIndex = musicIndex;
    getSongLDB();
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

        // start processing.
        let begin = Date.now();
        cap.read(src);
        let smallerSrc = new cv.Mat();
        cv.flip(src, src, 1)

        //Setting up the background
        let background = cv.imread('background')
        cv.resize(background, background, new cv.Size(video.width, video.height))

        if (isCalibrating){
            lowerElem = [parseInt(hueMin.value), parseInt(satMin.value), parseInt(valMin.value), 0];
            higherElem = [parseInt(hueMax.value), parseInt(satMax.value), parseInt(valMax.value), 255];
        }

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

        if (!isCalibrating){
            //Creating squares.
            if (s.isRunning()){
                let square = s.getNext()
                if (square){
                    let x = scaleFactor(parseInt(square.position[0]), 640, 1.5);
                    let y = scaleFactor(parseInt(square.position[1]), 480, 1.5);
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
                let stuff = square.updateSquare();
                if (!stuff){
                    streak = 0;
                }
                cv.rectangle(background, new cv.Point(square.position[0], square.position[1]), new cv.Point(square.position[0]+square.size[0], square.position[1]+square.size[1]), square.color, parseInt(square.size[0]/6));

                if(square.pointInsideSquare([center_x, center_y]) && square.startTime){
                    let tempPoints = square.calcPoints();
                    streak++;
                    let multiplier = Math.min(Math.floor(streak / 7)/5, 2)
                    points+= parseInt(tempPoints*(1+multiplier));
                    new Text(parseInt(tempPoints*(1+multiplier)), square.position)
                    Square.removeSquare(square)
                    scoreDisplay.innerHTML= points
                }
            }
            updateStreak();


            
            //Text that displays the points
            for (text of Text.allText){
                cv.putText(background, `+${text.text}`, new cv.Point(text.position[0], text.position[1]), cv.FONT_HERSHEY_SIMPLEX, 1, [255, 255, 0, 255]);
                text.checkRemoval()
            }

            if (s.isRunning() && (Date.now() - s.starttime) > duration){
                stopCam();
                
                //Stop the audio
                myMusic.pause();

                //Delete the pattern
                s.clearSequence();
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
        }
        else{
            cv.bitwise_and(src, src, dst, mask)
            cv.circle(dst, new cv.Point(center_x, center_y), 2, [255, 255, 255, 255], 4)

            cv.resize(src, smallerSrc, new cv.Size(320, 240))
            cv.imshow('camera', smallerSrc)
            cv.imshow('canvasOutput', dst);
            background.delete();
            smallerSrc.delete();
            low.delete();
            high.delete();
            mask.delete();
            contours.delete();
        }
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




