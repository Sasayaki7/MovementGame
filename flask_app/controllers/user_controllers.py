#Sasayaki7
#Rick Momoi
#7/1/2021
#Flask Controller for User. Carryover code mostly.


from flask import render_template, request, session, redirect, flash, jsonify
from flask_bcrypt import Bcrypt
from flask_app import app
from ..models.songs import Song
from ..models.users import User
from ..models.settings import Settings
import json
import pathlib

bcrypt = Bcrypt(app)

@app.route('/')
def start_page():
    if 'uuid' in session:
        return redirect('/play')
    else:
        return render_template('login.html')


@app.route('/register', methods=['POST'])
def add_user():
    data = {k:v for (k, v) in request.form.items()}
    if request.form['password'] != '':
        data['hashed_password'] = bcrypt.generate_password_hash(data['password'])
    else:
        data['hashed_password'] = bcrypt.generate_password_hash('password')
    session['username'] = request.form['username']
    session['email'] = request.form['email']

    if User.validate(data):
        id = User.add_user(data)
        current_settings = Settings.add_setting({'huemin':  0, 'satmin': 93, 'valmin': 44, 'huemax': 73, 'satmax': 255, 'valmax': 200, 'user_id': id, 'name': 'Default'})
        Settings.update_current_settings(id, current_settings)
        session.clear()
        session['uuid'] = id 
        return redirect('/play')
    else:
        return redirect('/play')


@app.route('/login', methods=['POST'])
def login():
    user = User.check_username(request.form['username'])
    valid=True
    if not user:
        flash("no_username")
        valid=False
    elif not bcrypt.check_password_hash(user.password, request.form['password']):
        flash("invalid_credential")
        valid=False

    if valid:
        session['uuid'] = user.id
        return redirect('/play')
    else:
        flash("gotologin")
        return redirect('/play')

@app.route('/fetch-sequence', methods=['POST'])
def get_json():
    path = pathlib.PurePath(__file__).parent.parent
    path = path.joinpath('static/sequence-obj/')
    file = open(f'{path}{request.form["filename"]}')
    data = json.load(file)
    file.close()
    return data





@app.route('/play')
def landing_page():
    if 'uuid' in session:
        user_info = User.get_user_and_settings(session['uuid'])
        songs = Song.get_all()
        return render_template('webcamtest.html', user = user_info, songs =songs)
    else:
        songs = Song.get_all()
        return render_template('webcamtest.html', user = None, songs =songs)

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/play')