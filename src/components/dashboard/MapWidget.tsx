import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const MapWidget = () => {
  const position: [number, number] = [32.4279, 53.6880]; // Iran center

  return (
    <Card className="h-full flex flex-col border-zinc-800 bg-zinc-950/50 overflow-hidden">
      <CardHeader className="pb-2 bg-zinc-950 z-10">
        <CardTitle>Live Theater Map</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative min-h-[400px]">
        <MapContainer 
          center={position} 
          zoom={5} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', background: '#09090b' }}
          attributionControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* Tehran */}
          <Circle center={[35.6892, 51.3890]} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }} radius={50000} />
          <Marker position={[35.6892, 51.3890]}>
            <Popup>
              Tehran <br /> Capital - High Alert
            </Popup>
          </Marker>

          {/* Isfahan */}
          <Circle center={[32.6539, 51.6660]} pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.2 }} radius={30000} />
          <Marker position={[32.6539, 51.6660]}>
            <Popup>
              Isfahan <br /> Nuclear Facilities
            </Popup>
          </Marker>

          {/* Strait of Hormuz */}
          <Circle center={[26.5667, 56.2500]} pathOptions={{ color: 'yellow', fillColor: 'yellow', fillOpacity: 0.2 }} radius={40000} />
          <Marker position={[26.5667, 56.2500]}>
            <Popup>
              Strait of Hormuz <br /> Maritime Chokepoint
            </Popup>
          </Marker>

           {/* Kermanshah */}
           <Circle center={[34.3142, 47.0650]} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }} radius={20000} />
           <Marker position={[34.3142, 47.0650]}>
            <Popup>
              Kermanshah <br /> Missile Site Strikes Reported
            </Popup>
          </Marker>

        </MapContainer>
        
        <div className="absolute bottom-4 left-4 bg-black/80 p-2 rounded text-xs text-white z-[1000] border border-zinc-800">
          <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Active Strike Zone</div>
          <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Strategic Target</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Maritime Alert</div>
        </div>
      </CardContent>
    </Card>
  );
};
