from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from src.models import db
from src.routes import routes
from src.config import Config
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

app.register_blueprint(routes)


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)