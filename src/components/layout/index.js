import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { Divider } from "@mui/material";
import AppMap from "../map";

const AppLayout = () => {
  const markers = [
    {
      id: 1,
      lat: 37.80842320401186,
      lng: -122.4043949543138,
      radiusMiles: 1, // Radio en millas
    },
    {
      id: 2,
      lat: 37.772846342031556,
      lng: -122.47094650452655,
      radiusMiles: 2, // Radio en millas
    },
    // Agregar más marcadores según sea necesario
  ];

  const greenShade = "#3AB049";
  let initial = {
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 12,
    pitch: 0,
    antialias: true,
  };
  const [layerColor, setLayerColor] = useState(greenShade);
  const [count, setCount] = useState(100);
  const [newPlace, setNewPlace] = useState(null);
  const [circleCord, setCircleCord] = useState([]);
  let area = 250;
  const [viewport, setViewport] = useState(initial);
  const mapRef = useRef();
  const theme = useTheme();

  // Obterner las coordenadas al hacer doble click en el mapa
  function getAllCordinates() {
    const center = {
      latitude: newPlace?.lat,
      longitude: newPlace?.lng,
    };

    const radius = 0.03; // El radio del círculo en grados de latitud/longitud, ajusta este valor según sea necesario
    const points = 5; // Número de puntos para aproximar el círculo

    const circleCords = Array.from({ length: points }).map((_, i) => {
      const angle = (i / points) * Math.PI * 2;
      const latitude = center.latitude + radius * Math.cos(angle);
      const longitude =
        center.longitude +
        (radius * Math.sin(angle)) /
          Math.cos((center.latitude * Math.PI) / 180);

      return [longitude, latitude]; // Ajusta el orden de longitude y latitude aquí
    });

    setCircleCord(circleCords);
  }

  useEffect(() => {
    if (newPlace) {
      getAllCordinates(area);
    }
  }, [newPlace]);

  return (
    <Box
      sx={{
        display: "flex",
        borderRadius: 1,
        overflow: "hidden",
        position: "relative",
        boxShadow: 6,
        width: "95%",
        height: "92vh",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
          "& .ps__rail-y": { zIndex: 5 },
        }}
      >
        <Box sx={{ height: "100%", backgroundColor: "background.paper" }}>
          <Divider sx={{ m: 0 }} />
          <Box sx={{ height: "100%", zIndex: 999 }}>
            <AppMap
              mapRef={mapRef}
              count={count}
              layerColor={layerColor}
              circleCord={circleCord}
              setNewPlace={setNewPlace}
              newPlace={newPlace}
              viewport={viewport}
              setViewport={setViewport}
              markers={markers}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
