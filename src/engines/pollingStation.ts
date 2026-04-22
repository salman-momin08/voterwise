/**
 * Polling Station Lookup Engine.
 * Provides logic to find and verify polling stations.
 */

import type { PollingStation } from '../types/civic';

/**
 * Filter polling stations based on constituency or booth number.
 */
export function findPollingStations(
  stations: PollingStation[], 
  query: { constituency_id?: string; booth_number?: string }
): PollingStation[] {
  return stations.filter(s => {
    const matchAC = query.constituency_id ? s.constituency_id === query.constituency_id : true;
    const matchBooth = query.booth_number ? s.booth_number === query.booth_number : true;
    return matchAC && matchBooth;
  });
}

/**
 * Generate Google Maps navigation URL for a polling station.
 */
export function getDirectionsUrl(station: PollingStation): string {
  if (station.google_maps_url) return station.google_maps_url;
  
  if (station.latitude && station.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`;
  }
  
  const encodedAddress = encodeURIComponent(`${station.name}, ${station.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}
