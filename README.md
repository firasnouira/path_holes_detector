# Road Defect Detection & Reporting System

An AI-powered web application that detects road potholes in real time and lets citizens report them on a live interactive map — built toward a larger vision of community-driven road safety.

> **2nd-year Software Engineering end-of-year project — Faculté des Sciences de Monastir (2023–2024)**

---
---

## Live Demo

https://path-holes-detector-front.onrender.com

---
## The Vision

Every driver mounts a camera in their car. As they drive, the AI detects potholes in real time and pins them on a shared map. When a new user plans a trip, the system calculates the **danger score of each possible route** based on reported defects and recommends the safest path.

Think Waze, but for road quality.

---

## What's Implemented

- **AI Detection** — Upload an image, video, or use your webcam live; YOLOv8 draws bounding boxes around potholes and assigns a danger level (low / medium / high)
- **Dynamic Map Reporting** — User clicks a location on Google Maps, uploads media, and if a pothole is detected the pin is added to the shared map in real time
- **Citizen Reporting Form** — Anyone can manually report a defect with location and visual proof, no login required

---

## Not Yet Implemented

- Dashcam hardware integration (real-time feed from moving vehicles)
- Route danger scoring and smart route recommendation

These are the natural next steps and were always the intended end goal — scope was limited to the detection and reporting pipeline for this academic phase.

---

## How the AI Works

Fine-tuned **YOLOv8s** on a labeled pothole dataset from Roboflow, trained on Google Colab (free Tesla K80 GPU).

| Split | Images |
|-------|--------|
| Train | 465 |
| Validation | 133 |
| Test | 67 |

After fine-tuning, detection was significantly more precise with fewer false positives compared to the base pre-trained model.

[Dataset on Roboflow](https://public.roboflow.com/object-detection/pothole/1/download) · 📸 Training screenshots below

><img width="1916" height="907" alt="Screenshot 2024-05-26 122138" src="https://github.com/user-attachments/assets/3adc4ef2-96b3-4dd5-87c8-e8b4a0c8b8d5" />

><img width="775" height="134" alt="Screenshot 2024-05-26 122358" src="https://github.com/user-attachments/assets/35c58e85-f551-4134-8352-dd96c8655d48" />

><img width="1444" height="813" alt="Screenshot 2024-05-26 123017" src="https://github.com/user-attachments/assets/3b8c553c-090f-44b1-8515-a4e3320ee44d" />

><img width="1402" height="722" alt="Screenshot 2024-05-26 123308" src="https://github.com/user-attachments/assets/2c3b2d8a-595f-4600-89a6-74c32397665e" />


---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript |
| Backend | Python + Flask |
| AI Model | YOLOv8s (Ultralytics) via PyTorch |
| In-browser inference | TensorFlow.js |
| Maps | React Google Maps |
| HTTP | Axios |
| Training | Google Colab |

---

## Architecture
<img width="889" height="385" alt="image" src="https://github.com/user-attachments/assets/9f3f29be-3bdc-4dec-844f-0d1a32c597a1" />


```
<img width="889" height="385" alt="image" src="https://github.com/user-attachments/assets/d2a6bc4d-67fe-44fb-b7ed-fedffedbb7bf" />

```

