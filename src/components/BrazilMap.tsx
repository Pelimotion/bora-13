'use client';

import React, { useState } from 'react';
import { BRAZIL_STATES_GEO, REGIONS, type StateGeo } from '@/data/brazilGeo';
import { playProceduralHaptic } from '@/lib/agenticOrchestrator';

interface BrazilMapProps {
  selectedState?: string;
  onSelectState: (state: StateGeo) => void;
  className?: string;
  showSelector?: boolean;
  showRegions?: boolean;
}

export default function BrazilMap({
  selectedState = 'SP',
  onSelectState,
  className = '',
  showSelector = true,
  showRegions = true,
}: BrazilMapProps) {
  const [hoveredUF, setHoveredUF] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>('Todas');

  const hoveredState = BRAZIL_STATES_GEO.find(s => s.uf === hoveredUF);
  const selectedStateObj = BRAZIL_STATES_GEO.find(s => s.uf === selectedState) || BRAZIL_STATES_GEO[0];

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

  const handleStateClick = (st: StateGeo) => {
    playProceduralHaptic('card');
    onSelectState(st);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = BRAZIL_STATES_GEO.find(s => s.uf === e.target.value);
    if (found) {
      playProceduralHaptic('click');
      onSelectState(found);
    }
  };

  return (
    <div className={`flex flex-col items-center w-full ${className}`} role="region" aria-label="Mapa Interativo do Brasil">
      {/* ── SELETOR RÁPIDO & FILTRO REGIONAL ── */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-3 px-1">
        {showRegions && (
          <div className="flex gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
            {REGIONS.map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => {
                  playProceduralHaptic('click');
                  setActiveRegion(reg);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                  activeRegion === reg
                    ? 'bg-[#C52229] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        )}

        {showSelector && (
          <div className="w-full sm:w-auto shrink-0 flex items-center gap-1.5">
            <label htmlFor="state-select" className="text-[11px] font-bold text-slate-500 sr-only">
              Escolher Estado
            </label>
            <select
              id="state-select"
              value={selectedState}
              onChange={handleSelectChange}
              className="w-full sm:w-auto text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-hidden focus:border-[#C52229]"
            >
              {BRAZIL_STATES_GEO.map((st) => (
                <option key={st.uf} value={st.uf}>
                  {st.uf} — {st.name} ({st.capital})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── CONTAINER DO MAPA SVG INTERATIVO ── */}
      <div className="relative w-full max-w-[420px] aspect-[520/540] bg-slate-50 dark:bg-[#0E1626] border border-slate-200 dark:border-slate-800 rounded-3xl p-3 shadow-md overflow-hidden group transition-colors">
        {/* Banner de Identificação do Estado */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              {hoveredState ? 'Estado em foco' : 'Estado Selecionado'}
            </span>
            <p className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1">
              <span>{hoveredState ? `${hoveredState.name} (${hoveredState.uf})` : `${selectedStateObj.name} (${selectedStateObj.uf})`}</span>
            </p>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            Região {hoveredState?.region || selectedStateObj.region}
          </span>
        </div>

        {/* SVG do Mapa */}
        <svg
          viewBox="30 70 480 540"
          className="w-full h-full drop-shadow-xs select-none mt-3"
          aria-label="Mapa dos 27 estados do Brasil"
        >
          <g className="transition-all duration-300">
            {BRAZIL_STATES_GEO.map((st) => {
              const isSelected = selectedState === st.uf;
              const isHovered = hoveredUF === st.uf;
              const isFiltered = activeRegion === 'Todas' || activeRegion === st.region;
              const fillColor = getRegionColor(st.region, isSelected, isHovered);

              return (
                <g
                  key={st.uf}
                  className="cursor-pointer focus:outline-hidden"
                  tabIndex={0}
                  role="button"
                  aria-label={`${st.name}, capital ${st.capital}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleStateClick(st);
                    }
                  }}
                  onClick={() => handleStateClick(st)}
                  onMouseEnter={() => {
                    setHoveredUF(st.uf);
                  }}
                  onMouseLeave={() => setHoveredUF(null)}
                >
                  <path
                    d={st.svgPath}
                    fill={fillColor}
                    fillOpacity={isFiltered ? (isSelected ? 1.0 : isHovered ? 0.9 : 0.65) : 0.15}
                    stroke={isSelected ? '#FBBF24' : '#FFFFFF'}
                    strokeWidth={isSelected ? 3.5 : 1.5}
                    className="transition-all duration-150 hover:opacity-95"
                  />
                  {/* Sigla da UF */}
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

        {/* Legenda de Acessibilidade */}
        <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 mt-1 pointer-events-none font-medium">
          Toque no mapa ou use o seletor acima para explorar cada estado
        </p>
      </div>
    </div>
  );
}
