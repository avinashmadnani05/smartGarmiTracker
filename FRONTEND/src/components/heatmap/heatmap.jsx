import { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, HeatmapLayer } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Default center (placeholder before user location is fetched)
const defaultCenter = {
  lat: 0,
  lng: 0,
};

function Heatmap() {
  const [center, setCenter] = useState(defaultCenter); // Store map center
  const [heatmapData, setHeatmapData] = useState([]); // Store heatmap data
  const mapRef = useRef(null); // Reference to the map instance

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Update the map center to user's location
          setCenter({ lat: latitude, lng: longitude });

          // Update heatmap data with user's location
          setHeatmapData([
            {
              location: new window.google.maps.LatLng(latitude, longitude),
              weight: 5,
            },
            {
              location: new window.google.maps.LatLng(
                latitude + 0.01,
                longitude + 0.01
              ),
              weight: 3,
            },
            {
              location: new window.google.maps.LatLng(
                latitude - 0.01,
                longitude - 0.01
              ),
              weight: 2,
            },
          ]);

          // Smoothly pan the map to the user's location
          if (mapRef.current) {
            mapRef.current.panTo({ lat: latitude, lng: longitude });
          }
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <>
      <LoadScript
        googleMapsApiKey="AIzaSyC8gLrSbbHB8X2GhQeywa-818kAeGcR3YA"
        libraries={["visualization"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={(map) => (mapRef.current = map)} // Save map instance in ref
        >
          {/* Additional map features can go here */}
          {heatmapData.length > 0 && (
            <HeatmapLayer
              data={heatmapData}
              options={{
                radius: 100,
                opacity: 0.5,
                maxIntensity: 5,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      your location: latitude: {`${center.lat}, longitude: ${center.lng}`}
    </>
  );
}

export default Heatmap;
