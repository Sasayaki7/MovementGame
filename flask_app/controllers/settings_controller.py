#Sasayaki7
#Rick Momoi
#7/1/2021
#Flask Controller for Settings/Calibration

from flask import request, session, redirect, render_template, jsonify
from ..models.settings import Settings
from ..models.users import User
from flask_app import app
from flask_cors import cross_origin




@cross_origin()
@app.route('/calibration')
def user_calibration():
    if not 'uuid' in session:
        return render_template('calibrate.html', user=None)
    user = User.get_user_and_settings(session['uuid'])
    return render_template('calibrate.html', user=user)


@cross_origin()
@app.route('/create_calibration', methods=['POST'])
def create_calibration():
    data = {key: int(val) if val.isnumeric() and key != 'name' else val for (key, val) in request.form.items()}
    data['user_id'] = session['uuid']
    calibration_id = Settings.add_setting(data)
    return jsonify(id=calibration_id)



@cross_origin()
@app.route('/get_calibration')
def get_calibration():
    data = {key: int(val) if val.isnumeric() and key != 'name' else val for (key, val) in request.args.items()}

    calibration = Settings.get_setting_json(data['id'])
    return jsonify(calibration)



@cross_origin()
@app.route('/save_new_settings', methods=['POST'])
def save_calibration():

    if Settings.validate_settings(request.form):
        data = {key: int(val) if val.isnumeric() and key != 'name' else val for (key, val) in request.form.items()}
        curr_id = Settings.add_setting(data)
        Settings.update_current_settings(session['uuid'], curr_id)
    else:
        return redirect('/calibration')


@cross_origin()
@app.route('/set_calibration', methods=['POST'])
def update_current_calibration():
    data = {key: int(val) if val.isnumeric() and key != 'name' else val for (key, val) in request.form.items()}

    Settings.update_current_settings(data['id'])
    return jsonify(id=request.form['id'])


@cross_origin()
@app.route('/update_calibration', methods=['POST'])
def update_calibration():
    data = {key: int(val) if val.isnumeric() and key != 'name' else val for (key, val) in request.form.items()}
    Settings.update_setting(data)
    if session['uuid']:
        Settings.update_current_settings(session['uuid'], data['id'])
        return jsonify(id=data['id'])
    else:
        return jsonify(id=0)
