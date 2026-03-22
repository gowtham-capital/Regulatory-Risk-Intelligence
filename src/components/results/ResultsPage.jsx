import useScrollSpy from '../../hooks/useScrollSpy'
import CommandBar from './CommandBar'
import TheVerdict from './sections/TheVerdict'
import TheLandscape from './sections/TheLandscape'
import TheThreats from './sections/TheThreats'
import TheTrajectory from './sections/TheTrajectory'
import TheStakes from './sections/TheStakes'
import TheCompetition from './sections/TheCompetition'
import ThePlaybook from './sections/ThePlaybook'
import TheWatchlist from './sections/TheWatchlist'
import TheEvidence from './sections/TheEvidence'

const SECTION_IDS = [
  'verdict', 'landscape', 'threats', 'trajectory',
  'stakes', 'competition', 'playbook', 'watchlist', 'evidence'
]

export default function ResultsPage({ claudeResult, rawData, onReset }) {
  const activeSection = useScrollSpy(SECTION_IDS)

  return (
    <div style={{ background: 'var(--color-page-bg)', minHeight: '100vh' }}>
      <CommandBar
        claudeResult={claudeResult}
        activeSection={activeSection}
        onReset={onReset}
      />

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <TheVerdict claudeResult={claudeResult} />
        <TheLandscape claudeResult={claudeResult} rawData={rawData} />
        <TheThreats claudeResult={claudeResult} />
        <TheTrajectory claudeResult={claudeResult} />
        <TheStakes claudeResult={claudeResult} rawData={rawData} />
        <TheCompetition claudeResult={claudeResult} rawData={rawData} />
        <ThePlaybook claudeResult={claudeResult} />
        <TheWatchlist claudeResult={claudeResult} />
        <TheEvidence claudeResult={claudeResult} rawData={rawData} />
      </div>
    </div>
  )
}
