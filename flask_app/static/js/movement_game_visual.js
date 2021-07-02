
const startButton = document.querySelector('.start-button');  
const leftmenu = document.querySelector('.left-menu');
const songSelector = document.querySelector('.songinfo');
const leaderboard = document.querySelector('.leaderboard-display');
const backBtn = document.getElementById('backButton');
const returnToSongBtn = document.getElementById('returnButton');
const finalBanner = document.querySelector('.score-output');

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
    visible(startButton);
}


function onStartVisual(){
    invisible(startButton);
}

function showleaderboard(){
    invisible(leftmenu);
    visible(leaderboard);
    visible(backBtn);
}

function hideOutput(){
    invisible(finalBanner);
}