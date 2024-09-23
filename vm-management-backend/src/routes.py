from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .manage_docker import Docker
from .models import db, User, VM
from .utils import admin_required, user_required

routes = Blueprint('routes', __name__)

@routes.route('/', methods=['GET'])
def ping():
    return "pong"

@routes.route('/create_vm', methods=['POST'])
@jwt_required()
@user_required
def create_vm():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    data = request.json
    vm_name = data['name']

    container = Docker.create_container(vm_name)

    if isinstance(container, dict):
        return container

    new_vm = VM(name=vm_name, owner_id=user.id, status='running', container_id=container.id)
    db.session.add(new_vm)
    db.session.commit()

    return jsonify({'message': 'VM (container) created', 'container_id': container.id}), 201


@routes.route('/start_vm/<int:vm_id>', methods=['PUT'])
@jwt_required()
@user_required
def start_vm(vm_id):
    current_user = get_jwt_identity()
    vm = VM.query.filter_by(id=vm_id).first()

    if vm and vm.owner.username == current_user:
        response = Docker.start_container(vm.container_id)
        vm.status = 'running'
        db.session.commit()
        return response
    else:
        return jsonify({'message': 'Not authorized to start this VM'}), 403


@routes.route('/stop_vm/<int:vm_id>', methods=['PUT'])
@jwt_required()
@user_required
def stop_vm(vm_id):
    current_user = get_jwt_identity()
    vm = VM.query.filter_by(id=vm_id).first()

    if vm and vm.owner.username == current_user:
        response = Docker.stop_container(vm.container_id)
        vm.status = 'stopped'
        db.session.commit()
        return response
    else:
        return jsonify({'message': 'Not authorized to stop this VM'}), 403
    

@routes.route('/delete_vm/<int:vm_id>', methods=['DELETE'])
@jwt_required()
@user_required
def delete_vm(vm_id):
    current_user = get_jwt_identity()
    vm = VM.query.filter_by(id=vm_id).first()

    if vm and vm.owner.username == current_user:
        response = Docker.remove_container(vm.container_id)
        db.session.delete(vm)
        db.session.commit()
        return response
    else:
        return jsonify({'message': 'Not authorized to delete this VM'}), 403
    

@routes.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']
    role = data.get('role', 'User')

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'User already exists'}), 400

    user = User(username=username, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@routes.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()

    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# @routes.route('/create_vm', methods=['POST'])
#
