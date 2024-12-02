import React, { useRef, useEffect, useState } from "react"; // Importamos React y algunos hooks de React.
import { MapContainer, TileLayer, LayersControl, Marker, Popup, useMap } from "react-leaflet"; // Importamos componentes de react-leaflet.
import "leaflet/dist/leaflet.css"; // Importamos los estilos CSS de Leaflet.
import L from "leaflet"; // Importamos la biblioteca Leaflet.
import "leaflet-routing-machine"; // Importamos la extensión leaflet-routing-machine para el enrutamiento.

const RoutingControl = ({ waypoints }) => { // Definimos un componente funcional que recibe `waypoints` como prop.
    const map = useMap(); // Utilizamos el hook useMap para obtener la instancia del mapa.

    useEffect(() => { // Utilizamos useEffect para ejecutar efectos secundarios.
        const control = L.Routing.control({ // Creamos el control de rutas.
            waypoints: waypoints, // Establecemos los waypoints.
            routeWhileDragging: true, // Permitimos el enrutamiento mientras se arrastran los puntos.
            createMarker: () => null, // No creamos marcadores adicionales.
            addWaypoints: false, // No permitimos agregar waypoints.
            draggableWaypoints: false, // Deshabilitamos los waypoints arrastrables.
            lineOptions: { // Opciones de estilo para la línea de ruta.
                styles: [{ color: 'blue', weight: 4 }] // Estilo de la línea: color azul y grosor 4.
            },
            show: false, // Ocultamos el panel de instrucciones.
            collapsible: true // Permitimos que el panel sea colapsable.
        }).addTo(map); // Añadimos el control de rutas al mapa.

        control.on('routesfound', function (e) { // Añadimos un evento que se ejecuta cuando se encuentran rutas.
            const routes = e.routes; // Obtenemos las rutas encontradas.
            console.log('Se encontraron rutas:', routes); // Mostramos las rutas en la consola.
        });

        return () => { // Cleanup function que se ejecuta cuando el componente se desmonta.
            map.removeControl(control); // Eliminamos el control de rutas del mapa.
        };
    }, [map, waypoints]); // Ejecutamos el efecto cuando `map` o `waypoints` cambian.

    return null; // No renderizamos nada desde este componente.
};

const MapaSilly = () => { // Definimos el componente principal del mapa.
    const mapRef = useRef(null); // Creamos una referencia para el contenedor del mapa.
    const latitud = 21.942182926382465; // Definimos la latitud inicial del mapa.
    const longitud = -102.24716316446698; // Definimos la longitud inicial del mapa.

    const customIcon = new L.Icon({ // Creamos un ícono personalizado para los marcadores.
        iconUrl: `${process.env.PUBLIC_URL}/pin.png`, // URL del ícono.
        iconSize: [25, 25], // Tamaño del ícono.
        iconAnchor: [12, 41], // Punto del ícono que corresponde a la ubicación del marcador.
        popupAnchor: [1, -34], // Punto desde el que debe abrirse el popup en relación con iconAnchor.
    });

    const ubicaciones = [ // Definimos las ubicaciones de los marcadores.
        { lat: 21.942125, lng: -102.247522, texto: "Edificio A" },
        { lat: 21.941976, lng: -102.248214, texto: "Edificio B" },
        { lat: 21.942202, lng: -102.246299, texto: "Edificio C" },
        { lat: 21.942800, lng: -102.247126, texto: "Cafetería" },
        { lat: 21.942576, lng: -102.246857, texto: "Velaria" },
        { lat: 21.941711, lng: -102.246489, texto: "Entrada" },
        { lat: 21.942209, lng: -102.245715, texto: "Cancha de Fútbol" },
        { lat: 21.941485, lng: -102.248048, texto: "Cancha de Americano" },
    ];

    const [waypoints, setWaypoints] = useState([ // Utilizamos useState para manejar los waypoints.
        L.latLng(21.941711, -102.246489) // Punto de inicio: Entrada.
    ]);

    const handleMouseOver = (e) => { // Función para manejar el evento mouseover en los marcadores.
        const marker = e.target; // Obtenemos el marcador del evento.
        marker.openPopup(); // Abrimos el popup del marcador.
    };

    const handleMouseOut = (e) => { // Función para manejar el evento mouseout en los marcadores.
        const marker = e.target; // Obtenemos el marcador del evento.
        marker.closePopup(); // Cerramos el popup del marcador.
    };

    const handleMarkerClick = (ubicacion) => { // Función para manejar el evento click en los marcadores.
        setWaypoints([ // Actualizamos los waypoints para la ruta.
            L.latLng(21.941711, -102.246489), // Punto de inicio: Entrada.
            L.latLng(ubicacion.lat, ubicacion.lng) // Punto de destino: ubicación del marcador.
        ]);
    };

    return ( // Renderizamos el contenedor del mapa y los componentes de react-leaflet.
        <MapContainer
            center={[latitud, longitud]} // Centramos el mapa en la latitud y longitud inicial.
            zoom={20} // Nivel de zoom inicial del mapa.
            ref={mapRef} // Asignamos la referencia al contenedor del mapa.
            scrollWheelZoom={true} // Permitimos el zoom con la rueda del mouse.
            style={{ height: "100vh", width: "100vw" }} // Estilo para ocupar todo el espacio disponible.
            zoomControl={true} // Mostramos los controles de zoom.
        >
            <LayersControl position="topright"> // Añadimos controles de capas al mapa.
                <LayersControl.BaseLayer name="Vista de Calle"> // Capa base para la vista de calle.
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // URL para obtener los mosaicos de OpenStreetMap.
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer checked name="Vista Satelital"> // Capa base para la vista satelital.
                    <TileLayer
                        attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a> contributors'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" // URL para obtener los mosaicos satelitales de Esri.
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            {ubicaciones.map((ubicacion, index) => ( // Iteramos sobre las ubicaciones para crear marcadores.
                <Marker
                    key={index} // Asignamos una clave única a cada marcador.
                    position={[ubicacion.lat, ubicacion.lng]} // Establecemos la posición del marcador.
                    icon={customIcon} // Utilizamos el ícono personalizado.
                    eventHandlers={{ // Asignamos manejadores de eventos al marcador.
                        mouseover: handleMouseOver, // Manejador para mouseover.
                        mouseout: handleMouseOut, // Manejador para mouseout.
                        click: () => handleMarkerClick(ubicacion), // Manejador para click.
                    }}
                >
                    <Popup> // Añadimos un popup al marcador.
                        {ubicacion.texto} // Mostramos el texto asociado a la ubicación en el popup.
                    </Popup>
                </Marker>
            ))}
            <RoutingControl waypoints={waypoints} /> // Añadimos el componente de control de rutas con los waypoints actuales.
        </MapContainer>
    );
};

export default MapaSilly; // Exportamos el componente principal del mapa.
