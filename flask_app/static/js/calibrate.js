let streamObj = undefined;
let streaming = false;
let video = document.getElementById('videoInput');

let points = 0;


function onStart(){
    if (!streaming){
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
        streamObj.getTracks().forEach(function(track) {
            track.stop();
        });
    }
    streaming = !streaming;
}

let selectedForm = ".update-form "
let hueMin =undefined; 
let satMin =undefined;
let valMin =undefined;
let hueMax =undefined;
let satMax =undefined;
let valMax =undefined;


function onOpenCvReady(){

    let startButton = document.querySelector('.invisible');    
    startButton.classList.remove('invisible');


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
        cv.flip(src, src, 1)

        //Creating the Mask (Black/white image)
        cv.cvtColor(src, dst, cv.COLOR_BGR2HSV)
        
        let lowerElem = [parseInt(hueMin.value), parseInt(satMin.value), parseInt(valMin.value), 0];
        let higherElem = [parseInt(hueMax.value), parseInt(satMax.value), parseInt(valMax.value), 255];
        
        
        let mask = new cv.Mat();
        let low = new cv.Mat(src.rows, src.cols, dst.type(), lowerElem);
        let high = new cv.Mat(src.rows, src.cols, dst.type(), higherElem);
        cv.inRange(dst, low, high, mask);
        cv.bitwise_and(src, src, dst, mask)


        cv.imshow('canvasOutput', dst);
        low.delete();
        high.delete();
        mask.delete();
        // schedule the next one.
        let delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    };
    
    // schedule the first one.
    setTimeout(processVideo, 0);

}

function onSelectChange(element){
    if (element.value == -1){
        selectedForm = '.default-form ';
        let viewableForm = document.querySelector(selectedForm);
        viewableForm.classList.remove('no-show');
        let hideform = document.querySelector('.update-form');
        hideform.classList.add('no-show');
        updateObject();
    }
    else{
        selectedForm = '.update-form ';
        let viewableForm = document.querySelector(selectedForm);
        viewableForm.classList.remove('no-show');
        let hideform = document.querySelector('.default-form');
        hideform.classList.add('no-show');
        updateObject();
        document.getElementById('hiddenformId').value = element.value
        let hiddenForm = new FormData(document.getElementById('hiddenform'));
        fetch("http://localhost:5000/get_calibration", {
            method: 'POST', // or 'PUT'
            body: hiddenForm,
            })
            .then(response => response.json())
            .then(data => {
            document.querySelector(`${selectedForm} > input`).value = data.name
            document.getElementById('update-id').value = data.id

            hueMin.value =data.huemin;
            hueMax.value =data.huemax;
            satMin.value =data.satmin;
            satMax.value =data.satmax;
            valMin.value =data.valmin;
            valMax.value =data.valmax;
        })
    }
}

function updateObject(){
    hueMin = document.querySelector(`${selectedForm} .huemin`)
    satMin = document.querySelector(`${selectedForm} .satmin`)
    valMin = document.querySelector(`${selectedForm} .valmin`)
    hueMax = document.querySelector(`${selectedForm} .huemax`)
    satMax = document.querySelector(`${selectedForm} .satmax`)
    valMax = document.querySelector(`${selectedForm} .valmax`)
}

updateObject();