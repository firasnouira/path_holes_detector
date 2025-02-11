# Base image for the React app
FROM node:22-slim 
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install
COPY ./ ./


RUN npm run build 

EXPOSE 3000 
CMD [ "npm","run","preview" ]
 





# Base image for the Flask ap
FROM python:3.9-slim
WORKDIR /app
COPY flask/ ./flask

WORKDIR /app/flask
RUN pip install --no-cache-dir flask
RUN pip install --no-cache-dir opencv-python
RUN pip install --no-cache-dir numpy
RUN pip install --no-cache-dir ultralytics
RUN pip install --no-cache-dir flask-cors
RUN pip install --no-cache-dir flask-socketio

EXPOSE 3000 5000
#Command to run the Flask app
CMD ["flask", "run", "--host=127.0.0.1", "--port=5000"]
