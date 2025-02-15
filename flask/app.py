import base64
from io import BytesIO
import os
from flask import Flask, jsonify, request ,Response, send_file
import cv2
import numpy as np
from ultralytics import YOLO,solutions
from ultralytics.solutions import object_counter
from flask_cors import CORS
from flask_socketio import SocketIO, emit

from collections import Counter
  
import threading
import time
import datetime
import random 
model = YOLO("flask/model/best.pt")

app = Flask(__name__)
cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*") 

def detected(count):
   socketio.emit("new_counts",count)
def randomize():
  return random.random()
holes = [
        [36.77008966161865, 10.196820932331722, randomize()],
        [36.77380229613168, 10.19810839265887, randomize()],
        [36.76513920260766, 10.196220117512386, randomize()],
        [36.77146473240095, 10.188323694172542, randomize()],
        [36.73033946229021, 10.19484682649676, randomize()],
        [36.72813815764172, 10.15914126009051, randomize()],
        [36.71160658051878, 10.285263560357532, randomize()],
        [36.69619236460234, 10.168533824029407, randomize()],
        [36.631198497063565, 10.127335093560657, randomize()],
        [36.617972690143326, 10.124588511529407, randomize()]
    ]
@app.route('/api/getData', methods=['POST'])
def getData():
    """ socketio.emit('holes_data', holes) """
    return jsonify({'response':holes})
triggere = False
def read_image_from_base64(base64_image):
    image_data = base64.b64decode(base64_image.split(",")[1])
    np_array = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    
    return image
""" input_image = cv2.resize(image, (640, 640))
  input_image = np.expand_dims(input_image, axis=0)  # Add batch dimension
  input_image = np.transpose(input_image, (0, 3, 1, 2))  """


@app.route('/api/detectImage', methods=['POST'])
def detectImag():
  
  image = request.files['image']
  image = cv2.imread(image)
  image = cv2.resize(image, (640 , 640))
  # Rearrange dimensions to [1, 3, 640, 640]
  results = model(image,show=True)
  
  detections = []
  for result in results:
        boxes = result.boxes.cpu().numpy()
        xyxys = boxes.xyxy
        for xyxy in xyxys:
            x1, y1, x2, y2 = int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
            detections.append({
                'box': [x1, y1, x2, y2]
            })
    
    # Convert the annotated image to a format suitable for sending as a response
  _, buffer = cv2.imencode('.jpg', image)
  image_io = BytesIO(buffer)
  if len(detections) > 0:
    detected(len(detections))
    return send_file(image_io, mimetype='image/jpeg')
  else:
    return jsonify({'message': 'no detections'})

  



@app.route('/api/detectVideo',methods=['POST'])
def detectVideo():
  video_path = os.path.join(app.root_path, 'uploads', request.files['video'].filename)
  os.makedirs(os.path.dirname(video_path), exist_ok=True)
  request.files['video'].save(video_path)
  cap = cv2.VideoCapture(video_path)
  assert cap.isOpened(), "Error reading video file"
  fps = cap.get(cv2.CAP_PROP_FPS)
  if fps>60:
     fps=60
  new_width = 640  
  new_height = 640
  cap.set(cv2.CAP_PROP_FRAME_WIDTH, new_width)
  cap.set(cv2.CAP_PROP_FRAME_HEIGHT, new_height)
    
  region_points = [(0, 500)#(x,y)top right
                   ,(640, 500)#(x,y)top left
                   ,(640, 360)#(x,y) bottom right
                   ,(0, 360)#(x,y)bottom left
                   ]
  video_writer = cv2.VideoWriter("object_counting_output.avi", cv2.VideoWriter_fourcc(*"mp4v"), fps, (new_width, new_height))
  counter = object_counter.ObjectCounter()
  counter.set_args(view_img=True, reg_pts=region_points, classes_names=model.names, draw_tracks=True)
  
  windowClosed = False
  old_count=0
  new_counts=0
  while cap.isOpened() and not windowClosed:
    success, im0 = cap.read()
    if not success:
      print("Video frame is empty or video processing has been successfully completed.")
      break
    key = cv2.waitKey(1)      
    if key == ord('q'):      #KEYBOARD KEY <--------------------
          windowClosed = True
          break
    im0 = cv2.resize(im0, (640, 640))
    tracks = model.track(im0, persist=True, show=False)
    im0 = counter.start_counting(im0, tracks)
    video_writer.write(im0)

    new_counts = counter.in_counts
    if old_count != new_counts :
      detected(new_counts-old_count)
      old_count=new_counts
      
  cap.release()
  video_writer.release()
  cv2.destroyAllWindows()
    
  return jsonify({'success': True, 'message':  f"finished with {new_counts} potholes counted"})


#for initialising flask stream
@app.route('/api/initStream',methods=['POST'])
def initStream():
  cap = cv2.VideoCapture(0)
  assert cap.isOpened(), "Error reading stream file"

  region_points = [(0, 500)#(x,y)fo9 al imin 
                   ,(640, 500)#(x,y)fo9 al isar 
                   ,(640, 360)#(x,y) louta al imin 
                   ,(0, 360)#(x,y) louta al isar
                   ]
  video_writer = cv2.VideoWriter("object_counting_output.avi", cv2.VideoWriter_fourcc(*"mp4v"), 30, (640, 640))
  counter = object_counter.ObjectCounter()
  counter.set_args(view_img=True, reg_pts=region_points, classes_names=model.names, draw_tracks=True)
  
  windowClosed = False
  old_count=0
  new_counts=0
  while cap.isOpened() and not windowClosed:
    success, im0 = cap.read()
    if not success:
      print("stream frame is empty or stream processing has been successfully completed.")
      break
    key = cv2.waitKey(0)      
    if key == ord('q'):      #KEYBOARD KEY <--------------------
          windowClosed = True
          break
    im0 = cv2.resize(im0, (640, 640))
    tracks = model.track(im0, persist=True, show=False,conf=0.7)
    im0 = counter.start_counting(im0, tracks)
    video_writer.write(im0)
    new_counts = counter.in_counts
    if old_count != new_counts :
      old_count=new_counts
      socketio.emit('new_counts', new_counts)
  cap.release()
  video_writer.release()
  cv2.destroyAllWindows()
  return jsonify({'success': True, 'message':  f"finished with {new_counts} potholes counted"})








#for getting react stream
@app.route('/api/detectStream',methods=['POST'])
def detectStream():
  if 'image' not in request.form:
    return jsonify({'error': 'No image provided'}), 400
  base64_image = request.form['image']
  image = read_image_from_base64(base64_image)    
  results = model(image)
  detections = []
  for result in results:
    for box in result.boxes:
      detections.append({
        'class': int(box.cls),  
        'confidence': float(box.conf),  
        'box': box.xyxy.tolist()  
    })

  return jsonify({'data': detections})
  
  



# Dummy database for user storage
users = {
    'user1': {'username': 'user1', 'password': 'password1'},
    'user2': {'username': 'user2', 'password': 'password2'}
}

@app.route('/login', methods=['POST','GET'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    if username in users and users[username]['password'] == password:
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/signup', methods=['POST','GET'])
def signup():
    data = request.json
    username = data['username']
    password = data['password']
    if username in users:
        return jsonify({'message': 'Username already exists'}), 400
    else:
        users[username] = {'username': username, 'password': password}
        return jsonify({'message': 'Signup successful'})


  
if __name__ == '__main__':
  app.run(debug=True, port=5000)




""" @app.route('/stream')
def stream():
  
  data = 3
  toReturn = True
  def detect_new_potholes(data):
    data +=1
    global triggere
    if triggere:
      yield f"data: {data} \n\n"
  return Response(detect_new_potholes(data), mimetype='text/event-stream')
  def callable():
  data = 3
  toReturn = True
  def detect_new_potholes(data):
    data +=1
    global triggere
    yield f"data: {data} \n\n"
  return Response(detect_new_potholes(data), mimetype='text/event-stream')
 """