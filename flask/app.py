import os
from flask import Flask, jsonify, request ,Response
import cv2
import numpy as np
from ultralytics import YOLO,solutions
from ultralytics.solutions import object_counter
from flask_cors import CORS
import time
import datetime
# Load YOLOv8 model (replace with your model path)
model = YOLO('C:/Users/HP/Desktop/University/2eme/sem2/pfa/flask/best.pt')

app = Flask(__name__)
cors = CORS(app)

""" @app.route('/detectImage', methods=['POST'])
def detectImag(){
  return 0
} """
triggere = False
@app.route('/stream')
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
   
import threading

@app.route('/detectVideo',methods=['POST'])
async def detectVideo():
  video_path = os.path.join(app.root_path, 'uploads', request.files['video'].filename)
  os.makedirs(os.path.dirname(video_path), exist_ok=True)
  request.files['video'].save(video_path)
  cap = cv2.VideoCapture(video_path)
  assert cap.isOpened(), "Error reading video file"
  w, h, fps = (int(cap.get(x)) for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS))
  region_points = [(20, 400), (1080, 404), (1080, 360), (20, 360)]
  video_writer = cv2.VideoWriter("object_counting_output.avi", cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))
  counter = object_counter.ObjectCounter()
  counter.set_args(view_img=True, reg_pts=region_points, classes_names=model.names, draw_tracks=False)
  count = 0
  st=True
  async def wait():
    x = True
    
    while cap.isOpened() and x:
      success, im0 = cap.read()

      if not success:
        print("Video frame is empty or video processing has been successfully completed.")
        break
      key = cv2.waitKey(1)
      if key == ord('q'):  # <-------------- KEY BOARD KEY HERE
            x = False
            break
      tracks = model.track(im0, persist=True, show=False)
      im0 = counter.start_counting(im0, tracks)
      video_writer.write(im0)
      counted = counter.in_counts
    print(counted)
    cap.release()
    video_writer.release()
    cv2.destroyAllWindows()
    return counted
  return jsonify({'success': True, 'message': await wait()})
@app.route('/detectStream',methods=['POST'])
def detectStream():
  data =request.files['image']
  img = cv2.imread(data)    
      # Run object detection using your YOLOv8 model
  res = model(img)
  if res:
    i=0
    for re in res:
      for box in re.boxes:
        i+=1
    return jsonify({'data' : f'count {i}'})
  return jsonify({'data':'imagenotfound'})
if __name__ == '__main__':
  app.run(debug=True, port=5000)