FROM python:3.7-alpine
COPY . /app
WORKDIR /app
RUN pip install .
RUN vm_management_dev create-db
RUN vm_management_dev populate-db
RUN vm_management_dev add-user -u admin -p admin
EXPOSE 5000
CMD ["vm_management_dev", "run"]
