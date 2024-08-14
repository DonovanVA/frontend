import React, { useState, useEffect } from "react";
import "./App.css";
import MapChart from "./MapChart";
import axios from "axios";
import { CartesianCoordinates, Post } from "./Types";
import { posts } from "./TestData";

function App() {
  //Local states
  const [coordinates, setCoordinates] = useState<CartesianCoordinates>({
    lat: 48.8566,
    lon: 2.3522,
  });
  const [location, setLocation] = useState<string>("Paris"); // default location is Paris
  const [entities, setEntities] = useState<string[]>([]);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null); // State for hovered entity
  // fetch coordinates of name
  const fetchCoordinates = async (location: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: location,
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your Google Maps API key
          },
        }
      );
      const { lat, lng } = response.data.results[0].geometry.location;
      setCoordinates({ lat, lon: lng });
    } catch (error) {
      console.error("Error fetching the coordinates:", error);
    }
  };
  // fetch the actual name (entity) from the text
  const fetchEntities = async (text: string) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_FLASK_API_URL}/extract_gpe`, {
        text,
      });
      const newEntities = response.data.entities;

      // Append new entities to the existing ones
      setEntities((prevEntities) => {
        // Use a Set to avoid duplicate entities
        const updatedEntities = new Set([...prevEntities, ...newEntities]);
        return Array.from(updatedEntities);
      });
    } catch (error) {
      console.error("Error fetching entities:", error);
    }
  };
  // fetch coordinates whenever location and coordinates change
  useEffect(() => {
    fetchCoordinates(location);
  }, [location,coordinates]);
// fetch entities whenever post is updated
  useEffect(() => {
    posts.forEach((post) => fetchEntities(post.comment));
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        verticalAlign:"center "
      }}
    >
      <div style={{ padding: 20,display:"flex",flexDirection:"column" }}>
      {posts.map((post: Post, index: number) => (
        <div key={index} style={{ padding: 20,display:"flex",flexDirection:"column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <h3>{post.name}</h3>
            <h6>{post.date}</h6>
          </div>
          <p>{post.comment}</p>
          <div>
            Locations:
            {entities
              .filter((entity) => post.comment.includes(entity))
              .map((entity, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    console.log(entity)
                    setLocation(entity);
                    fetchCoordinates(entity);
                  }}
                  onMouseEnter={() => setHoveredEntity(entity)} // Set hovered entity on mouse enter
                onMouseLeave={() => setHoveredEntity(null)} // Clear hovered entity on mouse leave
                style={{
                  margin: '5px',
                  color: '#0000FF',
                  cursor: 'pointer',
                  textDecoration: hoveredEntity === entity ? 'underline' : 'none' // Apply underline if hovered
                }}
                >
                  {entity}
                </div>
              ))}
          </div>
        </div>
      ))}
      </div>
      <div style={{ padding: 50 }}>
        <p>Selected location: {location}</p>
        <div
          style={{
            flex: 1,
            backgroundColor: "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            width: "50vh",
          }}
        >
          <MapChart coordinates={coordinates} location={location} />
        </div>
      </div>
    </div>
  );
}

export default App;
