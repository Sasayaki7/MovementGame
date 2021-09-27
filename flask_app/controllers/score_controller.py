#Sasayaki7
#Rick Momoi
#7/1/2021
#Flask Controller for Score


from flask import request, session, redirect, render_template, jsonify
from ..models.scores import Score
from ..models.songs import Song
from ..models.users import User
from flask_app import app


@app.route('/leaderboard')
def show_leaderboard():
    if not 'uuid' in session:
        return redirect('/get_leaderboard_for_song?id=1')
    data = User.get_user_and_highscores(session['uuid'])
    return render_template('leaderboard.html', data)


@app.route('/get_leaderboard_for_user', methods=['POST'])
def get_leaderboard_for_user():
    if not 'uuid' in session:
        return redirect('/')
    data = Song.get_high_score_for_song_json(request.form['userid'])
    return jsonify(data)


@app.route('/get_leaderboard_for_song')
def get_leaderboard_for_song():
    data = Song.get_high_score_for_song_json(request.args['id'])
    return jsonify(data)

@app.route('/submit_score', methods=['POST'])
def score_submission():
    if not 'uuid' in session:
        return redirect('/')
    data = {k: int(v) if v.isnumeric() else v for (k, v) in request.form.items()}
    data['user_id'] = session['uuid']
    Score.add_score(data)
    return jsonify(message="success")
