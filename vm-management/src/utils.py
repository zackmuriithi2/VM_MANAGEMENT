from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from .models import User

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()

        if user.role != 'admin':
            return jsonify({'message': 'Admins only!'}), 403
        return f(*args, **kwargs)

    return decorated_function

def user_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()

        if user.role not in ['admin', 'user']:
            return jsonify({'message': 'Access denied!'}), 403
        return f(*args, **kwargs)

    return decorated_function
