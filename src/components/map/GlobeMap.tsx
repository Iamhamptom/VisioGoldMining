'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Map, { Source, Layer, Marker, Popup, NavigationControl, AttributionControl } from 'react-map-gl/maplibre';
import type { MapRef, ViewStateChangeEvent, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapContext } from '../../hooks/useMap';
import { useSelection } from '../../hooks/useFeatureSelection';
import { DRC_PROJECTS } from '../../data/drc-projects';
import type { DRCProject, ProjectStatus } from '../../data/drc-projects';
import {
  MAP_STYLE,
  DRC_CENTER,
  DRC_ZOOM,
  TERRAIN_SOURCE,
  TERRAIN_DEFAULTS,
  LAYER_IDS,
} from '../../lib/map-config';
import drcBoundary from '../../data/drc-boundary.geojson';

const STATUS_COLORS: Record<ProjectStatus, string> = {
  producing: '#00FF88',
  producing_disrupted: '#FF8800',
  care_and_maintenance: '#FF4444',
  development: '#4488FF',
  advanced_exploration: '#A78BFA',
  early_exploration: '#C084FC',
  artisanal_alluvial: '#FFD700',
  producing_small: '#00CC66',
  unknown: '#888888',
};

function getStatusLabel(status: ProjectStatus): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

interface HoveredProject {
  project: DRCProject;
  x: number;
  y: number;
}

export default function GlobeMap() {
  const mapRef = useRef<MapRef>(null);
  const { setMap } = useMapContext();
  const { setSelectedFeature } = useSelection();

  const [viewState, setViewState] = useState({
    longitude: DRC_CENTER[0],
    latitude: DRC_CENTER[1],
    zoom: 3,
    pitch: 0,
    bearing: 0,
  });

  const [hoveredProject, setHoveredProject] = useState<HoveredProject | null>(null);
  const [selectedProject, setSelectedProject] = useState<DRCProject | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Projects with valid coordinates
  const mappableProjects = useMemo(() =>
    DRC_PROJECTS.filter(p => p.location.lat !== null && p.location.lon !== null),
  []);

  // Fly to DRC after initial load
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      const map = mapRef.current.getMap();
      // Store the maplibre instance for TerrainControls and other consumers
      setMap(map);

      // Set globe projection
      try {
        map.setProjection({ type: 'globe' });
      } catch { /* older maplibre may not support globe */ }

      // Add 3D terrain
      try {
        if (!map.getSource('terrain-dem')) {
          map.addSource('terrain-dem', {
            type: 'raster-dem',
            tiles: [TERRAIN_SOURCE.url],
            tileSize: TERRAIN_SOURCE.tileSize,
            maxzoom: TERRAIN_SOURCE.maxzoom,
          });
        }
        map.setTerrain({
          source: 'terrain-dem',
          exaggeration: TERRAIN_DEFAULTS.exaggeration,
        });
      } catch { /* terrain may not be ready */ }

      // Fly to DRC
      setTimeout(() => {
        map.flyTo({
          center: DRC_CENTER,
          zoom: DRC_ZOOM,
          pitch: 40,
          speed: 0.6,
          curve: 1.5,
          essential: true,
        });
      }, 800);
    }
  }, [mapLoaded, setMap]);

  const onMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  const onMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

  // Click on a project marker — fly to it and show details in the right panel
  const handleMarkerClick = useCallback((project: DRCProject) => {
    if (!project.location.lat || !project.location.lon) return;

    setSelectedProject(project);

    // Fly to the project
    mapRef.current?.getMap().flyTo({
      center: [project.location.lon, project.location.lat],
      zoom: 9,
      pitch: 50,
      speed: 0.8,
      essential: true,
    });

    // Also set the feature selection for the right panel
    setSelectedFeature({
      layerId: 'drc-projects',
      properties: {
        id: project.projectId,
        name: project.name,
        operator: project.operator,
        status: project.status,
        totalResourceMoz: project.totalResourceMoz,
        averageGrade: project.averageGrade,
        annualProductionKoz: project.annualProductionKoz,
        belt: project.location.belt,
        province: project.location.province,
        miningMethod: project.miningMethod,
      },
      geometry: {
        type: 'Point',
        coordinates: [project.location.lon, project.location.lat],
      },
    });
  }, [setSelectedFeature]);

  // Handle click on other layers (tenements, geology, etc.)
  const handleMapClick = useCallback((e: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const interactiveLayerIds = [
      'tenements-fill', 'tenements-outline',
      'geology-fill',
      'occurrences-circle',
      'security-events-circle',
      'infrastructure-lines', 'infrastructure-points',
    ];

    const existingLayers = interactiveLayerIds.filter(id => {
      try { return !!map.getLayer(id); } catch { return false; }
    });

    if (existingLayers.length === 0) return;

    const features = map.queryRenderedFeatures(e.point, { layers: existingLayers });
    if (features.length > 0) {
      const feature = features[0];
      const layerBaseId = feature.layer.id.replace(/-fill$|-outline$|-circle$|-lines$|-points$|-glow$|-label$/, '');
      setSelectedFeature({
        layerId: layerBaseId,
        properties: feature.properties || {},
        geometry: feature.geometry,
      });
    }
  }, [setSelectedFeature]);

  // Cursor change on hover for non-project layers
  const handleMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const interactiveLayerIds = [
      'tenements-fill', 'geology-fill', 'occurrences-circle',
      'security-events-circle', 'infrastructure-lines', 'infrastructure-points',
    ];

    const existingLayers = interactiveLayerIds.filter(id => {
      try { return !!map.getLayer(id); } catch { return false; }
    });

    if (existingLayers.length === 0) return;

    const features = map.queryRenderedFeatures(e.point, { layers: existingLayers });
    map.getCanvas().style.cursor = features.length > 0 ? 'pointer' : '';
  }, []);

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={onMove}
      onLoad={onMapLoad}
      onClick={handleMapClick}
      onMouseMove={handleMouseMove}
      mapStyle={MAP_STYLE}
      maxPitch={85}
      attributionControl={false}
      style={{ width: '100%', height: '100%' }}
    >
      <AttributionControl compact position="bottom-left" />

      {/* DRC Boundary */}
      <Source id={LAYER_IDS.DRC_BOUNDARY} type="geojson" data={drcBoundary as GeoJSON.FeatureCollection}>
        <Layer
          id={`${LAYER_IDS.DRC_BOUNDARY}-fill`}
          type="fill"
          paint={{
            'fill-color': '#D4AF37',
            'fill-opacity': 0.12,
          }}
        />
        <Layer
          id={`${LAYER_IDS.DRC_BOUNDARY}-outline`}
          type="line"
          paint={{
            'line-color': '#D4AF37',
            'line-width': 2.5,
            'line-opacity': 0.8,
            'line-blur': 1,
          }}
        />
      </Source>

      {/* Project Markers */}
      {mappableProjects.map((project) => {
        const lat = project.location.lat!;
        const lon = project.location.lon!;
        const color = STATUS_COLORS[project.status] || '#888888';
        const isSelected = selectedProject?.projectId === project.projectId;
        const size = isSelected ? 18 : 12;
        const glowSize = isSelected ? 32 : 22;

        return (
          <Marker
            key={project.projectId}
            longitude={lon}
            latitude={lat}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(project);
            }}
          >
            <div
              className="relative cursor-pointer group"
              onMouseEnter={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                setHoveredProject({ project, x: rect.left + rect.width / 2, y: rect.top });
              }}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Outer glow */}
              <div
                className="absolute rounded-full animate-pulse"
                style={{
                  width: glowSize,
                  height: glowSize,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: `${color}20`,
                  boxShadow: `0 0 ${isSelected ? 20 : 12}px ${color}40`,
                }}
              />
              {/* Inner dot */}
              <div
                className="relative rounded-full border-2 transition-all duration-300"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: color,
                  borderColor: isSelected ? '#ffffff' : `${color}80`,
                  boxShadow: `0 0 ${isSelected ? 16 : 8}px ${color}80`,
                }}
              />
            </div>
          </Marker>
        );
      })}

      {/* Hover Tooltip */}
      {hoveredProject && hoveredProject.project.location.lat && hoveredProject.project.location.lon && (
        <Popup
          longitude={hoveredProject.project.location.lon}
          latitude={hoveredProject.project.location.lat}
          anchor="bottom"
          closeButton={false}
          closeOnClick={false}
          offset={[0, -18] as [number, number]}
          className="project-tooltip-popup"
        >
          <div className="bg-black/95 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 shadow-2xl min-w-[200px]">
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: STATUS_COLORS[hoveredProject.project.status] || '#888',
                  boxShadow: `0 0 8px ${STATUS_COLORS[hoveredProject.project.status] || '#888'}60`,
                }}
              />
              <span className="text-white text-xs font-medium">{hoveredProject.project.name}</span>
            </div>
            <div className="flex flex-col gap-0.5 text-[10px] text-gray-400">
              <span>{hoveredProject.project.operator}</span>
              <span className="flex items-center gap-1.5">
                <span
                  className="uppercase tracking-wider font-semibold"
                  style={{ color: STATUS_COLORS[hoveredProject.project.status] || '#888' }}
                >
                  {getStatusLabel(hoveredProject.project.status)}
                </span>
                {hoveredProject.project.totalResourceMoz && (
                  <span className="text-gold-400">
                    {hoveredProject.project.totalResourceMoz} Moz
                  </span>
                )}
              </span>
              <span className="text-gray-500">{hoveredProject.project.location.province}</span>
            </div>
          </div>
        </Popup>
      )}

      {/* Selected Project Popup */}
      {selectedProject && selectedProject.location.lat && selectedProject.location.lon && (
        <Popup
          longitude={selectedProject.location.lon}
          latitude={selectedProject.location.lat}
          anchor="bottom"
          closeButton={true}
          closeOnClick={false}
          onClose={() => setSelectedProject(null)}
          offset={[0, -20] as [number, number]}
          className="project-detail-popup"
          maxWidth="320px"
        >
          <div className="bg-black/95 backdrop-blur-xl border border-white/15 rounded-xl p-4 shadow-2xl min-w-[280px]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white text-sm font-semibold">{selectedProject.name}</h3>
                <p className="text-gray-400 text-[10px] mt-0.5">{selectedProject.operator}</p>
              </div>
              <span
                className="text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                style={{
                  color: STATUS_COLORS[selectedProject.status],
                  backgroundColor: `${STATUS_COLORS[selectedProject.status]}15`,
                  border: `1px solid ${STATUS_COLORS[selectedProject.status]}30`,
                }}
              >
                {getStatusLabel(selectedProject.status)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {selectedProject.totalResourceMoz && (
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-gold-400 text-xs font-bold">{selectedProject.totalResourceMoz}</div>
                  <div className="text-gray-500 text-[8px] uppercase tracking-wider">Moz Au</div>
                </div>
              )}
              {selectedProject.averageGrade && (
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-blue-400 text-xs font-bold">{selectedProject.averageGrade}</div>
                  <div className="text-gray-500 text-[8px] uppercase tracking-wider">g/t Au</div>
                </div>
              )}
              {selectedProject.annualProductionKoz && (
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-green-400 text-xs font-bold">{selectedProject.annualProductionKoz}</div>
                  <div className="text-gray-500 text-[8px] uppercase tracking-wider">koz/yr</div>
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Province</span>
                <span className="text-gray-300">{selectedProject.location.province}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Belt</span>
                <span className="text-gray-300 text-right max-w-[180px]">{selectedProject.location.belt}</span>
              </div>
              {selectedProject.permits.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Permits</span>
                  <span className="text-gray-300">{selectedProject.permits.length}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Security</span>
                <span className={`font-medium ${
                  selectedProject.localContext.securityLevel === 'critical' ? 'text-red-400' :
                  selectedProject.localContext.securityLevel === 'high' ? 'text-orange-400' :
                  selectedProject.localContext.securityLevel === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {selectedProject.localContext.securityLevel.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/10 text-[9px] text-gray-500">
              Click on project details in the right panel for full intelligence
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}
