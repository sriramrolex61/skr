import { Share2 } from 'lucide-react';
import Profile from './Profile.jsx';
import ScoreRadar from './ScoreRadar.jsx';
import ActiveAccounts from './ActiveAccounts.jsx';
import BehavioralBias from './BehavioralBias.jsx';
import { WeekPerformance, SessionWinRates, Profitability, MostTraded } from './ExecutionStats.jsx';
import { btnGhost, sectionTitle } from '../ui.js';

export default function Dashboard({ data }) {
  const share = () => navigator.clipboard?.writeText(window.location.href);

  return (
    <div className="max-w-[1250px]">
      <div className="mb-[18px] mt-1.5 flex items-center justify-between">
        <p className="text-[12.5px] text-muted">
          {data.profile.name}. Accounts, rewards, risk, and execution in one view.
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-ok/10 px-2.5 py-1.5 text-xs font-medium text-ok">
            <i className="h-[5px] w-[5px] rounded-full bg-current" /> {data.profile.status}
          </span>
          <button className={btnGhost} onClick={share}>
            <Share2 size={13} /> Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Profile profile={data.profile} />
        <ScoreRadar score={data.score} />
      </div>

      <h3 className={sectionTitle}>Active Accounts</h3>
      <ActiveAccounts accounts={data.accounts} />

      <h3 className={sectionTitle}>Behavioral Bias</h3>
      <BehavioralBias bias={data.bias} />

      <h3 className={sectionTitle}>Execution Stats</h3>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WeekPerformance week={data.week} />
        <SessionWinRates sessions={data.sessions} />
        <Profitability p={data.profitability} />
        <MostTraded instruments={data.instruments} />
      </div>
    </div>
  );
}
