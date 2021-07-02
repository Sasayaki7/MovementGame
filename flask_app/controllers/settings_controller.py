#Sasayaki7
#Rick Momoi
#7/1/2021
#Flask Controller for Settings/Calibration

from flask import request, session, redirect, render_template, jsonify
from ..models.settings import Settings
from ..models.users import User
from flask_app import app




@app.route('/calibration')
def user_calibration():
    if not 'uuid' in session:
        return redirect('/')
    user = User.get_user_and_settings(session['uuid'])
    return render_template('calibrate.html', user=user)



@app.route('/get_calibration', methods=['POST'])
def get_calibration():
    calibration = Settings.get_setting_json(request.form['id'])
    return jsonify(calibration)


@app.route('/save_new_settings', methods=['POST'])
def save_calibration():
    if not 'uuid' in session:
        return redirect('/')
    if Settings.validate_settings(request.form):
        data = {key: int(val) if val.isnumeric() and key != 'name' else val for (key, val) in request.form.items()}
        curr_id = Settings.add_setting(data)

        Settings.update_current_settings(session['uuid'], curr_id)
        return redirect('/play')
    else:
        return redirect('/calibration')
    

@app.route('/update_settings', methods=['POST'])
def update_calibration():
    if not 'uuid' in session:
        return redirect('/')
    if Settings.validate_settings(request.form):
        data = {key: int(val) if val.isnumeric() and key != 'name' else val for (key, val) in request.form.items()}
        Settings.update_setting(data)
        Settings.update_current_settings(session['uuid'], data['id'])
        return redirect('/play')
    else:
        return redirect('/calibration')