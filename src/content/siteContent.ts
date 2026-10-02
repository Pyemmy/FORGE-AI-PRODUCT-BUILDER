export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface BlueprintNode {
  id: string;
  label: 'USERS' | 'FEATURES' | 'FLOW' | 'BRAND' | 'DATA';
  spec: string;
  detail: string;
  radialAngle: number;
  blueprintCol: number;
  blueprintRow: number;
}

export interface PulseBudgetItem {
  id: string;
  category: string;
  allocated: string;
  spent: string;
  percent: number;
}

export interface PulseChartPoint {
  day: string;
  value: number;
  amount: string;
}

export interface ForgeStage {
  index: number;
  code: string;
  id:
    | 'prompt'
    | 'deconstruct'
    | 'blueprint'
    | 'wireframe'
    | 'interface'
    | 'synthesis'
    | 'interactive'
    | 'badge'
    | 'forged';
  label: string;
  durationMs: number;
  summary: string;
}

export interface BriefField {
  id: string;
  label: 'Problem' | 'Users' | 'Goals' | 'Features';
  value: string;
  meta: string;
}

export interface IntelligenceNode {
  id: string;
  label: 'Users' | 'Goals' | 'Features' | 'Flows' | 'Requirements' | 'Constraints';
  code: string;
  x: number;
  y: number;
  spec: string;
  connections: string[];
}

export interface DesignFlowStep {
  id: string;
  step: string;
  label: 'Blueprint' | 'Wireframe' | 'Design system' | 'Interface';
  detail: string;
}

export interface IterateLoopStep {
  id: string;
  step: string;
  label: 'Prompt' | 'Change' | 'Preview' | 'Refine';
  detail: string;
}

export interface TeamRoleCard {
  id: string;
  role: 'Strategist' | 'UX Architect' | 'UI Designer' | 'Engineer' | 'QA';
  description: string;
  artifact: string;
  capabilities: string[];
}

export interface ExampleProjectCard {
  id: 'pulse' | 'studysync' | 'invoicely' | 'streaks';
  name: 'PULSE' | 'StudySync' | 'Invoicely' | 'Streaks';
  description: string;
  domainTag: string;
}

export interface PricingTier {
  id: string;
  name: 'Starter' | 'Pro' | 'Team';
  price: '$0/month' | '$29/month' | '$79/month';
  highlighted: boolean;
  features: string[];
  ctaLabel: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FooterColumn {
  id: string;
  title: 'Product' | 'Company' | 'Resources' | 'Legal';
  links: { label: string; href: string }[];
}

export const SITE_CONTENT = {
  brand: {
    name: 'FORGE',
    tagline: 'Turn ideas into products.',
  },
  navigation: {
    links: [
      { id: 'product', label: 'Product', href: '#product' },
      { id: 'how-it-works', label: 'How it works', href: '#how-it-works' },
      { id: 'examples', label: 'Examples', href: '#examples' },
      { id: 'pricing', label: 'Pricing', href: '#pricing' },
    ] as NavItem[],
    signInLabel: 'Sign in',
    primaryCtaLabel: 'Start building',
    primaryCtaArrow: '→',
  },
  hero: {
    eyebrow: 'AI PRODUCT ENGINEERING',
    headline: 'From thought to shipped.',
    supportingCopy:
      'Describe what you want to build. FORGE transforms the idea into a structured product, polished interface, and working codebase.',
    promptPlaceholder: 'Describe what you want to build...',
    defaultPrompt: 'Build a financial planning app for students.',
    submitCtaLabel: 'Start building',
    submitCtaArrow: '→',
    secondaryLinkLabel: 'See how it works',
    watchCtaLabel: 'Watch it forge',
    replayCtaLabel: 'Replay',
    pauseCtaLabel: 'Pause',
    resumeCtaLabel: 'Resume',
    reducedMotionNote: 'Static view active',
  },
  signInModal: {
    title: 'Access FORGE Workspace',
    subtitle: 'Enter your engineering credentials to open an existing project.',
    emailLabel: 'Work or university email',
    emailPlaceholder: 'you@domain.com',
    submitLabel: 'Continue to workspace →',
    closeLabel: 'Close',
    feedbackMessage: 'Workspace authentication link queued for your session.',
  },
  sequence: {
    totalStages: '09',
    stages: [
      {
        index: 1,
        code: '01',
        id: 'prompt',
        label: 'PROMPT',
        durationMs: 2200,
        summary: 'Capturing intent and converting natural language into an executable root node.',
      },
      {
        index: 2,
        code: '02',
        id: 'deconstruct',
        label: 'DECONSTRUCT',
        durationMs: 2200,
        summary: 'Signal pulse expands root intent into five core product dimensions.',
      },
      {
        index: 3,
        code: '03',
        id: 'blueprint',
        label: 'BLUEPRINT',
        durationMs: 2300,
        summary: 'Dimensions organize into a connected system architecture and product graph.',
      },
      {
        index: 4,
        code: '04',
        id: 'wireframe',
        label: 'WIREFRAME',
        durationMs: 2100,
        summary: 'Structural layout geometry and spatial hierarchy materialize.',
      },
      {
        index: 5,
        code: '05',
        id: 'interface',
        label: 'INTERFACE',
        durationMs: 2400,
        summary: 'High-contrast production surface renders for the PULSE student finance app.',
      },
      {
        index: 6,
        code: '06',
        id: 'synthesis',
        label: 'SYNTHESIS',
        durationMs: 3200,
        summary: 'Synchronized split view pairs live interface with streaming TypeScript source.',
      },
      {
        index: 7,
        code: '07',
        id: 'interactive',
        label: 'INTERACTIVE',
        durationMs: 2600,
        summary: 'State handlers, chart scrubbers, and budget rows bind for live inspection.',
      },
      {
        index: 8,
        code: '08',
        id: 'badge',
        label: 'DEPLOYMENT',
        durationMs: 1800,
        summary: 'Interface and codebase seal into a single deployable product artifact.',
      },
      {
        index: 9,
        code: '09',
        id: 'forged',
        label: 'FORGED',
        durationMs: 3000,
        summary: 'Production build complete and ready for continuous iteration.',
      },
    ] as ForgeStage[],
    nodes: [
      {
        id: 'users',
        label: 'USERS',
        spec: 'Undergraduate & grad cohorts',
        detail: 'Semester cashflow & shared housing splits',
        radialAngle: -90,
        blueprintCol: 1,
        blueprintRow: 1,
      },
      {
        id: 'features',
        label: 'FEATURES',
        spec: 'Safe-to-spend daily allowance',
        detail: 'Tuition reserve lock & textbook envelope',
        radialAngle: -18,
        blueprintCol: 2,
        blueprintRow: 1,
      },
      {
        id: 'flow',
        label: 'FLOW',
        spec: 'Campus card sync → Auto-sort',
        detail: 'Instant dining & transit categorization',
        radialAngle: 54,
        blueprintCol: 3,
        blueprintRow: 1,
      },
      {
        id: 'brand',
        label: 'BRAND',
        spec: 'PULSE // Dark monochrome UI',
        detail: 'Tabular typography & zero-clutter ledger',
        radialAngle: 126,
        blueprintCol: 1,
        blueprintRow: 2,
      },
      {
        id: 'data',
        label: 'DATA',
        spec: 'LedgerEntry · SemesterBudget',
        detail: 'Normalized schema with real-time rollup',
        radialAngle: 198,
        blueprintCol: 3,
        blueprintRow: 2,
      },
    ] as BlueprintNode[],
    pulseApp: {
      name: 'PULSE',
      tag: 'STUDENT LEDGER',
      semesterLabel: 'FALL SEMESTER · WK 06',
      balanceLabel: 'SAFE TO SPEND THIS WEEK',
      balanceAmount: '$342.80',
      totalBalanceLabel: 'SEMESTER RESERVE',
      totalBalanceAmount: '$4,180.00',
      deltaLabel: '-$18.40 vs last week',
      chartTitle: '7-DAY CAMPUS SPEND',
      chartPoints: [
        { day: 'MON', value: 38, amount: '$24.50' },
        { day: 'TUE', value: 62, amount: '$41.20' },
        { day: 'WED', value: 28, amount: '$16.00' },
        { day: 'THU', value: 84, amount: '$58.90' },
        { day: 'FRI', value: 52, amount: '$34.10' },
        { day: 'SAT', value: 70, amount: '$46.80' },
        { day: 'SUN', value: 30, amount: '$19.20' },
      ] as PulseChartPoint[],
      budgetsTitle: 'ACTIVE ENVELOPES',
      budgets: [
        {
          id: 'dining',
          category: 'Campus Dining & Coffee',
          allocated: '$240',
          spent: '$164',
          percent: 68,
        },
        {
          id: 'books',
          category: 'Course Materials & Lab',
          allocated: '$180',
          spent: '$90',
          percent: 50,
        },
        {
          id: 'transit',
          category: 'Metro Pass & Bike Share',
          allocated: '$85',
          spent: '$34',
          percent: 40,
        },
      ] as PulseBudgetItem[],
    },
    splitPanels: {
      leftLabel: 'DESIGN',
      rightLabel: 'CODE',
      filePath: 'src/components/PulseLedger.tsx',
      codeSnippet: `export function PulseLedger({ semester }: Props) {
  const { safeToSpend, envelopes } = useAllowance(semester);
  const [activeId, setActiveId] = useState<string>('dining');

  return (
    <section className="pulse-shell">
      <BalanceCard
        label="SAFE TO SPEND THIS WEEK"
        amount={safeToSpend}
        reserve="$4,180.00"
      />
      <SpendChart window="7d" interactive />
      <EnvelopeList
        items={envelopes}
        selected={activeId}
        onSelect={setActiveId}
      />
    </section>
  );
}`,
    },
    liveBadge: {
      label: 'LIVE PRODUCT',
      sublabel: 'PULSE · DEPLOYED ARTIFACT · READY',
    },
    forgedState: {
      headline: 'FORGED.',
      subheadline: 'Your product is ready to evolve.',
    },
  },

  sections: {
    blankCanvas: {
      headline: 'The blank canvas is optional now.',
      body: 'Start with an idea. Let FORGE turn ambiguity into a product you can see, edit, and build.',
      frameTitle: 'WORKSPACE_01 · STRUCTURAL ASSEMBLY',
      layers: [
        { id: 'grid', label: '01. Spatial Grid', status: 'LOCKED' },
        { id: 'nav', label: '02. Navigation Shell', status: 'MOUNTED' },
        { id: 'primary', label: '03. Primary Surface', status: 'ALLOCATED' },
        { id: 'telemetry', label: '04. Data Modules', status: 'BOUND' },
      ],
      canvasBlocks: {
        sidebarLabel: 'NAVIGATION TREE',
        headerLabel: 'VIEWPORT HEADER · 1440PX',
        mainPanelLabel: 'PRIMARY PRODUCT SURFACE',
        metricLabels: ['MODULE_A · LEDGER', 'MODULE_B · FLOW', 'MODULE_C · STATE'],
        inspectorLabel: 'SCHEMA & CONSTRAINTS',
      },
    },

    oneIdea: {
      id: 'product',
      headline: 'Start with what you know.',
      body: "A sentence is enough. FORGE turns it into a product brief: who it's for, what it does, what to build first.",
      promptLabel: 'INPUT SENTENCE',
      promptText: 'Build a financial planning app for students.',
      briefHeader: 'STRUCTURED PRODUCT BRIEF',
      briefFields: [
        {
          id: 'problem',
          label: 'Problem',
          value: 'Irregular semester disbursements make weekly budgeting difficult to track.',
          meta: 'PRIORITY · HIGH',
        },
        {
          id: 'users',
          label: 'Users',
          value: 'University students managing tuition reserves, dining, and shared rent.',
          meta: 'COHORT · CAMPUS',
        },
        {
          id: 'goals',
          label: 'Goals',
          value: 'Surface a clear daily safe-to-spend number while protecting fixed tuition funds.',
          meta: 'METRIC · RETENTION',
        },
        {
          id: 'features',
          label: 'Features',
          value: 'Semester reserve lock, 7-day campus spend graph, and category envelopes.',
          meta: 'SCOPE · MVP V1',
        },
      ] as BriefField[],
    },

    productIntelligence: {
      headline: 'One thought. An entire product system.',
      body: 'FORGE connects product thinking, UX, visual design, and engineering in one continuous workflow.',
      nodes: [
        {
          id: 'users',
          label: 'Users',
          code: 'SYS_01',
          x: 150,
          y: 95,
          spec: 'Personas, permissions, and cohort usage patterns.',
          connections: ['goals', 'flows'],
        },
        {
          id: 'goals',
          label: 'Goals',
          code: 'SYS_02',
          x: 450,
          y: 70,
          spec: 'Core product outcomes and measurable success criteria.',
          connections: ['features', 'requirements'],
        },
        {
          id: 'features',
          label: 'Features',
          code: 'SYS_03',
          x: 750,
          y: 95,
          spec: 'Functional modules prioritized for initial release.',
          connections: ['flows', 'constraints'],
        },
        {
          id: 'flows',
          label: 'Flows',
          code: 'SYS_04',
          x: 150,
          y: 265,
          spec: 'End-to-end screen transitions and state paths.',
          connections: ['requirements'],
        },
        {
          id: 'requirements',
          label: 'Requirements',
          code: 'SYS_05',
          x: 450,
          y: 290,
          spec: 'Data models, validation rules, and interface contracts.',
          connections: ['constraints'],
        },
        {
          id: 'constraints',
          label: 'Constraints',
          code: 'SYS_06',
          x: 750,
          y: 265,
          spec: 'Performance budgets, accessibility, and device bounds.',
          connections: ['users'],
        },
      ] as IntelligenceNode[],
    },

    design: {
      id: 'how-it-works',
      headline: 'From structure to interface.',
      steps: [
        {
          id: 'blueprint',
          step: '01',
          label: 'Blueprint',
          detail: 'Information architecture, screen hierarchy, and domain data flow.',
        },
        {
          id: 'wireframe',
          step: '02',
          label: 'Wireframe',
          detail: 'Spatial layout grid, component density, and interactive zones.',
        },
        {
          id: 'design-system',
          step: '03',
          label: 'Design system',
          detail: 'Type scale, surface contrast tokens, and precision border radii.',
        },
        {
          id: 'interface',
          step: '04',
          label: 'Interface',
          detail: 'Production-grade dark UI with responsive states and microinteractions.',
        },
      ] as DesignFlowStep[],
    },

    code: {
      headline: 'If it can be designed, it can be built.',
      leftLabel: 'UI',
      rightLabel: 'CODE.',
      fileLabel: 'src/modules/PulseDashboard.tsx',
    },

    iterate: {
      headline: 'Change it by saying so.',
      examplePrompt: 'Make the dashboard feel more premium and reduce visual noise.',
      steps: [
        {
          id: 'prompt',
          step: '01',
          label: 'Prompt',
          detail: 'Describe the refinement in direct, natural language.',
        },
        {
          id: 'change',
          step: '02',
          label: 'Change',
          detail: 'FORGE updates layout density, token contrast, and component hierarchy.',
        },
        {
          id: 'preview',
          step: '03',
          label: 'Preview',
          detail: 'Inspect the updated interface side-by-side in real time.',
        },
        {
          id: 'refine',
          step: '04',
          label: 'Refine',
          detail: 'Commit the iteration or continue shaping details.',
        },
      ] as IterateLoopStep[],
      beforeLabel: 'BEFORE · HIGH VISUAL NOISE',
      afterLabel: 'AFTER · REFINED & FOCUSED',
    },

    ship: {
      headline: 'Make it real.',
      statusLeft: 'BUILD COMPLETE',
      statusRight: 'LIVE',
      checks: [
        'TYPESCRIPT STRICT · 0 ERRORS',
        'RESPONSIVE GRID · VERIFIED',
        'WCAG AA CONTRAST · PASSED',
        'PRODUCTION BUNDLE · READY',
      ],
    },

    marqueeVocabulary: [
      'FORGE',
      'SHAPE',
      'CRAFT',
      'BUILD',
      'COMPOSE',
      'PROTOTYPE',
      'BLUEPRINT',
      'ITERATE',
      'SHIP',
    ],

    team: {
      headline: 'Your AI product team. In one workspace.',
      roles: [
        {
          id: 'strategist',
          role: 'Strategist',
          description: 'Turns vague ideas into product requirements.',
          artifact: 'BRIEF.SPEC',
          capabilities: ['Target users', 'Problem', 'MVP scope'],
        },
        {
          id: 'ux-architect',
          role: 'UX Architect',
          description: 'Maps screens, journeys, and edge cases.',
          artifact: 'FLOW.GRAPH',
          capabilities: ['Screen map', 'User flows', 'Edge cases'],
        },
        {
          id: 'ui-designer',
          role: 'UI Designer',
          description: 'Builds the visual system and layouts.',
          artifact: 'TOKENS.CSS',
          capabilities: ['Design tokens', 'Type scale', 'Layout grid'],
        },
        {
          id: 'engineer',
          role: 'Engineer',
          description: 'Turns approved designs into working interfaces.',
          artifact: 'APP.TSX',
          capabilities: ['React + TSX', 'State logic', 'Data bindings'],
        },
        {
          id: 'qa',
          role: 'QA',
          description: 'Tests visuals, function, responsiveness, and accessibility.',
          artifact: 'AUDIT.LOG',
          capabilities: ['Visual diff', 'Responsiveness', 'WCAG AA'],
        },
      ] as TeamRoleCard[],
    },

    examples: {
      id: 'examples',
      headline: 'Built with FORGE.',
      note: 'Sample projects',
      projects: [
        {
          id: 'pulse',
          name: 'PULSE',
          description: 'A personal finance platform for university students.',
          domainTag: 'FINANCE · LEDGER',
        },
        {
          id: 'studysync',
          name: 'StudySync',
          description: 'A collaborative study planner with shared deadlines.',
          domainTag: 'EDUCATION · PLANNER',
        },
        {
          id: 'invoicely',
          name: 'Invoicely',
          description: 'Invoicing and payment tracking for freelancers.',
          domainTag: 'BILLING · WORKFLOW',
        },
        {
          id: 'streaks',
          name: 'Streaks',
          description: 'A habit tracker built around weekly goals.',
          domainTag: 'PRODUCTIVITY · HABITS',
        },
      ] as ExampleProjectCard[],
    },

    pricing: {
      id: 'pricing',
      headline: 'Pricing',
      note: 'Placeholder pricing.',
      tiers: [
        {
          id: 'starter',
          name: 'Starter',
          price: '$0/month',
          highlighted: false,
          features: ['3 projects', 'blueprint and design generation', 'live preview'],
          ctaLabel: 'Start with Starter →',
        },
        {
          id: 'pro',
          name: 'Pro',
          price: '$29/month',
          highlighted: true,
          features: [
            'unlimited projects',
            'code generation',
            'version history',
            'iterate with prompts',
          ],
          ctaLabel: 'Start with Pro →',
        },
        {
          id: 'team',
          name: 'Team',
          price: '$79/month',
          highlighted: false,
          features: [
            'everything in Pro',
            'shared workspaces',
            'priority generation',
            'deployment tools',
          ],
          ctaLabel: 'Start with Team →',
        },
      ] as PricingTier[],
    },

    faq: {
      headline: 'Frequently asked questions.',
      items: [
        {
          id: 'q1',
          question: 'What is FORGE?',
          answer:
            'An AI workspace that turns a rough idea into a product blueprint, interface, and working code.',
        },
        {
          id: 'q2',
          question: 'Do I need to know how to code?',
          answer:
            'No. You describe the product; FORGE handles structure, design, and code. You can read and edit the code if you want to.',
        },
        {
          id: 'q3',
          question: 'Can I change what FORGE builds?',
          answer:
            'Yes. Describe the change in plain language and see it in the preview.',
        },
        {
          id: 'q4',
          question: 'Who owns what I build?',
          answer:
            'You do. (Placeholder answer; final terms to be confirmed.)',
        },
        {
          id: 'q5',
          question: 'Can I ship what I make?',
          answer:
            "Yes. Preview it live, then deploy when you're ready.",
        },
      ] as FaqItem[],
    },

    finalCta: {
      headline: 'What are you building?',
      subtext: "Don't wait until the idea is perfect.",
      promptPlaceholder: 'Describe your idea...',
      buttonLabel: 'Forge it →',
    },

    footer: {
      copyright: '© 2026 FORGE.',
      signatureLine: 'FORGED, NOT FINISHED.',
      columns: [
        {
          id: 'product',
          title: 'Product',
          links: [
            { label: 'Overview', href: '#product' },
            { label: 'How it works', href: '#how-it-works' },
            { label: 'Examples', href: '#examples' },
            { label: 'Pricing', href: '#pricing' },
          ],
        },
        {
          id: 'company',
          title: 'Company',
          links: [
            { label: 'About', href: '#top' },
            { label: 'Method', href: '#how-it-works' },
            { label: 'Careers', href: '#top' },
            { label: 'Contact', href: '#final-cta' },
          ],
        },
        {
          id: 'resources',
          title: 'Resources',
          links: [
            { label: 'Documentation', href: '#how-it-works' },
            { label: 'Blueprints', href: '#product' },
            { label: 'Sample Projects', href: '#examples' },
            { label: 'FAQ', href: '#faq' },
          ],
        },
        {
          id: 'legal',
          title: 'Legal',
          links: [
            { label: 'Privacy Policy', href: '#top' },
            { label: 'Terms of Service', href: '#top' },
            { label: 'Security', href: '#top' },
          ],
        },
      ] as FooterColumn[],
    },
  },
} as const;
