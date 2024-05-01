import './map.css';
import {
    APIProvider,
    Map,
    useMap,
    AdvancedMarker,
    useMapsLibrary
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { useEffect, useState, useRef } from "react";

export default function Intro() {
    function randomize() {
        return Math.random();
    }
    const holes: [number, number, number][] = [
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

    const pass = holes.map(([lat, lng, danger]) => ({
        lat,
        lng,
        key: JSON.stringify({ danger, lat, lng }),
        danger: danger}))
    function mapDblClick(event: any) {
        const newLat = event.detail.latLng.lat;
        const newLng = event.detail.latLng.lng;


    }
    const [triggerMarkers, setTriggerMarkers] = useState(false);
   
    return (
        <div style={{
            height: '75vh',
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
        }}>
            <APIProvider apiKey={import.meta.env.VITE_API_KEY}>
                <Map
                    defaultCenter={{ lat: 36.6, lng: 10 }}
                    defaultZoom={9}
                    mapId={import.meta.env.VITE_MAP_ID}
                    onClick={mapDblClick}
                >
                    <Markers points={pass}
                    />
                    <Directions />
                </Map>
            </APIProvider>

        </div>

    );
}

type Point = google.maps.LatLngLiteral & { key: string } & { danger: number };
type Props = { points: Point[] };

const Markers = ({ points }: Props) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
    const clusterer = useRef<MarkerClusterer | null>(null);

    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers((prev) => {
            if (marker) {
                return { ...prev, [key]: marker };
            } else {
                const newMarkers = { ...prev };
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };
    function selectClass(danger: number) {
        if (danger >= 0.66) {
            return "redDot"
        } else if (danger >= 0.33) {
            return "yellowDot"
        }
        return "greenDot"
    }
    return (
        <>
            {points.map((point) => (
                <AdvancedMarker
                    position={point}
                    key={point.key}
                    ref={(marker) => setMarkerRef(marker, point.key)}
                >
                    <span className={selectClass(point.danger)}></span>
                </AdvancedMarker>
            ))}
        </>
    );
};

function Directions() {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    useEffect(() => {
        if (!routesLibrary || !map) return;
        console.log("here1")
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));

    }, [routesLibrary, map])

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;

        directionsService.route({
            origin: "100 Front St, Toronto ON",
            destination: "500 College St, Toronto ON",
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true
        }).then((response) => {
            directionsRenderer.setDirections(response);
            setRoutes(response.routes);
            console.log("here2");
        });
    }), [directionsService, directionsRenderer]
    console.log(routes)

    return null
}

