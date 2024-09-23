import docker
from flask import jsonify

client = docker.from_env()

class Docker:
    def __init__():
        pass
    

    @staticmethod
    def create_container(vm_name):
        try:
            image = "ubuntu:latest"
            container = client.containers.run(
                image,
                name=vm_name,
                detach=True,
                tty=True
            )
            return container
        except docker.errors.APIError as e:
            return {'error': str(e)}, 500


    @staticmethod
    def start_container(container_id):
        try:
            container = client.containers.get(container_id)
            container.start()
            return jsonify({'message': 'Container started successfully'}), 200
        except docker.errors.NotFound:
            return jsonify({'message': 'Container not found'}), 404
        except docker.errors.APIError as e:
            return jsonify({'error': str(e)}), 500


    @staticmethod
    def stop_container(container_id):
        try:
            container = client.containers.get(container_id)
            container.stop()
            return jsonify({'message': 'Container stopped successfully'}), 200
        except docker.errors.NotFound:
            return jsonify({'message': 'Container not found'}), 404
        except docker.errors.APIError as e:
            return jsonify({'error': str(e)}), 500
        

    @staticmethod
    def remove_container(container_id):
        try:
            container = client.containers.get(container_id)
            container.remove(force=True)
            return jsonify({'message': 'Container removed successfully'}), 200
        except docker.errors.NotFound:
            return jsonify({'message': 'Container not found'}), 404
        except docker.errors.APIError as e:
            return jsonify({'error': str(e)}), 500
