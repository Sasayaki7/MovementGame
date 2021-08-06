
const startButton = document.querySelector('.start-display');  
const leftmenu = document.querySelector('.left-menu');
const songSelector = document.querySelector('.songinfo');
const leaderboard = document.querySelector('.leaderboard-display');
const backBtn = document.getElementById('backButton');
const returnToSongBtn = document.getElementById('returnButton');
const finalBanner = document.querySelector('.score-output');
const calibrationHub = document.querySelector('.calibration-hub');
const gameDisplay = document.querySelector('.inputoutput')
const calibrationReturnButton = document.getElementById('calibration-return');
const gameScoreDisplay = document.querySelector('.game-display');
const exitMenu = document.querySelector('.exit-game');
const loginScreen = document.querySelector('.login-screen');
const instructionBackButton = document.getElementById("instructionExitButton");
const instructionMenu = document.querySelector('.instructions');

function invisible(element){
    element.classList.add('no-show');
}

function visible(element){
    element.classList.remove('no-show');
}

function backButton(){
    invisible(backBtn);
    visible(leftmenu);
    invisible(songSelector);
    invisible(leaderboard);
}

function returnToSelector(){
    invisible(startButton);
    invisible(returnToSongBtn);
    visible(backBtn);
    visible(songSelector);
}

function play(){
    invisible(leftmenu);
    visible(songSelector);
    visible(backBtn);
}

function selectSong(){
    invisible(songSelector);
    invisible(backBtn);
    visible(startButton);
    visible(returnToSongBtn);
}


function onStartVisual(){
    invisible(startButton);
    invisible(returnToSongBtn);
    visible(gameScoreDisplay);
}

function showleaderboard(){
    invisible(leftmenu);
    visible(leaderboard);
    visible(backBtn);
}

function hideOutput(){
    invisible(finalBanner);
}

function calibrationReturn(){
    invisible(calibrationReturnButton);
    invisible(calibrationHub);
    visible(leftmenu);
    gameDisplay.style.borderBottom = "double white;"

}

function calibrateOn(){
    invisible(leftmenu);
    visible(calibrationHub);
    visible(calibrationReturnButton);
    gameDisplay.style.borderBottom = "transparent;"
}

function toExitMenu(){
    invisible(leftmenu);
    visible(exitMenu);
}


function noExitGameVisual(){
    visible(leftmenu);
    invisible(exitMenu);
}

function showlogin(){
    invisible(leftmenu);
    visible(loginScreen);
}

function loginReturn(){
    invisible(loginScreen);
    visible(leftmenu);
}


function instructions(){
    visible(instructionBackButton);
    invisible(leftmenu);
    visible(instructionMenu);
}


function backInstruction(){
    visible(leftmenu);
    invisible(instructionMenu);
    invisible(instructionBackButton);
}