import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PopularTreemap from '@/components/PopularTreemap'
import type { InstitutionMeta } from '@/lib/secData'
import { useLanguage } from '../context/useLanguage'

export default function Dashboard() {
  const [institutions, setInstitutions] = useState<InstitutionMeta[]>([])
  const [focusedInstitutions, setFocusedInstitutions] = useState<string[] | null>(null)
  const { lang } = useLanguage()

  useEffect(() => {
    fetch(`/data/institutions_meta.json?t=${Date.now()}`)
      .then((res) => res.json() as Promise<InstitutionMeta[]>)
      .then((data) => setInstitutions(data))
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-2 mb-2">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary">
          {lang.trackedInstitutions}{' '}
          <span className="text-sm font-medium text-text-secondary ml-2 border border-border px-2 py-0.5 rounded-full">
            {institutions.length} {lang.fundsMapped}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500">
        {institutions.map((inst) => {
          const isDimmed = focusedInstitutions !== null && !focusedInstitutions.includes(inst.id)
          const isHighlighted = focusedInstitutions !== null && focusedInstitutions.includes(inst.id)

          return (
            <Link
              key={inst.id}
              to={`/institution/${inst.id}`}
              className={`glass-card transition-all duration-500 transform group overflow-hidden ${
                isDimmed
                  ? 'opacity-40 scale-[0.98] grayscale contrast-75 hover:opacity-100 hover:grayscale-0'
                  : isHighlighted
                    ? 'ring-2 ring-accent-blue/60 shadow-xl scale-[1.02] z-10'
                    : 'hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              <div className="p-4 border-b border-border/50 bg-gradient-to-br from-white to-background/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-text-primary text-base leading-tight group-hover:text-accent-blue transition-colors">
                      {inst.name}
                    </h3>
                    <p className="text-text-secondary text-xs font-medium mt-1">{inst.manager}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 flex justify-between items-end bg-white">
                <div>
                  <div className="text-xl font-black text-text-primary tracking-tight">
                    {inst.aum} <span className="text-xs font-semibold text-text-secondary">AUM</span>
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                      {inst.style}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-text-secondary mb-1">{inst.quarter}</div>
                  <div className="text-[11px] font-medium text-accent-blue bg-accent-blue/10 px-2 py-1 rounded-md inline-block">
                    {inst.holdingsCount} {lang.holdings}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <PopularTreemap onNodeFocus={setFocusedInstitutions} />
    </div>
  )
}
