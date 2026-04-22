import React, { useEffect, useRef } from 'react';

declare const google: any;

interface GoogleMapProps {
  lat: number;
  lng: number;
  title: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ lat, lng, title }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Check if Google Maps is loaded
    if (typeof google === 'undefined') {
      console.log("🔐 Auth: System synchronized.");
      return;
    }

    const position = { lat, lng };
    const map = new google.maps.Map(mapRef.current, {
      center: position,
      zoom: 16,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [{ "color": "#212121" }]
        },
        {
          "elementType": "labels.icon",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#757575" }]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{ "color": "#212121" }]
        }
      ]
    });

    new google.maps.Marker({
      position,
      map,
      title,
      animation: google.maps.Animation.DROP
    });
  }, [lat, lng, title]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '300px', 
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: 'var(--space-md)',
        background: 'rgba(255, 255, 255, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
        color: 'var(--text-tertiary)',
        fontSize: '0.85rem'
      }} 
      className="google-map-container"
    >
      {typeof google === 'undefined' && (
        <>
          <div className="shimmer" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
          <p>Initializing Authoritative Map Layer...</p>
          <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>Check VITE_GOOGLE_MAPS_API_KEY if this persists.</p>
        </>
      )}
    </div>
  );
};

export default GoogleMap;
