import './mapForm.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { Modal, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

interface PopupModalProps {
  showAddHolePopup: boolean;
  handleModalClose: () => void;
  onDanger: (data: number) => void;
}
const socket = io('http://localhost:5000');
const PopupModal: React.FC<PopupModalProps> = ({ showAddHolePopup, handleModalClose, onDanger }) => {
  const [dangerValue, setDangerValue] = useState(0);
  useState(()=>{
    onDanger(dangerValue);
  })
  const handleDangerChange = (event: any) => {
    setDangerValue(event.target.value)
    onDanger(dangerValue);
  };
  /* const handleAddHoleSubmit = (event: any) => {
    if (selectedLocation?.lat && selectedLocation?.lng) {
      const newPoint = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        key: JSON.stringify({ danger: dangerValue, lat: selectedLocation.lat, lng: selectedLocation.lng }),
        danger: dangerValue,
      };
      
    }

  } */
  const [message, setMessage] = useState<any>('Drop file here');
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const droppedFile = event.dataTransfer.files[0];


      const extension = droppedFile.name.split('.').pop()?.toLowerCase();
      if (extension) {
        setMessage(<img src={URL.createObjectURL(droppedFile)} alt="Uploaded" style={{ width: '300px', height: 'auto' }} />);
        setFile(droppedFile);
      } else {
        setMessage('Select another file');
      }
    }
  };
  const handleSelectPicture = () => {
    setImageD(null)
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // Accept only image files
    input.onchange = (e) => {
      const selectedFile = (e.target as HTMLInputElement).files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        setMessage("PROCESSING...");
      }
    };
    input.click();
  };
  const [imageD, setImageD] = useState<string | null>()
  const handleUpload = async () => {

    if (!file) {
      setMessage('Please select a video to upload');
      return;
    }
    onDanger(dangerValue);
    const formData = new FormData();
    formData.append('image', file);
    setFile(null)
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/detectImage', formData, {
        responseType: 'blob'
      });
      if (response.headers['content-type'] === 'application/json') {
        // Convert the blob to text to check the JSON content
        const reader = new FileReader();
        reader.onload = function () {
          const jsonResponse = JSON.parse(reader.result as string);
          setMessage(jsonResponse.message);
          setImageD(null);
        };
        reader.readAsText(response.data);
      } else {
        const imageUrl = URL.createObjectURL(response.data);
        setImageD(imageUrl);
        setMessage('');
        
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred');
    }
  };
  const handleClose = () => {
    setFile(null)
    setImageD(null)
    setMessage("Drop file here")
    handleModalClose()
  }
  return (
    <>
      <Modal show={showAddHolePopup} onHide={handleClose} centered size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Add New Hole</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className='customModal'>
            {!file && !imageD && <div className="Mapdropzone left" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
              <div className="dropzone-inner">
                <p>{message}</p>
              </div>
            </div>}
            {file && !imageD &&
              <div className="mapPic left">
                <img src={URL.createObjectURL(file)} alt="Uploaded" style={{ width: '100%', height: '100%' }} />
              </div>}
            {imageD && <div className="mapPic left">
              <img src={imageD} alt="Annotated Image" style={{ width: '100%', height: '100%' }} />
            </div>
            }

            <div className='right'>
              <Form.Group>
                <Form.Label>Danger Level</Form.Label>
                <Form.Control type="number" value={dangerValue} onChange={handleDangerChange} placeholder="Enter danger level" />
              </Form.Group>
              <div className="Mapbutton-container">
                <Button variant="primary" size="sm" onClick={handleSelectPicture}>
                  Select Picture
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  style={{ bottom: 10, right: 10, padding: '10px 20px', borderRadius: '10px' }}
                  onClick={handleUpload}>
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
export default PopupModal;