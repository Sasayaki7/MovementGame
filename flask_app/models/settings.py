#Sasayaki7
#Rick Momoi
#7/1/2021
#Flask Controller for Settings


from ..config.mysqlconnection import connectToMySQL
from flask import flash


class Settings:

    __db = 'movement_game_schema'

    def __init__(self, data):
        self.id = data['id']
        self.huemin = data['huemin']
        self.huemax = data['huemax']
        self.satmin = data['satmin']
        self.satmax = data['satmax']
        self.valmin = data['valmin']
        self.valmax = data['valmax']
        self.name = data['name']
        self.active = data['active']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']



    @classmethod
    def get_all(cls):
        query = 'SELECT * FROM settings;'
        results = connectToMySQL(cls.__db).query_db(query)
        return [Settings(row) for row in results]


    @classmethod
    def get_all_for_user(cls, user_id):
        query = 'SELECT * FROM settings WHERE user_id=%(id)s;'
        result = connectToMySQL(cls.__db).query_db(query, {'user_id':id})
        return len(result) == 0 and None or Settings(result[0])


    @classmethod
    def get_setting(cls, id):
        query = 'SELECT * FROM settings '\
            'WHERE id=%(id)s;'
        result= connectToMySQL(cls.__db).query_db(query, {'id': id})
        if len(result) > 0:
            return Settings(result[0])
        else:
            return None


    @classmethod
    def get_setting_json(cls, id):
        query = 'SELECT * FROM settings '\
            'WHERE id=%(id)s;'
        result= connectToMySQL(cls.__db).query_db(query, {'id': id})
        return result[0]


    @classmethod
    def add_setting(cls, data):
        query = 'INSERT INTO settings (huemin, huemax, satmin, satmax, valmin, valmax, user_id, name, active, created_at, updated_at) '\
            'VALUES (%(huemin)s, %(huemax)s, %(satmin)s, %(satmax)s, %(valmin)s, %(valmax)s, %(user_id)s, %(name)s, 0, NOW(), NOW());'
        return connectToMySQL(cls.__db).query_db(query, data)




    @classmethod
    def update_setting(cls, data):
        query = 'UPDATE settings '\
            'SET huemin=%(huemin)s, huemax=%(huemax)s, satmin=%(satmin)s, satmax=%(satmax)s, valmin=%(valmin)s, valmax=%(valmax)s, name=%(name)s, updated_at=NOW() '\
            'WHERE id=%(id)s;'
        return connectToMySQL(cls.__db).query_db(query, data)


    @classmethod
    def update_current_settings(cls, user_id, id):
        query = 'UPDATE settings '\
            'SET updated_at=NOW(), active=0 '\
            'WHERE user_id=%(user_id)s AND active=1;'
        connectToMySQL(cls.__db).query_db(query, {'user_id': user_id})
        query2 = 'UPDATE settings '\
            'SET updated_at=NOW(), active=1 '\
            'WHERE id=%(id)s;'
        return connectToMySQL(cls.__db).query_db(query2, {'id': id})


    @staticmethod
    def clean_settings_data(data):
        keys = ['huemin', 'huemax', 'satmin', 'satmax', 'valmin', 'valmax', 'user_id', 'id', 'created_at', 'active', 'updated_at', 'name']
        cleaned_data = {key: data[f'settings.{key}'] if f'settings.{key}' in data  and key != 'id' else data[key] for key in keys}
        return cleaned_data



    @staticmethod
    def validate_settings(data):
        valid=True
        if(int(data['huemin']) < 0):
            valid=False
            flash('hue_min_low')
        if (int(data['huemax']) > 255):
            valid=False
            flash('hue_max_high')    
        if (int(data['huemax']) <= int(data['huemin'])):
            valid=False
            flash('hue_range_invalid')    
        if(int(data['satmin']) < 0):
            valid=False
            flash('sat_min_low')
        if (int(data['satmax']) > 255):
            valid=False
            flash('sat_max_high')    
        if (int(data['satmax']) <= int(data['satmin'])):
            valid=False
            flash('sat_range_invalid')    
        if(int(data['valmin']) < 0):
            valid=False
            flash('val_min_low')
        if (int(data['valmax']) > 255):
            valid=False
            flash('val_max_high')    
        if (int(data['valmax']) <= int(data['valmin'])):
            valid=False
            flash('val_range_invalid')
        if (len(data['name'])) == 0:
            valid=False
            flash('no_name')
        return valid



