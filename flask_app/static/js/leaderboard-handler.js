const musicLeaderboard = document.getElementById('leaderboard-body');
const songLeaderboardDisplay = document.getElementById('song-name-leaderboard');
const highscoreDisplay = document.getElementById('your-high-score');

let musicLDBIndex = 1;



function getSongLDB(){

    fetch(`http://localhost:5000/get_leaderboard_for_song?id=${musicLDBIndex}`)
    .then(response => response.json())
    .then(data => {
        let leaderboardData = ""
        for (let key in data){
            leaderboardData+= `<tr>
                <td>${parseInt(key)+1}.</td>
                <td>${data[key]['score']}</td>
                <td>${data[key]['username']}</td>
                <td>${data[key]['scores.created_at']}</td>
            </tr>`
        }
        musicLeaderboard.innerHTML = leaderboardData;
    });
    fetch(`http://localhost:5000/fetch-song?id=${musicLDBIndex}`)
    .then(response => response.json())
    .then(data => {
        songLeaderboardDisplay.innerHTML = data['name'];
        highscoreDisplay.innerHTML = data['score'] ? data['score']: 0;
    });
}


function prevSongLDB(){
    musicLDBIndex--;
    if (musicLDBIndex < 1){
        musicLDBIndex=totalSongs;
    }
    getSongLDB();
}

function nextSongLDB(){
    musicLDBIndex++;
    if (musicLDBIndex > totalSongs){
        musicLDBIndex=1;
    }
    getSongLDB();
}

getSongLDB();