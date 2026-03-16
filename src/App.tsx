import { useState } from 'react'
import './App.css'

type AgentStatus = 'Idle' | 'Scanning' | 'Drafting' | 'Waiting' | 'Ready'
type EventTone = 'neutral' | 'success' | 'warning'

type AgentCard = {
  name: string
  role: string
  status: AgentStatus
  load: number
  confidence: number
  output: string
}

type Evidence = {
  label: string
  detail: string
  kind: 'file' | 'log' | 'decision'
}

type Approval = {
  label: string
  owner: string
  done: boolean
}

type TimelineEvent = {
  title: string
  detail: string
  tone: EventTone
}

type Stage = {
  name: string
  summary: string
  nextAction: string
  agents: AgentCard[]
  evidence: Evidence[]
  approvals: Approval[]
  timeline: TimelineEvent[]
  outputs: string[]
}

type Mission = {
  id: string
  name: string
  repo: string
  branch: string
  goal: string
  description: string
  tools: string[]
  constraints: string[]
  stages: Stage[]
}

const missions: Mission[] = [
  {
    id: 'triage-pr',
    name: 'PR Rescue',
    repo: 'py-pdf/pypdf',
    branch: 'fix/xobjs-unbound',
    goal: 'Turn a noisy bug-fix PR into a minimal, reviewable patch with tests.',
    description:
      'Planner decomposes the work, Repo Reader gathers context, Review Agent flags diff noise, Patch Agent prepares a surgical fix, and Test Agent proposes regression coverage.',
    tools: ['GitHub API', 'ripgrep', 'test generator', 'review memory'],
    constraints: [
      'Keep the diff minimal',
      'Preserve existing behavior',
      'Request human approval before final patch',
    ],
    stages: [
      {
        name: 'Triage',
        summary:
          'The team is parsing the incoming PR, reading maintainer feedback, and mapping likely hotspots before touching any files.',
        nextAction: 'Approve the proposed scope so the patch lane can start editing.',
        agents: [
          {
            name: 'Planner',
            role: 'Decompose review goals and propose a sequence of tasks.',
            status: 'Ready',
            load: 82,
            confidence: 93,
            output: 'Scope split into diff cleanup, regression guard, and re-review note.',
          },
          {
            name: 'Repo Reader',
            role: 'Collect source files, tests, and related issue context.',
            status: 'Scanning',
            load: 74,
            confidence: 88,
            output: 'Pinned the image extraction path and nearby tests.',
          },
          {
            name: 'Review Agent',
            role: 'Simulate maintainer concerns and regression risk.',
            status: 'Scanning',
            load: 66,
            confidence: 86,
            output: 'Detected formatting noise as the top blocker.',
          },
          {
            name: 'Patch Agent',
            role: 'Prepare the smallest patch that satisfies the review.',
            status: 'Waiting',
            load: 18,
            confidence: 72,
            output: 'Waiting for approved scope before generating edits.',
          },
          {
            name: 'Test Agent',
            role: 'Design regression tests around the reported failure.',
            status: 'Idle',
            load: 12,
            confidence: 68,
            output: 'No test drafted yet.',
          },
        ],
        evidence: [
          {
            label: 'Maintainer request',
            detail: 'Revert unrelated changes and add a corresponding regression test.',
            kind: 'decision',
          },
          {
            label: 'Impacted files',
            detail: 'pypdf/_page.py and tests/test_images.py',
            kind: 'file',
          },
          {
            label: 'Failure mode',
            detail: 'UnboundLocalError triggered when XObject resources are missing.',
            kind: 'log',
          },
        ],
        approvals: [
          { label: 'Scope matches maintainer feedback', owner: 'Human lead', done: true },
          { label: 'Patch may modify runtime logic', owner: 'Human lead', done: false },
        ],
        timeline: [
          {
            title: 'Task graph assembled',
            detail: 'Planner split the PR rescue into cleanup, test, and review follow-up.',
            tone: 'success',
          },
          {
            title: 'Hotspot confirmed',
            detail: 'Repo Reader traced the bug to a guard around XObject lookup.',
            tone: 'neutral',
          },
          {
            title: 'Noise flagged',
            detail: 'Review Agent marked formatting churn as the main merge blocker.',
            tone: 'warning',
          },
        ],
        outputs: [
          'Recommended patch surface: 2 files',
          'Suggested reviewer note drafted',
          'Regression target identified',
        ],
      },
      {
        name: 'Patch',
        summary:
          'The patch lane is now active. Agents align on the smallest code change, draft the test, and keep the review burden low.',
        nextAction: 'Review the generated patch and test before asking the team to post a re-review note.',
        agents: [
          {
            name: 'Planner',
            role: 'Keep the team aligned with the agreed scope.',
            status: 'Ready',
            load: 48,
            confidence: 95,
            output: 'Scope stayed within the original maintainer request.',
          },
          {
            name: 'Repo Reader',
            role: 'Provide exact context snippets and line references.',
            status: 'Ready',
            load: 36,
            confidence: 91,
            output: 'Delivered the surrounding helper code and existing image tests.',
          },
          {
            name: 'Review Agent',
            role: 'Evaluate whether the draft still feels noisy or risky.',
            status: 'Ready',
            load: 41,
            confidence: 89,
            output: 'Patch now reads as a targeted bug fix with explicit coverage.',
          },
          {
            name: 'Patch Agent',
            role: 'Write the fix and supporting UI copy.',
            status: 'Drafting',
            load: 91,
            confidence: 90,
            output: 'Added a defensive xobjs guard and restored the original formatting.',
          },
          {
            name: 'Test Agent',
            role: 'Generate or refine regression coverage.',
            status: 'Drafting',
            load: 83,
            confidence: 87,
            output: 'Added an inline-image regression test for missing XObject resources.',
          },
        ],
        evidence: [
          {
            label: 'Patch note',
            detail: 'Guard xobjs before dereferencing and preserve the original flow.',
            kind: 'decision',
          },
          {
            label: 'Regression test',
            detail: 'Exercise inline image retrieval when /XObject resources are absent.',
            kind: 'file',
          },
          {
            label: 'Review burden',
            detail: 'Diff narrowed to 13 total line additions across two files.',
            kind: 'log',
          },
        ],
        approvals: [
          { label: 'Patch may modify runtime logic', owner: 'Human lead', done: true },
          { label: 'Ready to request re-review', owner: 'Human lead', done: false },
        ],
        timeline: [
          {
            title: 'Patch drafted',
            detail: 'Patch Agent produced a surgical fix with the old formatting restored.',
            tone: 'success',
          },
          {
            title: 'Regression plan accepted',
            detail: 'Test Agent paired the fix with one focused test in test_images.py.',
            tone: 'success',
          },
          {
            title: 'Human gate pending',
            detail: 'Team is waiting for approval before posting the re-review request.',
            tone: 'warning',
          },
        ],
        outputs: [
          'Minimal code diff drafted',
          'Regression test drafted',
          'Re-review message prepared',
        ],
      },
      {
        name: 'Wrap-up',
        summary:
          'All agents have converged. The handoff package is ready for a maintainer-friendly re-review with evidence attached.',
        nextAction: 'Publish the follow-up comment and monitor CI plus maintainer response.',
        agents: [
          {
            name: 'Planner',
            role: 'Summarize what was completed and what remains.',
            status: 'Ready',
            load: 24,
            confidence: 96,
            output: 'All requested changes are complete; only maintainer review remains.',
          },
          {
            name: 'Repo Reader',
            role: 'Attach file references and exact evidence.',
            status: 'Ready',
            load: 22,
            confidence: 93,
            output: 'Prepared evidence links and diff summary.',
          },
          {
            name: 'Review Agent',
            role: 'Draft the maintainer-facing summary.',
            status: 'Ready',
            load: 31,
            confidence: 92,
            output: 'Comment emphasizes green CI, reverted noise, and added regression coverage.',
          },
          {
            name: 'Patch Agent',
            role: 'Keep the patch stable while CI runs.',
            status: 'Ready',
            load: 16,
            confidence: 94,
            output: 'No further edits recommended.',
          },
          {
            name: 'Test Agent',
            role: 'Report verification status.',
            status: 'Ready',
            load: 19,
            confidence: 95,
            output: 'All requested CI jobs passed after the updated branch was pushed.',
          },
        ],
        evidence: [
          {
            label: 'CI result',
            detail: 'All platform and coverage jobs completed successfully.',
            kind: 'log',
          },
          {
            label: 'Review note',
            detail: 'Maintainer-facing follow-up is ready to post with concrete completion points.',
            kind: 'decision',
          },
          {
            label: 'Final diff',
            detail: '2 files changed, focused on bug fix and regression coverage only.',
            kind: 'file',
          },
        ],
        approvals: [
          { label: 'Ready to request re-review', owner: 'Human lead', done: true },
          { label: 'Archive mission after handoff', owner: 'Human lead', done: false },
        ],
        timeline: [
          {
            title: 'CI cleared',
            detail: 'The updated branch reached a fully green state.',
            tone: 'success',
          },
          {
            title: 'Reviewer note drafted',
            detail: 'Review Agent distilled the work into a short maintainer-friendly update.',
            tone: 'success',
          },
          {
            title: 'Monitoring phase',
            detail: 'Mission stays open until a human posts the handoff and watches for feedback.',
            tone: 'neutral',
          },
        ],
        outputs: [
          'Handoff comment ready',
          'Evidence packet assembled',
          'Mission can be archived after maintainer response',
        ],
      },
    ],
  },
  {
    id: 'issue-intake',
    name: 'Issue Intake',
    repo: 'Yuki9814/PatchHive',
    branch: 'main',
    goal: 'Turn a raw bug report into an evidence-backed implementation plan.',
    description:
      'Useful for new issues with sparse context. The workspace coordinates planning, reproduction hints, risk review, and patch/test suggestions before anyone edits code.',
    tools: ['Issue parser', 'workspace memory', 'risk matrix', 'prompt library'],
    constraints: [
      'No code changes before reproduction notes exist',
      'Every patch suggestion needs a test owner',
      'Capture assumptions explicitly',
    ],
    stages: [
      {
        name: 'Intake',
        summary:
          'The team reads the issue, identifies missing context, and creates a reproducible intake brief.',
        nextAction: 'Confirm assumptions and assign one owner per follow-up question.',
        agents: [
          {
            name: 'Planner',
            role: 'Break the issue into reproducibility, impact, and ownership.',
            status: 'Drafting',
            load: 79,
            confidence: 87,
            output: 'Generated a three-part intake checklist and escalation path.',
          },
          {
            name: 'Repo Reader',
            role: 'Map the issue to likely code areas and docs.',
            status: 'Scanning',
            load: 72,
            confidence: 82,
            output: 'Linked likely files plus one onboarding doc gap.',
          },
          {
            name: 'Review Agent',
            role: 'Call out hidden complexity before implementation begins.',
            status: 'Scanning',
            load: 58,
            confidence: 80,
            output: 'Flagged environment setup as the main unknown.',
          },
          {
            name: 'Patch Agent',
            role: 'Hold off on editing until evidence exists.',
            status: 'Waiting',
            load: 15,
            confidence: 61,
            output: 'No patch suggested yet.',
          },
          {
            name: 'Test Agent',
            role: 'Outline how a fix would be verified later.',
            status: 'Idle',
            load: 11,
            confidence: 65,
            output: 'Waiting for reproduction details.',
          },
        ],
        evidence: [
          {
            label: 'Issue summary',
            detail: 'User reports setup failure but omitted exact command output.',
            kind: 'decision',
          },
          {
            label: 'Likely ownership',
            detail: 'Docs and installer workflow seem equally involved.',
            kind: 'decision',
          },
        ],
        approvals: [
          { label: 'Assumptions captured', owner: 'Human lead', done: false },
          { label: 'Ready to request more context', owner: 'Human lead', done: false },
        ],
        timeline: [
          {
            title: 'Issue normalized',
            detail: 'Planner extracted action items from the raw user report.',
            tone: 'success',
          },
          {
            title: 'Unknowns remain',
            detail: 'The team still needs exact environment details before proposing code changes.',
            tone: 'warning',
          },
        ],
        outputs: ['Intake checklist', 'Missing-context prompts'],
      },
    ],
  },
  {
    id: 'release-brief',
    name: 'Release Brief',
    repo: 'Yuki9814/PatchHive',
    branch: 'release/0.2',
    goal: 'Prepare a maintainer-facing release brief from merged work and pending risks.',
    description:
      'This mission focuses on cross-agent synthesis: summarize work, highlight regressions, and produce a clean release note draft.',
    tools: ['release memory', 'PR digest', 'risk scoring'],
    constraints: [
      'Only cite merged work',
      'Every risk needs an owner',
      'Keep release notes scannable',
    ],
    stages: [
      {
        name: 'Digest',
        summary: 'Agents are collecting merged work and drafting the release narrative.',
        nextAction: 'Approve the risk summary and publish the release candidate notes.',
        agents: [
          {
            name: 'Planner',
            role: 'Group merged work into themes and release sections.',
            status: 'Ready',
            load: 51,
            confidence: 89,
            output: 'Sections grouped into triage, patching, and maintainer workflow.',
          },
          {
            name: 'Repo Reader',
            role: 'Gather merged PR metadata and notable file changes.',
            status: 'Ready',
            load: 43,
            confidence: 85,
            output: 'Pulled merged PR summaries and links for citation.',
          },
          {
            name: 'Review Agent',
            role: 'Highlight what still looks fragile before release.',
            status: 'Drafting',
            load: 64,
            confidence: 78,
            output: 'Marked two risky onboarding paths for follow-up.',
          },
          {
            name: 'Patch Agent',
            role: 'Translate technical work into release-note language.',
            status: 'Drafting',
            load: 68,
            confidence: 83,
            output: 'Release note draft now avoids implementation jargon.',
          },
          {
            name: 'Test Agent',
            role: 'Summarize what verification backs the release.',
            status: 'Ready',
            load: 39,
            confidence: 88,
            output: 'Verification summary attached to each release section.',
          },
        ],
        evidence: [
          {
            label: 'Merged work',
            detail: '3 merged PRs plus follow-up maintenance still in review.',
            kind: 'log',
          },
          {
            label: 'Open risks',
            detail: 'Contributor onboarding and duplicate PR cleanup remain active tasks.',
            kind: 'decision',
          },
        ],
        approvals: [{ label: 'Release summary approved', owner: 'Human lead', done: false }],
        timeline: [
          {
            title: 'Release note draft',
            detail: 'Patch Agent converted merged work into human-readable changelog bullets.',
            tone: 'success',
          },
        ],
        outputs: ['Draft release brief', 'Risk summary', 'Follow-up checklist'],
      },
    ],
  },
]

function App() {
  const [missionId, setMissionId] = useState(missions[0].id)
  const [stageIndex, setStageIndex] = useState(0)

  const mission = missions.find((item) => item.id === missionId) ?? missions[0]
  const stage = mission.stages[stageIndex] ?? mission.stages[0]
  const completion = Math.round(((stageIndex + 1) / mission.stages.length) * 100)
  const approvalDone = stage.approvals.filter((item) => item.done).length
  const averageConfidence = Math.round(
    stage.agents.reduce((total, item) => total + item.confidence, 0) / stage.agents.length,
  )
  const activeAgents = stage.agents.filter((item) => item.status !== 'Idle').length

  const changeMission = (nextMissionId: string) => {
    setMissionId(nextMissionId)
    setStageIndex(0)
  }

  const nextStage = () => {
    setStageIndex((current) => {
      if (current >= mission.stages.length - 1) {
        return current
      }

      return current + 1
    })
  }

  const previousStage = () => {
    setStageIndex((current) => {
      if (current <= 0) {
        return current
      }

      return current - 1
    })
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">PatchHive</p>
          <h1>Multi-agent collaboration for triage, patching, and maintainer handoff.</h1>
          <p className="hero-text">
            PatchHive is a desktop-first control room for open-source work. Planning, repo reading,
            review simulation, patch drafting, and test design can run in parallel while a human
            keeps the final say on every risky handoff.
          </p>
          <div className="hero-actions">
            <button type="button">Launch mission</button>
            <button className="button--ghost" type="button">
              View roadmap
            </button>
          </div>
        </div>

        <div className="hero-stats" aria-label="Mission summary">
          <div>
            <span>Mission progress</span>
            <strong>{completion}%</strong>
          </div>
          <div>
            <span>Avg confidence</span>
            <strong>{averageConfidence}</strong>
          </div>
          <div>
            <span>Approvals</span>
            <strong>
              {approvalDone}/{stage.approvals.length}
            </strong>
          </div>
          <div>
            <span>Agents active</span>
            <strong>{activeAgents}</strong>
          </div>
        </div>
      </section>

      <section className="signal-band" aria-label="PatchHive promise">
        <article>
          <span>Parallel lanes</span>
          <strong>Specialized agents focus on one kind of work each.</strong>
        </article>
        <article>
          <span>Human gates</span>
          <strong>Risky edits and external comms still wait for approval.</strong>
        </article>
        <article>
          <span>Traceable evidence</span>
          <strong>Every patch suggestion is tied to files, logs, or explicit decisions.</strong>
        </article>
      </section>

      <section className="mission-strip" aria-label="Mission presets">
        {missions.map((item) => (
          <button
            key={item.id}
            className={`mission-card${item.id === mission.id ? ' mission-card--active' : ''}`}
            onClick={() => changeMission(item.id)}
            type="button"
          >
            <span className="mission-card__label">{item.name}</span>
            <strong>{item.goal}</strong>
            <small>
              {item.repo} · {item.stages.length} stage{item.stages.length > 1 ? 's' : ''}
            </small>
          </button>
        ))}
      </section>

      <section className="workspace-grid">
        <aside className="panel panel--mission">
          <div className="panel__header">
            <p className="eyebrow">Mission</p>
            <span className="chip">{mission.branch}</span>
          </div>
          <h2>{mission.goal}</h2>
          <p className="panel__text">{mission.description}</p>

          <div className="meta-block">
            <span>Repository</span>
            <strong>{mission.repo}</strong>
          </div>

          <div className="meta-block">
            <span>Current stage</span>
            <strong>{stage.name}</strong>
            <p>{stage.summary}</p>
          </div>

          <div className="stack">
            <div>
              <h3>Tools in play</h3>
              <ul className="tag-list">
                {mission.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Guardrails</h3>
              <ul className="constraint-list">
                {mission.constraints.map((constraint) => (
                  <li key={constraint}>{constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <section className="panel panel--agents">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Agent lane</p>
              <h2>Specialized agents working in parallel</h2>
            </div>
            <div className="stage-controls">
              <button onClick={previousStage} type="button">
                Previous
              </button>
              <button className="button--primary" onClick={nextStage} type="button">
                Advance handoff
              </button>
            </div>
          </div>

          <div className="stage-strip" aria-label="Stage progress">
            {mission.stages.map((item, index) => (
              <div
                key={item.name}
                className={`stage-pill${index === stageIndex ? ' stage-pill--active' : ''}`}
              >
                <span>{index + 1}</span>
                <strong>{item.name}</strong>
              </div>
            ))}
          </div>

          <div className="agent-grid">
            {stage.agents.map((agent) => (
              <article key={agent.name} className="agent-card">
                <div className="agent-card__top">
                  <div>
                    <h3>{agent.name}</h3>
                    <p>{agent.role}</p>
                  </div>
                  <span className={`status-badge status-badge--${agent.status.toLowerCase()}`}>
                    {agent.status}
                  </span>
                </div>

                <div className="metric-row">
                  <span>Load</span>
                  <strong>{agent.load}%</strong>
                </div>
                <div className="meter" aria-hidden="true">
                  <span style={{ width: `${agent.load}%` }} />
                </div>

                <div className="metric-row">
                  <span>Confidence</span>
                  <strong>{agent.confidence}</strong>
                </div>
                <p className="agent-output">{agent.output}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel panel--timeline">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Timeline</p>
              <h2>Human-in-the-loop workflow</h2>
            </div>
            <span className="chip">{stage.timeline.length} checkpoints</span>
          </div>

          <div className="timeline">
            {stage.timeline.map((event) => (
              <article key={event.title} className={`timeline-item timeline-item--${event.tone}`}>
                <h3>{event.title}</h3>
                <p>{event.detail}</p>
              </article>
            ))}
          </div>

          <div className="next-action">
            <span>Next action</span>
            <strong>{stage.nextAction}</strong>
          </div>
        </section>

        <section className="panel panel--evidence">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Evidence</p>
              <h2>What the team is citing right now</h2>
            </div>
          </div>

          <div className="evidence-list">
            {stage.evidence.map((item) => (
              <article key={item.label} className="evidence-card">
                <span className={`evidence-card__kind evidence-card__kind--${item.kind}`}>
                  {item.kind}
                </span>
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>

          <div className="approval-list">
            <h3>Human approvals</h3>
            {stage.approvals.map((approval) => (
              <div key={approval.label} className="approval-row">
                <div>
                  <strong>{approval.label}</strong>
                  <p>{approval.owner}</p>
                </div>
                <span className={`approval-state${approval.done ? ' approval-state--done' : ''}`}>
                  {approval.done ? 'Approved' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel panel--outputs">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Outputs</p>
              <h2>Deliverables ready for a maintainer</h2>
            </div>
          </div>

          <div className="output-list">
            {stage.outputs.map((output) => (
              <div key={output} className="output-item">
                <span />
                <p>{output}</p>
              </div>
            ))}
          </div>

          <div className="memory-card">
            <p className="eyebrow">Shared memory</p>
            <h3>Why this architecture matters</h3>
            <p>
              PatchHive keeps every agent specialized and traceable. Planner owns scope, Repo
              Reader owns evidence, Review Agent owns risk, Patch Agent owns edits, and Test Agent
              owns verification. The human only approves handoffs that actually change code or
              public communication.
            </p>
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
