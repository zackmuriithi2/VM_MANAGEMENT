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
@admin_required
def create_vm():
    current_user = get_jwt_identity()
    print(f"Current user=> {current_user}")
    user = User.query.filter_by(username=current_user).first()

    data = request.json
    vm_name = data['name']

    container = Docker.create_container(vm_name)
    print(container)

    if isinstance(container, dict):
        return container

    new_vm = VM(name=vm_name, owner_id=user.id, status='created', container_id=container.id)
    db.session.add(new_vm)
    db.session.commit()

    return jsonify({'message': 'Success', 'container_id': container.id}), 201


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
    

@routes.route('/signup', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']
    role = data.get('role', 'user')

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
        return jsonify(role=user.role, access_token=access_token), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


@routes.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()  # Fetch all users
    user_list = [{'id': user.id, 'username': user.username, 'role': user.role} for user in users]
    return jsonify(user_list), 200


@routes.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)  # Fetch user by ID
    if user:
        return jsonify({'id': user.id, 'username': user.username, 'role': user.role}), 200
    else:
        return jsonify({'message': 'User not found'}), 404


@routes.route('/vms', methods=['GET'])
def get_vms():
    vms = VM.query.all()  # Fetch all VMs
    vm_list = [{'id': vm.id, 'name': vm.name, 'owner_id': vm.owner_id, 'status': vm.status} for vm in vms]
    return jsonify(vm_list), 200


@routes.route('/vms/<int:vm_id>', methods=['GET'])
def get_vm(vm_id):
    vm = VM.query.get(vm_id)
    if vm:
        return jsonify({'id': vm.id, 'name': vm.name, 'status': vm.status}), 200
    else:
        return jsonify({'message': 'VM not found'}), 404
