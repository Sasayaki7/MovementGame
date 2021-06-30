from flask import request, session, redirect, render_template, jsonify
from ..models.settings import Settings
from ..models.songs import Song
from ..models.users import User
from flask_app import app




@app.route('/calibration')
def user_calibration():
    if not 'uuid' in session:
        return redirect('/')
    user = User.get_user_and_settings(session['uuid'])
    return render_template('calibrate.html')


