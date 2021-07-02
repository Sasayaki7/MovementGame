#Sasayaki7
#Rick Momoi
#7/1/2021
#Flask Model for Scores

from ..config.mysqlconnection import connectToMySQL
from flask import flash
from ..models import songs, users 

class Score:

    __db = 'movement_game_schema'

    def __init__(self, data):
        self.id = data['id']
        self.score = data['score']
        self.mode = data['mode']
        self.song = songs.Song.get_song(data['song_id'])
        self.user = users.User.get_user(data['user_id'])
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']



    @classmethod
    def get_all(cls):
        query = 'SELECT * FROM scores;'
        results = connectToMySQL(cls.__db).query_db(query)
        return [Score(row) for row in results]


    @classmethod
    def add_score(cls, data):
        query = 'INSERT INTO scores (score, mode, song_id, user_id, created_at, updated_at) '\
            'VALUES (%(score)s, %(mode)s, %(song_id)s, %(user_id)s, NOW(), NOW());'
        return connectToMySQL(cls.__db).query_db(query, data)


    @classmethod
    def get_user_score_for_song_json(cls, song_id, user_id):
        query = 'SELECT * FROM scores '\
            'WHERE user_id=%(user_id)s AND song_id=%(song_id)s '\
            'ORDER BY scores.score DESC '\
            'LIMIT 1;'
        return connectToMySQL(cls.__db).query_db(query, {'song_id': song_id, 'user_id': user_id})



    @staticmethod
    def clean_scores_data(data):
        keys = ['score', 'id', 'mode', 'song_id', 'user_id', 'created_at', 'updated_at', 'name']
        cleaned_data = {key: data[f'scores.{key}'] if f'scores.{key}' in data else data[key] for key in keys}
        return cleaned_data

