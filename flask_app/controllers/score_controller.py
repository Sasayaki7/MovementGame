from flask import request, session, redirect, render_template, jsonify
from ..models.scores import Score
from ..models.songs import Song
from ..models.users import User
from flask_app import app



@app.route('/leaderboard')
def show_leaderboard():
    if not 'uuid' in session:
        return redirect('/')
    data = User.get_user_and_highscores(session['uuid'])
    return render_template('leaderboard.html', data)


@app.route('/get_leaderboard_for_user', methods=['POST'])
def get_leaderboard_for_user():
    if not 'uuid' in session:
        return redirect('/')
    data = Song.get_high_score_for_song_json(request.form['userid'])
    return jsonify(data)


@app.route('/get_leaderboard_for_song', methods=['POST'])
def get_leaderboard_for_song():
    if not 'uuid' in session:
        return redirect('/')
    data = Song.get_high_score_for_song_json(request.form['songid'])
    return jsonify(data)