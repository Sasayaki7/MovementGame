#Sasayaki7
#Rick Momoi
#7/1/2021
#Flask Controller for Users


from ..config.mysqlconnection import connectToMySQL
from flask import flash
import re
from ..models import settings, scores

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

class User:

    __db = 'movement_game_schema'

    def __init__(self, data):
        self.id = data['id']
        self.email = data['email']
        self.username = data['username']
        self.password = data['password']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.current_settings = settings.Settings.get_setting(data['settings.id']) if 'settings.id' in data  else None
        self.settings = []
        self.scores = []




    @classmethod
    def get_all(cls):
        query = 'SELECT * FROM users;'
        results = connectToMySQL(cls.__db).query_db(query)
        return [User(row) for row in results]


    @classmethod
    def get_user(cls, id):
        query = 'SELECT * FROM users '\
            'JOIN settings ON users.id = settings.user_id '\
            'WHERE users.id=%(id)s AND settings.active = 1;'
        result = connectToMySQL(cls.__db).query_db(query, {'id':id})
        return len(result) == 0 and None or User(result[0])


    @classmethod
    def get_user_from_email(cls, data):
        query = 'SELECT * FROM users WHERE email=%(email)s;'
        return connectToMySQL(cls.__db).query_db(query, data)


    @classmethod
    def add_user(cls, data):
        data['stored_username'] = data['username'].lower()
        query = 'INSERT INTO users (username, stored_username, email, password, created_at, updated_at) '\
            'VALUES (%(username)s, %(stored_username)s, %(email)s, %(hashed_password)s, NOW(), NOW());'
        return connectToMySQL(cls.__db).query_db(query, data)


    @classmethod
    def get_user_and_highscores(cls, id):
        query = 'SELECT users.id, username, stored_username, created_at, updated_at, scores.created_at, MAX(scores.score) as scores.score, '\
            'scores.song_id, scores.user_id, scores.updated_at FROM users '\
            'LEFT JOIN settings ON users.id = scores.user_id '\
            'GROUP BY scores.song_id '\
            'WHERE users.id=%(id)s AND settings.active=1;'
        results = connectToMySQL(cls.__db).query_db(query, {'id': id})
        if len(results) > 0:
            user = User(results[0])
            for row in results:
                user.scores.append(scores.Score(scores.Score.clean_scores_data(row)))
            return user
        else:
            return None


    @classmethod
    def get_user_and_settings(cls, id):
        query = 'SELECT * FROM users '\
            'LEFT JOIN settings ON users.id = settings.user_id '\
            'WHERE users.id=%(id)s;'
        results = connectToMySQL(cls.__db).query_db(query, {'id': id})
        if len(results) > 0:
            user = User(results[0])
            for row in results:
                data={
                    'id': row['settings.id'],
                    'created_at': row['settings.created_at'],
                    'updated_at': row['settings.updated_at'],
                    'huemin': row['huemin'],
                    'huemax': row['huemax'],
                    'satmin': row['satmin'],
                    'satmax': row['satmax'],
                    'valmin': row['valmin'],
                    'valmax': row['valmax'],
                    'user_id': row['user_id'],
                    'active': row['active'],
                    'name': row['name']
                }
                user.settings.append(settings.Settings(data))
            return user
        else:
            return None


    @classmethod
    def check_email(cls, email):
        query = 'SELECT * FROM users WHERE email=%(email)s;'
        result = connectToMySQL(cls.__db).query_db(query, {'email':email})
        return len(result) != 0 and User(result[0]) or None        



    @classmethod
    def check_username(cls, username):
        query = 'SELECT * FROM users WHERE stored_username=%(username)s;'
        result = connectToMySQL(cls.__db).query_db(query, {'username':username})
        return len(result) != 0 and User(result[0]) or None    



    @staticmethod
    def validate(data):
        valid = True
        if len(data['username']) < 2:
            valid = False
            print('a')
            flash('username_invalid')
        elif User.check_username(data['username'].lower()):
            valid=False
            print('b')
            flash('username_taken')
        if data['password'] != data['confirm_password']:
            valid = False
            print('c')
            flash('password_no_match')
        if not (re.search('[A-Z]+', data['password']) and re.search('[0-9]+', data['password'])):
            valid=False
            print('d')
            flash('weak_password')
        if data['password'] == '':
            valid=False
            print('e')
            flash('no_password')
        if not re.match(EMAIL_REGEX, data['email']):
            valid = False
            print('f')
            flash('email_invalid')

        if not valid:
            flash('gotologin')
            print('uwu')
        return valid

