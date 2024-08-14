import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
  ZoomableGroup
} from "react-simple-maps";
import { CartesianCoordinates } from "./Types";
import { useEffect,useState } from "react";

const MapChart = ({ coordinates,location }:{coordinates:CartesianCoordinates,location:string}) => {
    // geoData
    const [geoData, setGeoData] = useState(null);
    // load the map
    useEffect(() => {
      fetch("/features.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setGeoData(data);
        })
        .catch((error) => {
          console.error("Error fetching the geo data:", error);
        });
    }, []);
  
    if (!geoData) {
      return <div>Loading...</div>;
    }
  
    return (
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [0, 0, 0],
          center: [coordinates.lon, coordinates.lat], // Center the map based on coordinates
          scale: 300
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoData} fill="#D6D6DA" stroke="#FFFFFF" strokeWidth={0.5}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} />
            ))
          }
        </Geographies>
        <Annotation
          subject={[coordinates.lon, coordinates.lat]}
          dx={-90}
          dy={-30}
          connectorProps={{
            stroke: "#FF5533",
            strokeWidth: 3,
            strokeLinecap: "round"
          }}
        >
          <text x="-8" textAnchor="end" alignmentBaseline="middle" fill="#F53">
            {location}
          </text>
        </Annotation>
      </ComposableMap>
    );
  };
  
  export default MapChart;
