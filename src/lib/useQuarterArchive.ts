import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_DATA_PATH,
  getLatestQuarter,
  normalizeDataPath,
  type QuarterArchive,
} from './secData'

export function useQuarterArchive() {
  const [quarters, setQuarters] = useState<QuarterArchive[]>([])
  const [isLoadingQuarters, setIsLoadingQuarters] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedQuarterId = searchParams.get('quarter')

  useEffect(() => {
    let isMounted = true

    async function loadQuarters() {
      setIsLoadingQuarters(true)
      try {
        const response = await fetch('/data/quarters.json')
        if (!response.ok) {
          throw new Error('No quarter archive manifest found')
        }

        const data = await response.json() as QuarterArchive[]
        if (isMounted) {
          setQuarters(data)
        }
      } catch {
        if (isMounted) {
          setQuarters([])
        }
      } finally {
        if (isMounted) {
          setIsLoadingQuarters(false)
        }
      }
    }

    void loadQuarters()

    return () => {
      isMounted = false
    }
  }, [])

  const latestQuarter = useMemo(() => getLatestQuarter(quarters), [quarters])
  const selectedQuarter = useMemo(() => {
    if (!selectedQuarterId) {
      return latestQuarter
    }

    return quarters.find((quarter) => quarter.id === selectedQuarterId) ?? latestQuarter
  }, [latestQuarter, quarters, selectedQuarterId])

  const dataPath = selectedQuarter ? normalizeDataPath(selectedQuarter.path) : DEFAULT_DATA_PATH

  const setSelectedQuarter = useCallback((quarterId: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (quarterId) {
      nextParams.set('quarter', quarterId)
    } else {
      nextParams.delete('quarter')
    }
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])

  return {
    quarters,
    selectedQuarter,
    selectedQuarterId: selectedQuarter?.id ?? null,
    dataPath,
    isLoadingQuarters,
    setSelectedQuarter,
  }
}
