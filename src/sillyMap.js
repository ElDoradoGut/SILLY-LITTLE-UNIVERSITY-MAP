import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, LayersControl, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";

// Componente para controlar las rutas
const RoutingControl = ({ waypoints }) => {
    const map = useMap();

    useEffect(() => {
        const control = L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: true,
            createMarker: () => null,
            addWaypoints: false,
            draggableWaypoints: false,
            lineOptions: {
                styles: [{ color: 'blue', weight: 4 }]
            },
            show: false,
            collapsible: true
        }).addTo(map);

        control.on('routesfound', function (e) {
            const routes = e.routes;
            console.log('Se encontraron rutas:', routes);
        });

        return () => {
            map.removeControl(control);
        };
    }, [map, waypoints]);

    return null;
};

// Componente principal del mapa
const MapaSilly = () => {
    const mapRef = useRef(null);
    const latitud = 21.942182926382465;
    const longitud = -102.24716316446698;

    const customIcon = new L.Icon({
        iconUrl: `${process.env.PUBLIC_URL}/pin.png`,
        iconSize: [25, 25],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const ubicaciones = [
        { lat: 21.942125, lng: -102.247522, texto: "Edificio A", detalle: "Edificio principal con oficinas y salas de reuniones." },
        { lat: 21.941976, lng: -102.248214, texto: "Edificio B", detalle: "Laboratorios y salas de informática." },
        { lat: 21.942202, lng: -102.246299, texto: "Edificio C", detalle: "Biblioteca y sala de estudio." },
        { lat: 21.942800, lng: -102.247126, texto: "Cafetería", detalle: "Cafetería con servicio de desayuno y almuerzo." },
        { lat: 21.942576, lng: -102.246857, texto: "Velaria", detalle: "Área de eventos al aire libre." },
        { lat: 21.941711, lng: -102.246489, texto: "Entrada", detalle: "Entrada principal al campus." },
        { lat: 21.942209, lng: -102.245715, texto: "Cancha de Fútbol", detalle: "Campo de fútbol para actividades deportivas." },
        { lat: 21.941485, lng: -102.248048, texto: "Cancha de Americano", detalle: "Campo de fútbol americano." },
    ];

    const [waypoints, setWaypoints] = useState([L.latLng(21.941711, -102.246489)]);
    const [selectedInfo, setSelectedInfo] = useState(null); // Estado para la información seleccionada

    // Componente para manejar eventos de clic en el mapa
    const MapClickHandler = () => {
        useMapEvents({
            click: () => {
                setSelectedInfo(null); // Limpiar la información seleccionada al hacer clic fuera de los marcadores
            },
        });
        return null;
    };

    const handleMarkerClick = (ubicacion) => {
        setWaypoints([L.latLng(21.941711, -102.246489), L.latLng(ubicacion.lat, ubicacion.lng)]);
        setSelectedInfo(ubicacion); // Actualizar la información seleccionada al hacer clic en un marcador
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Contenedor para el card a la izquierda */}
            <div style={{ width: '300px', padding: '10px', backgroundColor: '#f8f9fa', borderRight: '1px solid #dee2e6', display: selectedInfo ? 'block' : 'none' }}>
                {selectedInfo && (
                    <div>
                        <h3>{selectedInfo.texto}</h3>
                        <p>{selectedInfo.detalle}</p>
                    </div>
                )}
            </div>

            {/* Contenedor del mapa */}
            <div style={{ flexGrow: 1 }}>
                <MapContainer
                    center={[latitud, longitud]}
                    zoom={20}
                    ref={mapRef}
                    scrollWheelZoom={true}
                    style={{ height: "100vh", width: "100%" }}
                    zoomControl={true}
                >
                    <MapClickHandler />
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer name="Vista de Calle">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer checked name="Vista Satelital">
                            <TileLayer
                                attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a> contributors'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    {ubicaciones.map((ubicacion, index) => (
                        <Marker
                            key={index}
                            position={[ubicacion.lat, ubicacion.lng]}
                            icon={customIcon}
                            eventHandlers={{
                                click: () => handleMarkerClick(ubicacion), // Manejador para click en el marcador
                            }}
                        />
                    ))}
                    <RoutingControl waypoints={waypoints} />
                </MapContainer>
            </div>
        </div>
    );
};

export default MapaSilly;
