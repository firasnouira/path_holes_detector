import { Button, Form, Modal } from 'react-bootstrap';
import './map.css';

/* import { GoogleMap, useJsApiLoader, useGoogleMap } from "@react-google-maps/api" */
import {
    APIProvider,
    Map,
    AdvancedMarker
} from '@vis.gl/react-google-maps'
import { useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

/* async function fetchHolesData() {
    const response = await fetch('your_database_endpoint'); 
    const data = await response.json();
    return data; 
  } */
/*   const holes = data.map((hole) => {
    const [lat, lng, danger] = hole;
    return { position: { lat, lng }, danger };
    [-34.397, 152.7, 0],
});
 */

const data: [number, number, number][] = [
    [36.77008966161865, 10.196820932331722, 0],
    [36.77380229613168, 10.19810839265887, 0],
    [36.76513920260766, 10.196220117512386, 0],
    [36.77146473240095, 10.188323694172542, 0],
    [36.73033946229021, 10.19484682649676, 0],
    [36.72813815764172, 10.15914126009051, 0],
    [36.71160658051878, 10.285263560357532, 0],
    [36.69619236460234, 10.168533824029407, 0],
    [36.631198497063565, 10.127335093560657, 0],
    [36.617972690143326, 10.124588511529407, 0]
]
const m: any[] = [];
const markerCluster = new MarkerClusterer({
    markers: m,
    map:import.meta.env.VITE_MAP_ID
    
  });
function saveComponent() {
    const [holes, setHoles] = useState(data.map((hole: [number | null, number | null, number | null]) => {
        const [lat, lng, danger]: [number | null, number | null, number | null] = hole;
        return { position: { lat, lng }, danger };
    }))
    const [markers, setMarkers] = useState(holes);
    const [map,setMap] = useState(null);
    
    const position = {
        lat: 36.80578053424174,
        lng: 10.172419404260333
    }
   
    function displayMarkers() {
        return markers.map((marker: any) => {
            return (
                <AdvancedMarker key={marker.position.lat + marker.position.lng + marker.danger} position={marker.position} ></AdvancedMarker>
            )
        })
    }


    /* popup logic */
    const [showAddHolePopup, setShowAddHolePopup] = useState(false);
    const [dangerValue, setDangerValue] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number | null, lng: number | null }>({ lat: null, lng: null });
    function mapDblClick(event: any) {
        setSelectedLocation(event.detail.latLng);
        console.log(event.detail.latLng);
        setShowAddHolePopup(true);
    }
    function AddHoleSubmit(event: any) {

    }
    /* const handlePopupClose = () => setShowAddHolePopup(false); */
    const handleDangerChange = (event: any) => setDangerValue(event.target.value);
    const handleAddHoleSubmit = (event: any) => {
        event.preventDefault();
        console.log(selectedLocation.lat, selectedLocation.lng);

        const danger = dangerValue;
        setMarkers([...markers, { position: { lat: selectedLocation.lat, lng: selectedLocation.lng }, danger: danger }]);
        
        /* console.log("hole at" ,newMarker.lat," , ",newMarker.lng,"  /danger :", danger)*/
        
        setDangerValue(0);
        setSelectedLocation({ lat: null, lng: null });
        setShowAddHolePopup(false);
        markers.map((marker: any) => { console.log(marker.position) });
    };
    const handleModalClose = () => {
        setShowAddHolePopup(false);
    };
    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_API_KEY} >
                <div style={{
                    height: '75vh',
                    width: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    <Map defaultZoom={9} defaultCenter={position} mapId={import.meta.env.VITE_MAP_ID} onClick={mapDblClick}>
                        
                        { displayMarkers() }

                        {/*  {newMarker && (
                            <Marker // Render newly added marker if newMarker state is not null
                                key="new-marker"
                                position={newMarker.position}
                            // Add custom styles for the new marker (optional)
                            />
                        )} */}

                    </Map>
                    {showAddHolePopup && (
                        <Modal show={showAddHolePopup} onHide={handleModalClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add New Hole</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleAddHoleSubmit}>

                                    <Form.Group controlId="dangerLevel">
                                        <Form.Label>Danger Level</Form.Label>
                                        <Form.Control type="number" value={dangerValue} onChange={handleDangerChange} placeholder="Enter danger level" />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" style={{ marginTop: "10px", position: "relative", left: "100%", marginLeft: "-75px" }}>
                                        Submit
                                    </Button>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    )}
                </div>
            </APIProvider >

        </>
    )

}

export default saveComponent;




/*----------------------------------------------------------------*/


