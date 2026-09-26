/**
 * Content model — every piece of structured copy lives here so the site can be
 * updated without touching layout code.
 *
 * STATUS VOCABULARY (used consistently across the whole site)
 *   current       — exists and operates today
 *   active        — being worked on now
 *   experimental  — being tested in the lab
 *   planned       — scoped, not started
 *   vision        — long-term ambition
 */

/* --------------------------------------------------------------------------
   NKT ecosystem diagram
   -------------------------------------------------------------------------- */
export const ecosystem = {
  group: {
    title: 'NKT Group',
    status: 'current',
    body: [
      'NKT Group is the parent ecosystem — a way of holding real-world businesses, property assets and operations inside one long-term structure rather than treating each as a separate experiment.',
      'It is run by George S. Thomas as Owner / Managing Director, and is deliberately small, physical and grounded: charging infrastructure, property and trading operations that have to work in the real world before they scale.'
    ],
    tags: ['Business ecosystem', 'Asset base', 'Operations', 'Long-term thinking'],
    location: 'Thodupuzha, Kerala, India'
  },
  charge: {
    title: 'NKT Charge Hub',
    status: 'current',
    body: [
      'An EV charging business operating at Nedumpurath Towers, Thodupuzha, Kerala — DC fast charging on CCS2 with 90 kW charging infrastructure.',
      'The business covers the physical side (charging infrastructure, site operations) and the digital side (charging management, digital monitoring, CCTV and security). Future smart-energy possibilities are part of the roadmap, not current claims.'
    ],
    tags: ['EV charging', 'DC fast charging', 'CCS2', '90 kW infrastructure', 'Business operations', 'Charging infrastructure', 'Digital monitoring', 'CCTV / security', 'Future smart energy'],
    location: 'Nedumpurath Towers, Thodupuzha, Kerala'
  },
  towers: {
    title: 'Nedumpurath Towers',
    status: 'current',
    body: [
      'A real-world property and business asset within the NKT ecosystem — the physical location where NKT Charge Hub operates, and a working example of why the ecosystem is built asset-first.',
      'Property is the slowest, most permanent layer of any business. Understanding it is part of learning how to hold and grow real value.'
    ],
    tags: ['Property asset', 'Commercial location', 'Real-world operations', 'Asset base'],
    location: 'Thodupuzha, Kerala'
  },
  vessels: {
    title: 'NKT Vessels House',
    status: 'current',
    body: [
      'Another NKT business and property-related operation within the ecosystem — part of the same philosophy of running tangible, real-world activities alongside the technology work.',
      'Details and expansion plans live with the business itself; what is shown here is its place in the wider structure.'
    ],
    tags: ['Business operation', 'Property-related', 'Trading operation', 'NKT ecosystem'],
    location: 'Kerala, India'
  },
  future: {
    title: 'Future Ventures',
    status: 'vision',
    body: [
      'An intentionally open space. Future ventures are not named here because naming them before they exist would be guessing — and this ecosystem is built on what is real.',
      'The direction is clear: new ventures that connect the physical business base with the technology, finance and infrastructure systems being built in parallel.'
    ],
    tags: ['Vision', 'Planned', 'Undefined on purpose'],
    location: 'To be decided'
  }
};

/* --------------------------------------------------------------------------
   My_AI_OS — architecture layers
   -------------------------------------------------------------------------- */
export const aiLayers = {
  '01': 'Everything the system is allowed to know: notes, documents, business records, market research, operational data. Owning the input layer is what makes the rest trustworthy.',
  '02': 'Retrieval, relationships and continuity. RAG finds what is relevant, a knowledge graph explains how things connect, and memory keeps context across time instead of resetting every conversation.',
  '03': 'A routing layer that decides which model handles which task — local where privacy matters, hosted where capability matters, deterministic code where neither model is needed.',
  '04': 'Language models and agents working as a team: one for analysis, one for drafting, one for checking. Agents get scoped tools and clear authority, not unrestricted access.',
  '05': 'The part most systems skip — turning answers into executed work: updating records, generating reports, triggering automations and closing the loop back into the data layer.'
};

/* --------------------------------------------------------------------------
   The Long Game — vision map
   -------------------------------------------------------------------------- */
export const visionNodes = {
  life: {
    title: 'Personal Life',
    status: 'current',
    body: 'The foundation everything else is built on. Health, family, time and freedom — the reason the rest of the map exists at all.',
    points: ['Family first, always', 'Health as an operating requirement', 'Freedom of time over display of wealth']
  },
  wealth: {
    title: 'Wealth',
    status: 'active',
    body: 'Capital built patiently across markets, real assets and private opportunities — with the discipline to separate investing from trading.',
    points: ['Long-horizon allocation', 'Learning before leverage', 'Systems, not hunches']
  },
  nkt: {
    title: 'NKT Group',
    status: 'current',
    body: 'Real businesses and real assets generating the operational experience and the cash flow that fund everything downstream.',
    points: ['EV charging infrastructure', 'Property and trading operations', 'Asset-first thinking']
  },
  apex: {
    title: 'Apex Creator OS',
    status: 'planned',
    body: 'A financial operating system that treats personal, family and business money as separate entities with shared visibility.',
    points: ['Safe-to-Spend discipline', 'Family Hub', 'Net worth and goals as a system']
  },
  aios: {
    title: 'My_AI_OS',
    status: 'experimental',
    body: 'The intelligence layer that connects knowledge, memory, models and automation so decisions are informed by everything already learned.',
    points: ['Knowledge graph and memory', 'Model routing', 'Agents that act, not just answer']
  },
  lab: {
    title: 'THOMU LAB',
    status: 'active',
    body: 'The R&D engine — where AI, automation, software and infrastructure experiments either prove themselves or teach something and get retired.',
    points: ['Local-first AI', 'Automation and developer tools', 'Open-source contribution']
  },
  infra: {
    title: 'Technology & Infrastructure',
    status: 'experimental',
    body: 'Owned digital foundations: servers, containers, networking, private access and self-hosted services that keep the ecosystem independent.',
    points: ['Homelab and private cloud', 'Self-hosted services', 'Security and backups']
  },
  ventures: {
    title: 'Future Ventures',
    status: 'vision',
    body: 'Left deliberately open. The ecosystem is being built so that when the right venture appears, the capital, infrastructure and systems to support it already exist.',
    points: ['Not defined yet', 'Built to be ready', 'Long-term horizon']
  }
};

/* --------------------------------------------------------------------------
   Open-Source Universe — organisation of worlds
   -------------------------------------------------------------------------- */
export const worlds = [
  { id: 'personal', title: 'Personal Life', desc: 'Personal productivity, knowledge, automation and privacy.' },
  { id: 'wealth', title: 'Wealth', desc: 'Finance, market research, portfolio tracking and analytics.' },
  { id: 'business', title: 'Business / NKT', desc: 'Operations, dashboards, automation, CRM and infrastructure.' },
  { id: 'lab', title: 'THOMU LAB', desc: 'AI, agents, RAG, local models, developer tools and infrastructure.' }
];

/**
 * PROJECT INDEX
 * ------------
 * Deliberately empty. No repository is invented, listed or linked before it
 * actually exists in public.
 *
 * To publish a project, add an object in this shape and redeploy:
 *
 * {
 *   name: 'project-name',
 *   world: 'personal' | 'wealth' | 'business' | 'lab',
 *   purpose: 'One sentence on what problem it solves.',
 *   status: 'Completed' | 'Active' | 'Experimental' | 'Planned' | 'Wishlist' | 'Superseded',
 *   github: 'https://github.com/<account>/<repo>'   // omit if not public yet
 * }
 */
export const projects = [];
