import React, { useEffect, useMemo, useRef } from "react";
import {
  Circle,
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { env } from "../env/client.mjs";
import { FilterConfiguration } from "../utils/types";

type BusOperations = {
  Vehicle: string;
  Driver: string;
  Event: string;
  Speed: number;
  Latitude: number;
  Longitude: number;
  Day: number;
  Hour: number;
};

type GoogleMapWindowProps = {
  center: {
    lat: number;
    lng: number;
  };
  width?: string;
  height?: string;
  data: BusOperations[];
  filterConfiguration: FilterConfiguration;
  colorMap: Map<string, string>;
  column: "Event" | "Driver";
};

const GoogleMapWindow: React.FC<GoogleMapWindowProps> = ({
  center,
  width = "100%",
  height = "90vh",
  data,
  filterConfiguration,
  colorMap,
  column,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [selected, setSelected] = React.useState<BusOperations | null>(null);

  const [isOpen, setIsOpen] = React.useState(false);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  const onLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width,
        height,
      }}
      center={center}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        gestureHandling: "cooperative",
      }}
    >
      {/* Child components, such as markers, info windows, etc. */}
      {/* <Marker
        position={{
          lat: center.lat,
          lng: center.lng,
        }}
        icon={{
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 5,
        }}
      /> */}
      {selected && isOpen && (
        <InfoWindow
          onCloseClick={() => {
            setIsOpen(false);
          }}
          position={{
            lat: selected.Latitude,
            lng: selected.Longitude,
          }}
        >
          <div className="flex flex-col gap-2 p-1">
            <div>
              <h2 className="text-lg font-bold">{selected.Driver}</h2>
              <p className=" font-normal">{selected.Event}</p>
              <p className="mt-1">{selected.Speed}</p>
            </div>
            {/* <a
              className="link link-primary"
              target={"_blank"}
              rel="noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${selected.hospitalName}`}
            >
              View on Google Map
            </a> */}
          </div>
        </InfoWindow>
      )}
      {data.map((item, idx) => {
        const selectedFilter = filterConfiguration.selected;
        const filterBy = item[column];
        return filterConfiguration[selectedFilter][filterBy] ? (
          <Marker
            key={idx}
            position={{
              lat: item.Latitude,
              lng: item.Longitude,
            }}
            clickable={true}
            animation={4}
            onClick={() => {
              setSelected(item);
              setIsOpen(false);
              setTimeout(() => setIsOpen(true), 1);
            }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: colorMap.get(item[column]) ?? "black",
              fillOpacity: 1,
              scale: 5,
              strokeColor: colorMap.get(item[column]) ?? "black",
              strokeWeight: 5,
              strokeOpacity: 0.5,
            }}
            cursor="pointer"
          />
        ) : (
          <></>
        );
      })}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(GoogleMapWindow);
