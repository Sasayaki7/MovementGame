from flask import render_template, request, session, redirect, flash
from flask_bcrypt import Bcrypt
from flask_app import app
from ..models.users import User
from ..models.settings import Settings
bcrypt = Bcrypt(app)

@app.route('/')
def start_page():
    if 'uuid' in session:
        return redirect('/success')
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
        User.update_settings(id, current_settings)
        user_info = User.get_user(id)
        session.clear()
        session['uuid'] = id 
        return redirect('/game')
    else:
        return redirect('/')



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
        return redirect('/success')
    else:
        return redirect('/')


@app.route('/play')
def landing_page():
    if 'uuid' in session:
        user_info = User.get_user(session['uuid'])
        users = User.get_all()
        return render_template('success.html', user_info=user_info, users=users)
    else:
        return redirect('/')


@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')