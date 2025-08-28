import React, { useEffect, useRef } from 'react';
import { Activity } from '../types';

declare var L: any;

interface MapDisplayProps {
  locations: (Activity & { latitude: number; longitude: number; })[];
}

const MapDisplay: React.FC<MapDisplayProps> = ({ locations }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current || typeof L === 'undefined' || locations.length === 0) {
      return;
    }

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);
    }
    
    const map = mapRef.current;

    const markers = locations.map(loc => {
      const marker = L.marker([loc.latitude, loc.longitude]);
      marker.bindPopup(`<b>${loc.title}</b><br>${loc.timeOfDay}`);
      return marker;
    });

    const featureGroup = L.featureGroup(markers).addTo(map);

    map.fitBounds(featureGroup.getBounds().pad(0.3));

    return () => {
      if (map) {
        map.remove();
        mapRef.current = null;
      }
    };
  }, [locations]);

  if (locations.length === 0) {
    return null;
  }

  return <div id="map" ref={mapContainerRef} style={{ height: '400px', width: '100%', backgroundColor: '#1f2937', zIndex: 0 }} />;
};

export default MapDisplay;