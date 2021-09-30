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

let jsonOfSongs={
    "all-of-the-world-seq.json":{"15276": {"position": [84, 132]}, "16123": {"position": [234, 132]}, "16571": {"position": [384, 132]}, "17035": {"position": [84, 288]}, "17483": {"position": [234, 288]}, "17899": {"position": [384, 300]}, "18299": {"position": [108, 144]}, "19156": {"position": [108, 324]}, "19963": {"position": [450, 144]}, "20380": {"position": [450, 324]}, "21603": {"position": [284, 234]}, "22035": {"position": [84, 132]}, "22868": {"position": [234, 132]}, "23292": {"position": [384, 132]}, "23732": {"position": [84, 288]}, "24188": {"position": [234, 288]}, "24596": {"position": [384, 300]}, "25020": {"position": [108, 144]}, "25844": {"position": [108, 324]}, "26644": {"position": [450, 144]}, "27068": {"position": [450, 324]}, "28277": {"position": [284, 234]}, "28725": {"position": [160, 220]}, "30445": {"position": [360, 220]}, "32093": {"position": [260, 20]}, "33357": {"position": [180, 80]}, "33549": {"position": [260, 180]}, "33782": {"position": [340, 280]}, "34997": {"position": [40, 80]}, "35181": {"position": [40, 300]}, "35469": {"position": [40, 220]}, "35685": {"position": [80, 220]}, "36094": {"position": [120, 220]}, "36541": {"position": [160, 220]}, "36742": {"position": [200, 220]}, "36950": {"position": [240, 220]}, "37157": {"position": [280, 220]}, "38462": {"position": [320, 220]}, "38654": {"position": [360, 220]}, "38878": {"position": [400, 220]}, "39646": {"position": [200, 60]}, "40054": {"position": [320, 60]}, "40534": {"position": [200, 220]}, "40959": {"position": [320, 220]}, "41358": {"position": [200, 380]}, "41758": {"position": [320, 380]}, "42174": {"position": [160, 220]}, "43871": {"position": [360, 220]}, "45518": {"position": [260, 20]}, "46856": {"position": [180, 80]}, "47047": {"position": [260, 180]}, "47255": {"position": [340, 280]}, "48495": {"position": [40, 80]}, "48703": {"position": [40, 300]}, "48951": {"position": [40, 220]}, "49135": {"position": [80, 220]}, "49568": {"position": [120, 220]}, "49999": {"position": [160, 220]}, "50191": {"position": [200, 220]}, "50360": {"position": [240, 220]}, "50592": {"position": [280, 220]}, "51791": {"position": [320, 220]}, "52008": {"position": [360, 220]}, "52248": {"position": [400, 220]}, "53072": {"position": [200, 60]}, "53472": {"position": [320, 60]}, "53944": {"position": [200, 220]}, "54360": {"position": [320, 220]}, "54768": {"position": [200, 380]}, "55168": {"position": [320, 380]}, "55617": {"position": [160, 220]}, "57241": {"position": [360, 220]}, "58929": {"position": [260, 20]}, "60321": {"position": [180, 80]}, "60497": {"position": [260, 180]}, "60649": {"position": [340, 280]}, "61905": {"position": [40, 80]}, "62161": {"position": [40, 300]}, "62386": {"position": [40, 220]}, "62570": {"position": [80, 220]}, "62978": {"position": [120, 220]}, "63370": {"position": [160, 220]}, "63593": {"position": [200, 220]}, "63786": {"position": [240, 220]}, "64009": {"position": [280, 220]}, "65298": {"position": [320, 220]}, "65482": {"position": [360, 220]}, "65697": {"position": [400, 220]}, "66474": {"position": [200, 60]}, "66882": {"position": [320, 60]}, "67346": {"position": [200, 220]}, "67738": {"position": [320, 220]}, "68186": {"position": [200, 380]}, "68570": {"position": [320, 380]}, "72355": {"position": [150, 110]}, "72763": {"position": [150, 170]}, "73187": {"position": [150, 230]}, "73619": {"position": [150, 290]}, "74067": {"position": [250, 110]}, "74515": {"position": [250, 170]}, "74955": {"position": [250, 230]}, "75379": {"position": [250, 290]}, "75795": {"position": [350, 110]}, "76235": {"position": [350, 170]}, "76651": {"position": [350, 230]}, "77067": {"position": [350, 290]}, "77492": {"position": [450, 110]}, "77876": {"position": [450, 170]}, "78284": {"position": [450, 230]}, "78724": {"position": [450, 290]}, "79116": {"position": [150, 110]}, "79532": {"position": [150, 170]}, "79939": {"position": [150, 230]}, "80380": {"position": [150, 290]}, "80772": {"position": [250, 110]}, "81180": {"position": [250, 170]}, "81620": {"position": [250, 230]}, "82044": {"position": [250, 290]}, "82476": {"position": [350, 110]}, "82884": {"position": [350, 170]}, "83292": {"position": [350, 230]}, "83732": {"position": [350, 290]}, "84156": {"position": [450, 110]}, "84573": {"position": [450, 170]}, "84981": {"position": [450, 230]}, "85413": {"position": [450, 290]}, "85820": {"position": [150, 110]}, "86252": {"position": [150, 170]}, "86653": {"position": [150, 230]}, "87069": {"position": [150, 290]}, "87477": {"position": [250, 110]}, "87901": {"position": [250, 170]}, "88317": {"position": [250, 230]}, "88765": {"position": [250, 290]}, "89165": {"position": [350, 110]}, "89629": {"position": [350, 170]}, "90054": {"position": [350, 230]}, "90493": {"position": [350, 290]}, "90893": {"position": [450, 110]}, "91309": {"position": [450, 170]}, "91734": {"position": [450, 230]}, "92166": {"position": [450, 290]}, "92582": {"position": [150, 110]}, "93013": {"position": [150, 170]}, "93430": {"position": [150, 230]}, "93830": {"position": [150, 290]}, "94278": {"position": [250, 110]}, "94702": {"position": [250, 170]}, "95126": {"position": [250, 230]}, "95590": {"position": [250, 290]}, "95974": {"position": [350, 110]}, "96398": {"position": [350, 170]}, "96790": {"position": [350, 230]}, "97198": {"position": [350, 290]}, "97598": {"position": [450, 110]}, "98014": {"position": [450, 170]}, "98398": {"position": [450, 230]}, "98822": {"position": [450, 290]}},
    "opm-op-seq.json" : {"10786": {"position": [130, 200]}, "11009": {"position": [400, 200]}, "18315": {"position": [280, 70]}, "18675": {"position": [280, 130]}, "19051": {"position": [280, 190]}, "19531": {"position": [180, 200]}, "19707": {"position": [380, 200]}, "20082": {"position": [40, 30]}, "20218": {"position": [540, 30]}, "20906": {"position": [40, 360]}, "21163": {"position": [540, 360]}, "21803": {"position": [40, 30]}, "22042": {"position": [540, 30]}, "22491": {"position": [40, 360]}, "22923": {"position": [540, 360]}, "27388": {"position": [185, 234]}, "27619": {"position": [454, 235]}, "28300": {"position": [36, 35]}, "28556": {"position": [581, 32]}, "29220": {"position": [37, 38]}, "29452": {"position": [548, 45]}, "29892": {"position": [41, 369]}, "30292": {"position": [551, 378]}, "34956": {"position": [216, 235]}, "35676": {"position": [472, 237]}, "36389": {"position": [33, 29]}, "36613": {"position": [533, 37]}, "36877": {"position": [238, 232]}, "37549": {"position": [458, 237]}, "38949": {"position": [34, 386]}, "39149": {"position": [65, 362]}, "39397": {"position": [104, 335]}, "39622": {"position": [153, 309]}, "39845": {"position": [184, 283]}, "40069": {"position": [253, 264]}, "40294": {"position": [323, 245]}, "40533": {"position": [370, 253]}, "40981": {"position": [437, 276]}, "41414": {"position": [492, 318]}, "41846": {"position": [178, 229]}, "42325": {"position": [476, 231]}, "43062": {"position": [34, 38]}, "43302": {"position": [84, 64]}, "43526": {"position": [117, 88]}, "43774": {"position": [152, 122]}, "43998": {"position": [214, 149]}, "44222": {"position": [244, 182]}, "44438": {"position": [280, 208]}, "44662": {"position": [348, 237]}, "44870": {"position": [384, 260]}, "45143": {"position": [504, 306]}, "45926": {"position": [295, 141]}, "46470": {"position": [214, 241]}, "46919": {"position": [334, 323]}, "47383": {"position": [418, 221]}, "47695": {"position": [283, 113]}, "47895": {"position": [227, 138]}, "48102": {"position": [209, 182]}, "48335": {"position": [239, 249]}, "48559": {"position": [292, 269]}, "48790": {"position": [395, 268]}, "48983": {"position": [441, 249]}, "49238": {"position": [170, 202]}, "49663": {"position": [437, 208]}, "50423": {"position": [337, 136]}, "50631": {"position": [225, 265]}, "50887": {"position": [474, 260]}, "51383": {"position": [579, 32]}, "51616": {"position": [537, 71]}, "51839": {"position": [486, 97]}, "52047": {"position": [447, 129]}, "52271": {"position": [401, 166]}, "52519": {"position": [363, 190]}, "52872": {"position": [320, 210]}, "53184": {"position": [255, 236]}, "53244": {"position": [178, 266]}, "53439": {"position": [149, 295]}, "53647": {"position": [117, 316]}, "53847": {"position": [72, 347]}, "54112": {"position": [46, 367]}, "56760": {"position": [169, 207]}, "57120": {"position": [380, 210]}, "57847": {"position": [25, 25]}, "58112": {"position": [58, 58]}, "58344": {"position": [92, 82]}, "58576": {"position": [157, 116]}, "58816": {"position": [188, 143]}, "59041": {"position": [235, 188]}, "59257": {"position": [275, 212]}, "59473": {"position": [333, 237]}, "59728": {"position": [368, 282]}, "59960": {"position": [412, 316]}, "60744": {"position": [62, 350]}, "61256": {"position": [339, 50]}, "61657": {"position": [514, 344]}, "62408": {"position": [575, 50]}, "62664": {"position": [524, 83]}, "62921": {"position": [449, 133]}, "63169": {"position": [384, 182]}, "63492": {"position": [302, 235]}, "63625": {"position": [223, 285]}, "63856": {"position": [129, 328]}, "64156": {"position": [104, 220]}, "64505": {"position": [434, 204]}, "65177": {"position": [68, 346]}, "65441": {"position": [326, 88]}, "65665": {"position": [536, 362]}, "66153": {"position": [557, 221]}, "66409": {"position": [531, 221]}, "66617": {"position": [468, 228]}, "66841": {"position": [420, 228]}, "67097": {"position": [355, 223]}, "67321": {"position": [263, 232]}, "67673": {"position": [206, 230]}, "67817": {"position": [136, 236]}, "68010": {"position": [81, 241]}, "68241": {"position": [120, 163]}, "68642": {"position": [281, 59]}, "68929": {"position": [533, 150]}, "70322": {"position": [280, 100]}, "70546": {"position": [280, 160]}, "70778": {"position": [280, 220]}, "70986": {"position": [280, 280]}, "71362": {"position": [130, 200]}, "71826": {"position": [400, 200]}, "77755": {"position": [280, 100]}, "77955": {"position": [280, 160]}, "78147": {"position": [280, 220]}, "78355": {"position": [280, 280]}, "78820": {"position": [130, 200]}, "79283": {"position": [400, 200]}}
}


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
    fetch("/fetch-sequence", {
    method: 'POST', // or 'PUT'
    body: form,
    })
    .then(response => {
        console.log(response)
        return response.json()})
    .then(data => {
    sequence=data;
})
}

function getSong(){
    fetch(`/fetch-song?id=${musicIndex}`)
    .then(response => response.json())
    .then(data => {
    songScoreDisplay.innerHTML=data['score'] ? data['score']: 0;
    // document.querySelector('#fileform input').setAttribute('value', `/${data['sequence_file']}`);
    // fetchSequence();
    sequence = jsonOfSongs[data['sequence_file']]
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




