'use client';

import React, { useState } from 'react';
import { BRAZIL_STATES_GEO, REGIONS, type StateGeo } from '@/data/brazilGeo';

interface BrazilMapProps {
  selectedState?: string;
  onSelectState: (state: StateGeo) => void;
  className?: string;
}

export default function BrazilMap({
  selectedState,
  onSelectState,
  className = '',
}: BrazilMapProps) {
  const [hoveredUF, setHoveredUF] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>('Todas');

  const hoveredState = BRAZIL_STATES_GEO.find(s => s.uf === hoveredUF);
  const selectedStateObj = BRAZIL_STATES_GEO.find(s => s.uf === selectedState);

  // Filter states by region if selected
  const filteredStates = activeRegion === 'Todas'
    ? BRAZIL_STATES_GEO
    : BRAZIL_STATES_GEO.filter(s => s.region === activeRegion);

  const getRegionColor = (region: StateGeo['region'], isSelected: boolean, isHovered: boolean) => {
    if (isSelected) return '#C52229'; // Casa 13 signature vibrant red
    if (isHovered) return '#F59E0B'; // Warm amber hover

    // Subtle regional palette
    switch (region) {
      case 'Norte':
        return '#0D9488'; // Teal deep
      case 'Nordeste':
        return '#EA580C'; // Warm orange
      case 'Centro-Oeste':
        return '#D97706'; // Golden amber
      case 'Sudeste':
        return '#2563EB'; // Royal blue
      case 'Sul':
        return '#16A34A'; // Forest green
      default:
        return '#334155';
    }
  };

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      {/* Region filter pills */}
      <div className="flex gap-1.5 overflow-x-auto max-w-full pb-2 mb-3 scrollbar-none px-1">
        {REGIONS.map((reg) => (
          <button
            key={reg}
            type="button"
            onClick={() => setActiveRegion(reg)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeRegion === reg
                ? 'bg-[#C52229] text-white shadow-md shadow-red-900/40'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* SVG Interactive Map Container */}
      <div className="relative w-full max-w-[420px] aspect-[520/640] bg-[#0A101D] border border-slate-800/90 rounded-2xl p-2.5 shadow-2xl overflow-hidden group">
        {/* Ambient Map Glow */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hover / Selected Info Tooltip Banner */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {hoveredState ? 'Estado em foco' : selectedStateObj ? 'Estado Selecionado' : 'Selecione no mapa'}
            </span>
            <p className="text-xs font-black text-slate-100">
              {hoveredState ? `${hoveredState.name} (${hoveredState.uf})` : selectedStateObj ? `${selectedStateObj.name} (${selectedStateObj.uf})` : 'Toque ou passe o mouse'}
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-teal-400 border border-teal-500/30">
            {hoveredState?.region || selectedStateObj?.region || 'Brasil'}
          </span>
        </div>

        {/* Interactive SVG */}
        <svg
          viewBox="30 70 480 560"
          className="w-full h-full drop-shadow-md select-none mt-4"
        >
          {/* Brazil Boundary Base Glow */}
          <g className="transition-all duration-300">
            {BRAZIL_STATES_GEO.map((st) => {
              const isSelected = selectedState === st.uf;
              const isHovered = hoveredUF === st.uf;
              const isFiltered = activeRegion === 'Todas' || activeRegion === st.region;
              const fillColor = getRegionColor(st.region, isSelected, isHovered);

              return (
                <g key={st.uf} className="cursor-pointer group/state">
                  <path
                    d={st.svgPath}
                    fill={fillColor}
                    fillOpacity={isFiltered ? (isSelected ? 0.95 : isHovered ? 0.85 : 0.45) : 0.15}
                    stroke={isSelected ? '#FDE047' : isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1}
                    className="transition-all duration-200 hover:scale-[1.01] origin-center"
                    onMouseEnter={() => setHoveredUF(st.uf)}
                    onMouseLeave={() => setHoveredUF(null)}
                    onClick={() => onSelectState(st)}
                  />
                  {/* State UF Label */}
                  {isFiltered && (
                    <text
                      x={st.labelPos.x}
                      y={st.labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isSelected ? '#FFFFFF' : '#CBD5E1'}
                      fontSize={isSelected ? '14' : '11'}
                      fontWeight={isSelected ? '900' : '700'}
                      className="pointer-events-none select-none drop-shadow-md font-sans"
                    >
                      {st.uf}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Bottom hint */}
        <p className="text-[10px] text-center text-slate-500 mt-1 pointer-events-none">
          💡 Dica: Você também pode usar a lista e o campo de busca logo abaixo
        </p>
      </div>
    </div>
  );
}
