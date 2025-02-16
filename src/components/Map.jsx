import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    Tooltip,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import useUrlPosition from "../hooks/useUrlPosition";
import Button from "./Button";
import L from "leaflet";
import "leaflet-routing-machine";
import { useSearch } from "../contexts/SearchContext";
import CenterMapButton from "./CenterMapButton";

function Map() {
    const { cities } = useCities();
    const { searchedLocation } = useSearch();

    const [mapPosition, setMapPosition] = useState([0, 0]);
    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getPosition,
    } = useGeolocation();

    // navigating to specific existing cities
    const [mapLat, mapLng] = useUrlPosition();
    useEffect(
        function () {
            if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
        },
        [mapLat, mapLng]
    );

    // navigating to current location
    useEffect(
        function () {
            if (geolocationPosition)
                setMapPosition([
                    geolocationPosition.lat,
                    geolocationPosition.lng,
                ]);
        },
        [geolocationPosition]
    );

    // navigating to searched cities
    useEffect(
        function () {
            if (searchedLocation)
                setMapPosition([searchedLocation.lat, searchedLocation.lng]);
        },
        [searchedLocation]
    );

    function createCustomIcon(emoji) {
        return L.divIcon({
            className: styles.customMarker,
            html: `<div style="background-color: white; color: black; border-radius: 100%; width: 2em; height: 2em; display: flex; justify-content: center; align-items: center; font-size: 18px;">${emoji}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });
    }

    return (
        <div className={styles.mapContainer}>
            {!geolocationPosition && (
                <Button type="position" onClick={getPosition}>
                    {isLoadingPosition ? "Loading..." : "Use your position"}
                </Button>
            )}
            <MapContainer
                center={mapPosition}
                zoom={7}
                scrollWheelZoom={true}
                className={styles.map}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />

                {searchedLocation && (
                    <Marker
                        position={[searchedLocation.lat, searchedLocation.lng]}
                        icon={createCustomIcon("📍")}
                    ></Marker>
                )}

                {geolocationPosition && (
                    <Marker
                        position={[
                            geolocationPosition.lat,
                            geolocationPosition.lng,
                        ]}
                        icon={createCustomIcon("👤")}
                    ></Marker>
                )}

                {cities.map((city, index) => (
                    <>
                        <Marker
                            position={[city.position.lat, city.position.lng]}
                            key={city.id}
                            tooltip={city.id}
                            icon={createCustomIcon(city.emoji)}
                        >
                            <Tooltip
                                direction="top"
                                offset={[0, 0]}
                                opacity={1}
                                permanent={true}
                            >
                                <span style={{ fontSize: "1.7em" }}>
                                    {index + 1}
                                </span>
                            </Tooltip>
                        </Marker>
                    </>
                ))}

                <RoutingMachine cities={cities} />
                <ChangeCenter position={mapPosition} />
                <CenterMapButton type="center" cities={cities}>
                    Center
                </CenterMapButton>
                {/* <DetectClick /> */}
            </MapContainer>
        </div>
    );
}

function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position, 15);
    return null;
}
// function ChangeCenter({ cities }) {
//     const map = useMap();

//     // Collect all latLng positions from cities
//     const cityLatLngs = cities.map((city) =>
//         L.latLng(city.position.lat, city.position.lng)
//     );

//     // Calculate the bounds for all the cities
//     const bounds = L.latLngBounds(cityLatLngs);

//     // Set the map view to fit the bounds
//     map.fitBounds(bounds, { padding: [50, 50] });

//     return null;
// }

function RoutingMachine({ cities }) {
    const map = useMap();

    useEffect(() => {
        if (!map || cities.length < 2) return;

        const waypoints = cities.map((city) =>
            L.latLng(city.position.lat, city.position.lng)
        );

        const routingControl = L.Routing.control({
            waypoints,
            show: false,
            addWaypoints: false,
            createMarker: function (i, waypoint, n) {
                return L.marker(waypoint.latLng);
            },
            fitSelectedRoutes: true,
        }).addTo(map);

        routingControl.on("routesfound", function (e) {
            const routes = e.routes;
            if (routes && routes.length > 0) {
                const route = routes[0]; // Get the first route
                const waypoints = route.waypoints;

                // Loop through the waypoints to get lat/lng values
                waypoints.forEach((waypoint, index) => {
                    const latLng = waypoint.latLng;
                    console.log(`Waypoint ${index}:`, latLng.lat, latLng.lng);
                });
            }
        });

        return () => map.removeControl(routingControl);
    }, [map, cities]);

    return null;
}

// function DetectClick() {
//     const navigate = useNavigate();

//     useMapEvents({
//         click: (e) => {
//             console.log(e);
//             navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
//         },
//     });
// }

export default Map;
