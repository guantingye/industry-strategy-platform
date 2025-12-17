// Industry Strategy Insights (seed content)
//
// DB-ready shape:
// - UI reads INSIGHTS[] and renders: heroImage/supportImage, takeaways, sections (optionally with chart),
//   signals (key/value), and sources (label/url).
// - Later, replace INSIGHTS with a Supabase fetcher without changing UI.

export const INSIGHTS = [
  {
    id: 'power-ai',
    date: '2025-12-14',
    kicker: 'Strategic brief',
    title: 'Power is becoming the binding constraint for AI scale-out',
    subtitle:
      'As accelerator supply normalizes, grid capacity, interconnect queues, and cooling envelopes are increasingly the true gating factors—shifting advantage to operators who secure energy early and schedule workloads intelligently.',
    tags: ['AI infrastructure', 'Energy', 'Data centers'],
    heroImage:
      'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=1800&q=70',
    supportImage:
      'https://images.unsplash.com/photo-1551703599-6b3e8379aa8e?auto=format&fit=crop&w=1600&q=70',
    takeaways: [
      'Treat power procurement as a roadmap dependency: interconnect visibility + PPAs + site readiness become first-order constraints.',
      'Shift from “maximum compute” to “effective compute”: power-aware placement and time-shifting convert scarcity into reliability advantage.',
      'Cooling and power delivery are now product variables (liquid cooling, higher-voltage distribution, serviceability workflows).',
    ],
    sections: [
      {
        heading: 'Why it matters',
        body:
          'The market is entering an energy-first phase: capital can be raised and GPUs can be sourced, but megawatts cannot be conjured on demand. Permitting, substation upgrades, and queue positions now determine where capacity concentrates—and therefore which ecosystems (talent, suppliers, customers) compound.',
        chart: {
          type: 'line',
          title: 'Compute demand ramps faster than historical power provisioning cycles',
          note: 'Illustrative index (not actuals): demand outpaces new capacity approvals.',
          data: [
            { label: '2021', value: 100 },
            { label: '2022', value: 135 },
            { label: '2023', value: 190 },
            { label: '2024', value: 265 },
            { label: '2025', value: 360 },
          ],
        },
      },
      {
        heading: 'Strategy implications',
        body:
          'Build a power stack the way teams once built a silicon stack: (1) a site pipeline with queue intelligence, (2) contracting playbooks (PPA / tolling / behind-the-meter), (3) workload governance that optimizes marginal $/token under power constraints. The winning operators will behave like integrated energy + compute firms.',
      },
      {
        heading: 'What to monitor',
        body:
          'Watch for changes to connection-queue rules, major grid reinforcements near hyperscale corridors, and commercial rollouts of advanced cooling and power electronics. These are leading indicators of where the next training and inference clusters will consolidate.',
      },
    ],
    signals: [
      { k: 'Grid', v: 'Interconnect queues lengthen; projects with firm capacity and completed studies move first.' },
      { k: 'Hardware', v: 'OEM roadmaps accelerate liquid-cooled racks and higher-TDP accelerators; serviceability becomes a differentiator.' },
      { k: 'Real estate', v: 'Campus-style “power parks” emerge where land + substations + permits can be bundled into repeatable templates.' },
      { k: 'Ops', v: 'Power-aware scheduling becomes standard: location/time shifting for training and inference peaks.' },
    ],
    sources: [
      { label: 'IEA – Electricity 2024 (data centres & AI)', url: 'https://www.iea.org/reports/electricity-2024' },
      { label: 'LBNL – Data Center Energy Research', url: 'https://datacenters.lbl.gov/' },
    ],
  },

  {
    id: 'advanced-packaging',
    date: '2025-12-15',
    kicker: 'Supply-chain lens',
    title: 'Advanced packaging is the new “fab capacity” bottleneck',
    subtitle:
      'HBM integration, CoWoS/2.5D lines, and substrate availability increasingly dictate system-level shipments—reshaping negotiation power across the AI stack.',
    tags: ['Semiconductors', 'Advanced packaging', 'HBM'],
    heroImage:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=70',
    supportImage:
      'https://images.unsplash.com/photo-1581091215367-59ab6f9d6b8f?auto=format&fit=crop&w=1600&q=70',
    takeaways: [
      'Model availability at the system level (GPU + HBM + package + substrate), not wafer starts alone.',
      'De-risk programs with multi-sourcing for substrates and packaging partners; qualify alternates early.',
      'Treat packaging as a capacity-reservation problem with yield learning curves and tooling lead times.',
    ],
    sections: [
      {
        heading: 'Why it matters',
        body:
          'As accelerators become memory-bound, HBM supply and packaging throughput gate end products. This shifts where value is captured: the limiting step controls delivery schedules, pricing power, and platform roadmap credibility.',
        chart: {
          type: 'bar',
          title: 'Bottleneck migration across the AI accelerator stack',
          note: 'Illustrative risk score by subsystem (not actuals).',
          data: [
            { label: 'Wafer fab', value: 45 },
            { label: 'HBM', value: 78 },
            { label: 'Packaging', value: 82 },
            { label: 'Substrates', value: 70 },
            { label: 'Power/cooling', value: 66 },
          ],
        },
      },
      {
        heading: 'Strategy implications',
        body:
          'Adopt a “packaging BOM” model: substrates, underfill, tool availability, test, and yield ramps. Negotiate packaging priority like foundry slots, and create architecture options (chiplets, memory pooling) that reduce dependence on the tightest chokepoints.',
      },
      {
        heading: 'What to monitor',
        body:
          'Track OSAT capacity expansions, substrate vendor capex, and packaging tool supply. Watch for design shifts that trade peak FLOPS for memory bandwidth per watt and packaging simplicity.',
      },
    ],
    signals: [
      { k: 'Lead times', v: 'Constraints shift from silicon to HBM integration, substrates, and packaging test throughput.' },
      { k: 'Capacity', v: 'Announcements increasingly emphasize CoWoS/2.5D lines and substrate expansions, not just wafer starts.' },
      { k: 'Architecture', v: 'Platforms optimize for bandwidth-per-watt and yield-aware packaging, influencing cluster economics.' },
      { k: 'Negotiation', v: 'Priority allocation becomes strategic; capacity reservations lock in competitive advantage.' },
    ],
    sources: [
      {
        label: 'TSMC – Advanced packaging overview',
        url: 'https://www.tsmc.com/english/dedicatedFoundry/technology/advanced_packaging',
      },
      { label: 'TrendForce (HBM / packaging market notes)', url: 'https://www.trendforce.com/' },
    ],
  },

  {
    id: 'photonics',
    date: '2025-12-15',
    kicker: 'Frontier theme',
    title: 'Photonics is moving from “research” to “network necessity” for AI clusters',
    subtitle:
      'As fabrics scale, electrical interconnect hits thermal and latency walls—driving adoption of silicon photonics, co-packaged optics, and (eventually) optical switching.',
    tags: ['Silicon photonics', 'Networking', 'AI clusters'],
    heroImage:
      'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=1800&q=70',
    supportImage:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=70',
    takeaways: [
      'Optics will become a per-rack planning variable (power, thermals, serviceability), not a line-item afterthought.',
      'Co-packaged optics changes cost curves but demands new reliability and repair workflows.',
      'Design wins set standards: once hyperscaler reference fabrics standardize, ecosystems move quickly.',
    ],
    sections: [
      {
        heading: 'Why it matters',
        body:
          'At scale, the network is the computer. Latency, bandwidth, and network power dictate effective throughput. Photonics offers higher bandwidth density and lower energy per bit, but requires packaging, test, and operations maturity to deploy reliably.',
        chart: {
          type: 'line',
          title: 'Network power share grows as fabrics scale',
          note: 'Illustrative trajectory (not actuals).',
          data: [
            { label: '2021', value: 8 },
            { label: '2022', value: 10 },
            { label: '2023', value: 13 },
            { label: '2024', value: 16 },
            { label: '2025', value: 20 },
          ],
        },
      },
      {
        heading: 'Strategy implications',
        body:
          'Plan for a transition where electrical and optical coexist. Evaluate suppliers on reliability data, thermal envelopes, and maintainability—not only peak speeds. Winning startups integrate into existing ops workflows and offer measurable TCO improvements.',
      },
      {
        heading: 'What to monitor',
        body:
          'Follow hyperscaler reference designs and standardization moves around CPO. Adoption will cascade into packaging capacity demand and new tooling requirements—linking photonics directly to the broader AI hardware supply chain.',
      },
    ],
    signals: [
      { k: 'Fabric design', v: 'Higher radix topologies and longer reach links push electrical solutions toward thermal limits.' },
      { k: 'Modules', v: 'Vendor roadmaps accelerate higher-speed optical modules and early CPO deployments.' },
      { k: 'Operations', v: 'Serviceability and repair workflows become the gating factor for production adoption.' },
      { k: 'Ecosystem', v: 'Packaging + photonics convergence increases demand for advanced test and co-integration.' },
    ],
    sources: [
      { label: 'AIM Photonics (ecosystem overview)', url: 'https://www.aimphotonics.com/' },
      { label: 'NVIDIA Networking (overview)', url: 'https://www.nvidia.com/en-us/networking/' },
    ],
  },

  {
    id: 'defense-autonomy',
    date: '2025-12-16',
    kicker: 'Geopolitics & dual-use',
    title: 'Autonomy is redefining the defense–rescue drone stack',
    subtitle:
      'Value shifts from airframes to perception, electronic resilience, and scalable fleet operations—creating opportunities for software-defined mission capabilities.',
    tags: ['Autonomy', 'Defense tech', 'Rescue'],
    heroImage:
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1800&q=70',
    supportImage:
      'https://images.unsplash.com/photo-1524143986875-3b098d78b363?auto=format&fit=crop&w=1600&q=70',
    takeaways: [
      'Durable moats are mission data + autonomy software, not commodity hardware.',
      'Resilience (GNSS-denied nav, comms, EW) is becoming a procurement baseline.',
      'Fleet operations and training workflows determine whether deployments scale beyond pilots.',
    ],
    sections: [
      {
        heading: 'Why it matters',
        body:
          'Drone deployments scale when operations scale: autonomy reduces operator burden and resilience reduces mission failure. Procurement increasingly favors integrated stacks that deliver measurable reliability, safe autonomy, and lifecycle support.',
        chart: {
          type: 'bar',
          title: 'Value capture shifts toward software-defined capabilities',
          note: 'Illustrative share of differentiation (not actuals).',
          data: [
            { label: 'Airframe', value: 20 },
            { label: 'Payloads', value: 25 },
            { label: 'Autonomy', value: 30 },
            { label: 'EW resilience', value: 35 },
            { label: 'Fleet ops', value: 40 },
          ],
        },
      },
      {
        heading: 'Strategy implications',
        body:
          'Prioritize platforms with simulation-to-field iteration, modular payload ecosystems, and compliance-ready software. Consider dual-use pathways: inspection and rescue share autonomy primitives with defense, but differ in regulation and sales cycles.',
      },
      {
        heading: 'What to monitor',
        body:
          'Track export controls, procurement frameworks, and ecosystem partnerships (payloads, comms, mapping). These determine who can scale from pilots into sustained fleets.',
      },
    ],
    signals: [
      { k: 'Field demand', v: 'Low-cognitive-load operator experiences become a decisive adoption driver.' },
      { k: 'Resilience', v: 'GNSS-denied navigation and comms robustness move from “feature” to “requirement.”' },
      { k: 'Workflows', v: 'Fleet management and training toolchains become the hidden scaling bottleneck.' },
      { k: 'Procurement', v: 'Buyers prefer deployable systems with support, spares, and updates packaged as a lifecycle offering.' },
    ],
    sources: [
      { label: 'NATO DIANA (dual-use accelerator)', url: 'https://www.diana.nato.int/' },
      { label: 'RAND – Unmanned aerial vehicles research', url: 'https://www.rand.org/topics/unmanned-aerial-vehicles.html' },
    ],
  },

  {
    id: 'enterprise-rag',
    date: '2025-12-18',
    kicker: 'Enterprise playbook',
    title: 'Enterprise semantic search is moving from “RAG demos” to governance-grade systems',
    subtitle:
      'Teams are standardizing evaluation, access control, and retrieval observability—turning knowledge systems into a managed platform capability rather than a one-off app feature.',
    tags: ['Semantic search', 'RAG', 'Governance'],
    heroImage:
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1800&q=70',
    supportImage:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=70',
    takeaways: [
      'Treat retrieval quality as a product metric: coverage, freshness, and groundedness—measured continuously.',
      'Identity, permissions, and audit trails are mandatory for regulated workflows; “RAG without governance” will stall.',
      'Observability (query → retrieval → answer) becomes the differentiator as model capabilities commoditize.',
    ],
    sections: [
      {
        heading: 'Why it matters',
        body:
          'Early RAG prototypes proved usefulness, but production systems require governance: permissions, lineage, evaluation, and monitoring. This shifts budgets toward platforms that deliver compliance and reliability—especially where hallucination risk is costly.',
        chart: {
          type: 'line',
          title: 'Governance maturity becomes a buying criterion',
          note: 'Illustrative maturity index (not actuals).',
          data: [
            { label: '2021', value: 10 },
            { label: '2022', value: 22 },
            { label: '2023', value: 40 },
            { label: '2024', value: 58 },
            { label: '2025', value: 72 },
          ],
        },
      },
      {
        heading: 'Strategy implications',
        body:
          'Build an internal “knowledge platform” layer: connectors, policy enforcement, evaluation harnesses, and retrieval observability. If you’re a vendor or startup, win by integrating deeply with enterprise identity systems and offering retrieval debugging with clear unit economics.',
      },
      {
        heading: 'What to monitor',
        body:
          'Watch standardization around evaluation metrics, policy frameworks, and security guidance for LLM systems. The market will consolidate around vendors who become the default governance layer for AI-assisted knowledge work.',
      },
    ],
    signals: [
      { k: 'Evaluation', v: 'Golden datasets, offline/online metrics, and regression testing become table stakes.' },
      { k: 'Security', v: 'Access control and audit trails expand from documents to retrieval steps and tool calls.' },
      { k: 'Observability', v: 'Teams demand traceability: “why was this chunk retrieved?” and “what changed since last week?”' },
      { k: 'Architecture', v: 'Hybrid retrieval (keyword + dense) returns as default to improve reliability and coverage.' },
    ],
    sources: [
      { label: 'NIST – AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
      { label: 'OWASP – Top 10 for LLM Applications', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' },
    ],
  },
]
