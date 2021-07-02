#Sasayaki7
#Rick Momoi
#7/1/2021
#Flask Controller for Songs


from ..config.mysqlconnection import connectToMySQL
from flask import flash
from ..models import scores

class Song:

    __db = 'movement_game_schema'

    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']
        self.url = data['url']
        self.duration = data['duration']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.score = data['score'] if 'score' in data else 0
        self.high_scores = []


    @classmethod
    def get_all(cls):
        query = 'SELECT * FROM songs;'
        results = connectToMySQL(cls.__db).query_db(query)
        return [Song(row) for row in results]


    @classmethod
    def get_song(cls, id):
        query = 'SELECT * FROM songs WHERE id=%(id)s;'
        result = connectToMySQL(cls.__db).query_db(query, {'id':id})
        return len(result) == 0 and None or Song(result[0])


    @classmethod
    def get_song_json(cls, id):
        query = 'SELECT * FROM songs WHERE id=%(id)s;'
        result = connectToMySQL(cls.__db).query_db(query, {'id':id})
        return result[0]




    @classmethod
    def get_song_from_name(cls, name):
        query = 'SELECT * FROM songs '\
            'LEFT JOIN scores ON scores.song_id = songs.id '\
            'WHERE songs.name=%(name)s '\
            'ORDER BY scores.score DESC;'
        result = connectToMySQL(cls.__db).query_db(query, {'name':name})
        if len(result) == 0:
            return None
        else:
            song = Song(result[0])
            for row in result:
                song.high_scores.append(scores.Score(scores.Score.clean_scores_data(row)))
            return song


    @classmethod
    def get_high_score_for_song_json(cls, songid):
        query = 'SELECT * FROM songs '\
            'LEFT JOIN scores ON scores.song_id = songs.id '\
            'LEFT JOIN users ON users.id = scores.user_id '\
            'WHERE songs.id = %(songid)s '\
            'ORDER BY scores.score DESC '\
            'LIMIT 10;'
        result = connectToMySQL(cls.__db).query_db(query, {'songid': songid})
        return result



    @classmethod
    def get_song_and_high_scores(cls, id):
        query = 'SELECT * FROM songs '\
            'LEFT JOIN scores ON scores.song_id = songs.id '\
            'WHERE songs.id=%(id)s '\
            'ORDER BY scores.score DESC;'

        result = connectToMySQL(cls.__db).query_db(query, {'id':id})
        if len(result) == 0:
            return None
        else:
            song = Song(result[0])
            for row in result:
                song.high_scores.append(scores.Score(scores.Score.clean_scores_data(row)))
            return song


    @classmethod
    def get_song_and_high_scores(cls, id):
        query = 'SELECT * FROM songs '\
            'LEFT JOIN scores ON scores.song_id = songs.id '\
            'WHERE songs.id=%(id)s '\
            'ORDER BY scores.score DESC;'

        result = connectToMySQL(cls.__db).query_db(query, {'id':id})
        if len(result) == 0:
            return None
        else:
            song = Song(result[0])
            for row in result:
                song.high_scores.append(scores.Score(scores.Score.clean_scores_data(row)))
            return song
