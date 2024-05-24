import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';

interface MediaDeviceInfo {
    deviceId: string;
    kind: string;
    label: string; // Optional property
}

function Model() {
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

            if (image) {
                // Store the latest image data in the re
                const formData = new FormData();
                formData.append('image', image as string);
                try {
                    const response = await axios.post('http://127.0.0.1:5000/detectStream', formData);
                    console.log(response.data.data); // Process the response from Flask
                } catch (error) {
                    console.error('Error sending image:', error);
                }
            }
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
      const response = await fetch('/detect', {
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

        const eventSource = new EventSource('http://127.0.0.1:5000/stream');
        console.log("here")
        eventSource.onmessage = (event) => {
            console.log("here")
            console.log(event.data)
        };
        return () => eventSource.close();

    }, []);


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setMessage('');
        }
    };
    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Please select a video to upload');
            return;
        }
        const formData = new FormData();
        formData.append('video', selectedFile);
        try {
            const response = await axios.post('http://127.0.0.1:5000/detectVideo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            console.log(response.data.message)
            console.log(message)
        } catch (error) {
            console.error(error);
            setMessage('An error occurred during upload');
        }
    };
    return (

        <div>
            <div>
                <input type="file" accept="video/*" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload Video</button>
                <p>{message}</p>
            </div>
            {cameraIndex && <p>Using camera: {cameraIndex}</p>}
            <Webcam audio={false} ref={setWebcamRef} screenshotFormat="image/jpeg" />
        </div>
    );
}

export default Model;


