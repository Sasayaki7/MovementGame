#Sasayaki7
#Rick Momoi
#7/1/2021
#Flask Controller for Song. Pretty much just a pseudo-API at this point

from flask_app.models.scores import Score
from flask import request, session, redirect, render_template, jsonify
from ..models.songs import Song
from ..models.users import User
from flask_app import app



@app.route('/fetch-song')
def get_song():
    if not 'uuid' in session:
        return redirect('/')
    data =request.args
    song = Song.get_song_json(data['id'])
    high_score = Score.get_user_score_for_song_json(data['id'], session['uuid'])
    if len(high_score) > 0:
        song['score'] = high_score[0]['score']
    else:
        song['score'] = 0
    return jsonify(song) 
