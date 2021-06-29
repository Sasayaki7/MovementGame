
class Square{
    static allSquares = [];
    static mSize = [150, 150];
    static tickerLimit = 30;

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







let streamObj = undefined;
let streaming = false;
let video = document.getElementById('videoInput');

let points = 0;

let lowerElem = [0, 93, 44, 0];
let higherElem = [73, 255, 200, 255];

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
            cv.circle(src, new cv.Point(center_x, center_y), 5, [255, 0, 0, 255], -1)
        }

        //Creating squares.
        if (Math.random()*50 < 1){
            let x = parseInt(Math.random()*650);
            let y  = parseInt(Math.random()*300);
            new Square([x, y], [0, 0], [0, 255, 0, 0], 2)
        }


        //Copies Square.getAllSquiares into a separate array. This is necessary to prevent issues when removing.
        let all_square_copy = [];
        for (let square of Square.getAllSquares()){
            all_square_copy.push(square)
        }


        //Drawing all the squares and checking if any of the squares intersected with the hand
        for (square of all_square_copy){
            square.updateSquare();
            cv.rectangle(src, new cv.Point(square.position[0], square.position[1]), new cv.Point(square.position[0]+square.size[0], square.position[1]+square.size[1]), [0, 0,255, 255], -1);

            if(square.pointInsideSquare([center_x, center_y])){
                points+= square.calcPoints()
                new Text(square.calcPoints(), square.position)
                Square.removeSquare(square)
            }
        }

        
        //Text that displays the points
        for (text of Text.allText){
            cv.putText(src, `+${text.text}`, new cv.Point(text.position[0], text.position[1]), cv.FONT_HERSHEY_SIMPLEX, 1, [255, 255, 0, 255]);
            text.checkRemoval()
        }

        cv.imshow('canvasOutput', src);
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