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

  const getRegionColor = (region: StateGeo['region'], isSelected: boolean, isHovered: boolean) => {
    if (isSelected) return '#C52229'; // Casa 13 signature red
    if (isHovered) return '#F59E0B'; // Golden amber on hover

    switch (region) {
      case 'Norte':
        return '#0D9488'; // Teal
      case 'Nordeste':
        return '#EA580C'; // Warm orange
      case 'Centro-Oeste':
        return '#D97706'; // Golden amber
      case 'Sudeste':
        return '#2563EB'; // Royal blue
      case 'Sul':
        return '#16A34A'; // Forest green
      default:
        return '#64748B';
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
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeRegion === reg
                ? 'bg-[#C52229] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* SVG Interactive Map Container */}
      <div className="relative w-full max-w-[420px] aspect-[520/640] bg-slate-50 dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800 rounded-3xl p-3 shadow-md overflow-hidden group transition-colors">
        {/* Hover / Selected Info Tooltip Banner */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              {hoveredState ? 'Estado em foco' : selectedStateObj ? 'Estado Selecionado' : 'Toque no mapa'}
            </span>
            <p className="text-xs font-black text-slate-900 dark:text-slate-100">
              {hoveredState ? `${hoveredState.name} (${hoveredState.uf})` : selectedStateObj ? `${selectedStateObj.name} (${selectedStateObj.uf})` : 'Selecione sua UF'}
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            {hoveredState?.region || selectedStateObj?.region || 'Brasil'}
          </span>
        </div>

        {/* Interactive SVG */}
        <svg
          viewBox="30 70 480 560"
          className="w-full h-full drop-shadow-sm select-none mt-5"
        >
          <g className="transition-all duration-300">
            {BRAZIL_STATES_GEO.map((st) => {
              const isSelected = selectedState === st.uf;
              const isHovered = hoveredUF === st.uf;
              const isFiltered = activeRegion === 'Todas' || activeRegion === st.region;
              const fillColor = getRegionColor(st.region, isSelected, isHovered);

              return (
                <g key={st.uf} className="cursor-pointer">
                  <path
                    d={st.svgPath}
                    fill={fillColor}
                    fillOpacity={isFiltered ? (isSelected ? 1.0 : isHovered ? 0.9 : 0.65) : 0.15}
                    stroke={isSelected ? '#FBBF24' : '#FFFFFF'}
                    strokeWidth={isSelected ? 3.5 : 1.5}
                    className="transition-all duration-150 hover:opacity-95"
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
                      fill={isSelected ? '#FFFFFF' : '#0F172A'}
                      fontSize={isSelected ? '14' : '11'}
                      fontWeight={isSelected ? '900' : '700'}
                      className="pointer-events-none select-none font-sans"
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
        <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-1 pointer-events-none font-medium">
          Toque no estado ou escolha na lista abaixo
        </p>
      </div>
    </div>
  );
}
