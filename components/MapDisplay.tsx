import React, { useEffect, useRef } from 'react';
import { Activity } from '../types';

declare var L: any;

interface MapDisplayProps {
  locations: (Activity & { latitude: number; longitude: number; })[];
}

const MapDisplay: React.FC<MapDisplayProps> = ({ locations }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const featureGroupRef = useRef<any>(null); // To hold the markers layer

  // Effect for map initialization (runs once)
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current && typeof L !== 'undefined') {
      mapRef.current = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  // Effect for updating markers when locations change
  useEffect(() => {
    if (mapRef.current && locations.length > 0) {
      const map = mapRef.current;

      // Clear previous markers
      if (featureGroupRef.current) {
        map.removeLayer(featureGroupRef.current);
      }

      // Create new markers
      const markers = locations.map(loc => {
        const marker = L.marker([loc.latitude, loc.longitude]);
        marker.bindPopup(`<b>${loc.title}</b><br>${loc.timeOfDay}`);
        return marker;
      });

      // Add new markers to a feature group
      featureGroupRef.current = L.featureGroup(markers).addTo(map);

      // Fit map to new bounds
      map.fitBounds(featureGroupRef.current.getBounds().pad(0.3));
    } else if (mapRef.current && featureGroupRef.current) {
        // Clear markers if locations array becomes empty
        mapRef.current.removeLayer(featureGroupRef.current);
    }
  }, [locations]); // This effect runs when locations change

  if (locations.length === 0) {
    return null;
  }

  return <div id="map" ref={mapContainerRef} style={{ height: '400px', width: '100%', backgroundColor: '#1f2937', zIndex: 0 }} />;
};

export default MapDisplay;
