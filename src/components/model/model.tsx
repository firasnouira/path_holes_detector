import './model.css';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import io from 'socket.io-client';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

interface MediaDeviceInfo {
    deviceId: string;
    kind: string;
    label: string; // Optional property
}

const socket = io('http://localhost:5000');
interface User {
    username: string;
    password: string;
  }
  
  interface ModelProps {
    loggedInUser: User | null;
    }
  
  const Model: React.FC<ModelProps> = ({ loggedInUser}) =>  {
    const [cameraIndex, setCameraIndex] = useState<string | null>(null); // Use null for optional camera index
    const [webcamRef, setWebcamRef] = useState<Webcam | null>(null); // Type WebcamRef based on react-webcam
    useEffect(() => {
        async function getCameras() {
            try {
                const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                if (videoDevices.length > 1) {
                    // Allow user to select camera from a dropdown if multiple cameras exist
                    // ... (implementation omitted for brevity)
                } else {
                    setCameraIndex(videoDevices[0].deviceId); // Use the only camera
                }
            } catch (error) {
                console.error('Error getting camera devices:', error);
            }
        }

        getCameras();
    }, []);

    useEffect(() => {
        fetchApi()

        const intervalId = setInterval(fetchApi, 1000); // Capture frames every 100ms (adjust as needed)

        return () => clearInterval(intervalId);
    }, []);

    const fetchApi = async () => {
        if (webcamRef) {
            const image = await webcamRef.getScreenshot();
            // Update state for display (optional)
            /* if (image) {
                // Store the latest image data in the re
                const formData = new FormData();
                formData.append('image', image);
                try {
                    const response = await axios.post('http://127.0.0.1:5000/api/detectStream', formData);
                    console.log(response.data.data); // Process the response from Flask
                } catch (error) {
                    console.error('Error sending image:', error);
                }
            } */
        }
    };
    /* const captureFrame = async () => {
      if (!webcamRef) {
        console.error('Webcam ref not available');
        return;
      }
    
      const imageSrc = await webcamRef.getScreenshot();
      // Send imageSrc and cameraIndex to Python server using fetch or WebSocket
      if (imageSrc) {
          sendImageToPython(imageSrc, cameraIndex);
      }
      // Assuming a function to send data
    };
    
    const sendImageToPython = async (imageSrc: string, cameraIndex: string | null) => {
      // Implement logic to send image data and camera index to Python server using fetch or WebSocket
      // Example using fetch:
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: imageSrc, cameraIndex }),
      });
      console.log(response)
      // Handle response from Python server
    };
    */

    const [data, setData] = useState<any>();
    useEffect(() => {
        socket.on('new_counts', (data) => {
            console.log('Received new data from server:', data);
            setData(data);
        });
        return () => {
            socket.off('new_counts');
        };
        /* onst eventSource = new EventSource('http://127.0.0.1:5000/api/stream');
        console.log("here")
        eventSource.onmessage = (event) => {
            console.log("here")
            console.log(event.data)
        };
        return () => eventSource.close(); */

    }, []);


    const [message, setMessage] = useState('Drop file here');
    const [file, setFile] = useState<File | null>(null);
    useState(()=>{
        
    })
    const [disableBtn,setDisableBtn] = useState(false)
   
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer?.files) {
            const droppedFile = event.dataTransfer.files[0];
            setFile(droppedFile);
            // Update message based on file extension
            const extension = droppedFile.name.split('.').pop()?.toLowerCase();
            if (extension) {
                setMessage(droppedFile.name);
            } else {
                setMessage('Select another file');
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a video to upload');
            return;
        }
        setDisableBtn(true)
        const formData = new FormData();
        formData.append('video', file);
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/detectVideo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.data);
            console.log(response.data.data)
            console.log(message)
        } catch (error) {
            console.error(error);
            setMessage('An error occurred during upload');
        }
        setDisableBtn(false)
    };

    const handleSelectPicture = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Accept only image files
        input.onchange = (e) => {
            const selectedFile = (e.target as HTMLInputElement).files?.[0];
            if (selectedFile) {
                setFile(selectedFile);
                setMessage(selectedFile.name);
               /*  handleUpload(); */ // Simulate upload behavior
            }
        };
        input.click();
    };

    const handleSelectVideo = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*'; // Accept only video files
        input.onchange = (e) => {
            const selectedFile = (e.target as HTMLInputElement).files?.[0];
            if (selectedFile) {
                setFile(selectedFile);
                setMessage(selectedFile.name);
                /* handleUpload(); */ // Simulate upload behavior
            }
        };
        input.click();
    };

    const launchCam = async () => {
        setDisableBtn(true)
        setMessage("processing steeam")
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/initStream', {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.data);
            console.log(response.data.data)
            console.log(message)
        } catch (error) {
            console.error(error);
            setMessage('An error occurred during upload');
        }
        setDisableBtn(false)
    };
    useEffect(() => {
        setDisableBtn(!loggedInUser);
      }, [loggedInUser]);
    
    return (
        <div>
            <div className="dropzone" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
                <div className="dropzone-inner">
                    <p>{message}</p>
                </div>
                <div className="button-container">
                    <Button variant="primary" size="sm" onClick={handleSelectPicture} disabled={disableBtn}>
                        Select Picture
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSelectVideo} disabled={disableBtn}>
                        Select Video
                    </Button>
                    <Button variant="secondary" size="sm" onClick={launchCam} disabled={disableBtn}>
                        launchCam
                    </Button>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    style={{ position: 'absolute', bottom: 10, right: 10, padding: '10px 20px', borderRadius: '10px' }}
                    onClick={handleUpload}
                    disabled={disableBtn}
                >
                    Upload
                </Button>
            </div>

            {/* {cameraIndex && <p>Using camera: {cameraIndex}</p>}
            <Webcam audio={false} ref={setWebcamRef} screenshotFormat="image/jpeg" /> */}
        </div>
    );
}

export default Model;


