import React from "react";
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto";
import ReactMapGL, {
  Layer,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl";
import { TOKEN } from "./Geocoder";

const getCircleCoordinates = (marker) => {
  const center = {
    latitude: marker.lat,
    longitude: marker.lng,
  };

  const radius = marker.radius || 0.03; //Radio
  const points = 50; //Puntos en el mapa

  const circleCords = Array.from({ length: points }).map((_, i) => {
    const angle = (i / points) * Math.PI * 2;
    const latitude = center.latitude + radius * Math.cos(angle);
    const longitude =
      center.longitude +
      (radius * Math.sin(angle)) / Math.cos((center.latitude * Math.PI) / 180);

    return [longitude, latitude];
  });

  return circleCords;
};

const degreesToMiles = (degrees) => {
  const milesPerDegreeLat = 69;
  const milesPerDegreeLon = 69 * Math.cos((37.80842320401186 * Math.PI) / 180); // 37.80842320401186 latitud central del pais a ubicar
  const milesLat = degrees * milesPerDegreeLat;
  const milesLon = degrees * milesPerDegreeLon;

  return { milesLat, milesLon };
};

// Calcula el radio en millas de 0.04 grados
const radiusDegrees = 0.04;
const { milesLat, milesLon } = degreesToMiles(radiusDegrees);
console.log(
  `El radio de 0.04 grados es aproximadamente ${milesLat} millas en latitud y ${milesLon} millas en longitud.`,
  `The radius of 0.04 degrees is approximately ${milesLat} miles in latitude and ${milesLon} miles in longitude.`
);

//OJO varia la conversion de acuerdo a la orientacion en mapa donde se encuentre por eso la "latitud central"
const milesToDegrees = (miles, lat) => {
  const milesPerDegreeLat = 69;
  const milesPerDegreeLon = 69 * Math.cos((lat * Math.PI) / 180);

  const degreesLat = miles / milesPerDegreeLat;
  const degreesLon = miles / milesPerDegreeLon;

  return { degreesLat, degreesLon };
};

const AppMap = ({
  mapRef,
  setNewPlace,
  newPlace,
  markers,
  layerColor,
  viewport,
  setViewport,
}) => {
  const handleAddClick = (e) => {
    setNewPlace({
      lat: e?.lngLat?.lat,
      lng: e?.lngLat?.lng,
    });
  };

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxAccessToken={TOKEN}
      initialViewState={viewport}
      onViewportChange={(viewport) => setViewport(viewport)}
      // Mpabox Style Here
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onDblClick={handleAddClick}
      transitionDuration="200"
      attributionControl={true}
    >
      {markers.map((marker, index) => {
        const { degreesLat, degreesLon } = milesToDegrees(
          marker.radiusMiles,
          marker.lat
        );

        const circleCord = getCircleCoordinates({
          lat: marker.lat,
          lng: marker.lng,
          radius: degreesLat, // O usa degreesLon dependiendo de la orientación del círculo
        });

        const geojson = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [circleCord],
          },
        };
        console.log(`Coordenadas del círculo ${index}:`, circleCord);

        const layerStyle = {
          id: `layer-${index}`,
          type: "fill",
          source: `source-${index}`,
          layout: {},
          paint: {
            "fill-color": layerColor || "#0080ff",
            "fill-opacity": 0.4,
          },
        };

        const layerOutlineStyle = {
          id: `outline-${index}`,
          type: "line",
          source: `source-${index}`,
          layout: {},
          paint: {
            "line-color": "#3AB049",
            "line-width": 3,
          },
        };

        return (
          <React.Fragment key={index}>
            <Source id={`source-${index}`} type="geojson" data={geojson}>
              <Layer {...layerOutlineStyle} />
              <Layer {...layerStyle} />
            </Source>

            <Marker key={index} latitude={marker.lat} longitude={marker.lng}>
              <AssistantPhotoIcon style={{ color: "#E26642", fontSize: 30 }} />
            </Marker>
          </React.Fragment>
        );
      })}
      {newPlace ? (
        <Marker
          latitude={newPlace?.lat}
          longitude={newPlace?.lng}
          draggable
          onDragEnd={(e) =>
            setNewPlace({ lng: e.lngLat.lng, lat: e.lngLat.lat })
          }
        >
          <AssistantPhotoIcon style={{ color: "#E26642", fontSize: 30 }} />
        </Marker>
      ) : null}
      <NavigationControl position="bottom-right" />
    </ReactMapGL>
  );
};

export default AppMap;
