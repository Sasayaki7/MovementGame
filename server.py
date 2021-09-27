from flask_app import app
from flask_app.controllers import user_controllers, settings_controller, score_controller, song_controller
from flask_cors import CORS
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

if __name__ == '__main__':
    app.run(debug=True)