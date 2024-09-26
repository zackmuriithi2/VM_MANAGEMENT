FROM python:3.12-slim

WORKDIR /vm-management
COPY . /vm-management
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development

CMD ["python", "app.py"]