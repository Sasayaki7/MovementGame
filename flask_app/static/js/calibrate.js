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

let hueMin = document.getElementById("huemin")
let satMin = document.getElementById("satmin")
let valMin = document.getElementById("valmin")
let hueMax = document.getElementById("huemax")
let satMax = document.getElementById("satmax")
let valMax = document.getElementById("valmax")


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