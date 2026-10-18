import defaults from '../data/portfolio-defaults.json';
import seeds from '../data/project-defaults.json';
import { supabaseAdmin } from './portfolio-api';

export async function contentOverrides() {
  try {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from('portfolio_content').select('key, payload');
    if (error || !data) return {};
    const out: Record<string, any> = {};
    for (const row of data) {
      try {
        out[row.key] = JSON.parse(row.payload);
      } catch {}
    }
    return out;
  } catch {
    return {};
  }
}

export async function resolvedPortfolio() {
  const o = await contentOverrides();
  const p = new Map<string, any>(seeds.map(item => [item.id, item]));
  for (const [k, v] of Object.entries(o)) {
    if (k.startsWith('project:')) p.set(k.slice(8), v);
  }
  return {
    profile: o.profile || defaults.profile,
    resume: o.resume || defaults.resume,
    services: o.services || defaults.services,
    projects: [...p.values()].filter(item => !item.archived),
  };
}

const str = (v: any, n: number) => {
  if (typeof v !== 'string' || v.length > n) throw Error('Please check the text length.');
  return v.trim();
};

const list = (v: any, n: number, l: number) => {
  if (!Array.isArray(v) || v.length > n) throw Error('Please check the list length.');
  return v.map(s => str(s, l)).filter(Boolean);
};

export function validateContent(k: string, v: any): any {
  if (!v || typeof v !== 'object') throw Error('Invalid content.');
  if (k === 'profile') {
    const r: any = {};
    for (const [f, n] of Object.entries({
      name: 100,
      tagline: 200,
      intro: 1200,
      about: 4000,
      story: 4000,
      approach: 4000,
    }))
      r[f] = str(v[f], n);
    if (!r.name) throw Error('Add your name.');
    r.skills = list(v.skills, 40, 100);
    for (const f of ['portrait', 'bookCover']) {
      if (v[f] !== undefined) {
        const url = str(v[f], 200);
        if (url && !/^\/api\/photo\/[a-zA-Z0-9-]{1,80}$/.test(url))
          throw Error('Choose an image from your uploaded photo series.');
        r[f] = url;
      }
    }
    return r;
  }
  if (k === 'resume') {
    if (!Array.isArray(v.experience) || v.experience.length > 15)
      throw Error('Use up to 15 experience entries.');
    return {
      summary: str(v.summary, 2000),
      experience: v.experience.map((e: any) => ({
        title: str(e.title, 150),
        context: str(e.context, 200),
        body: str(e.body, 2000),
      })),
      education: list(v.education, 10, 400),
      highlights: list(v.highlights, 12, 800),
    };
  }
  if (k === 'services') {
    if (!Array.isArray(v) || v.length > 8) throw Error('Use up to 8 services.');
    return v.map((s: any) => ({
      title: str(s.title, 120),
      description: str(s.description, 1200),
      deliverables: list(s.deliverables, 8, 400),
    }));
  }
  if (/^thinking:[a-z0-9][a-z0-9-]{0,49}$/.test(k)) {
    const r: any = {};
    for (const f of [
      'before',
      'assumptions',
      'sketch',
      'options',
      'choice',
      'tradeoff',
      'changedBefore',
      'changedEvidence',
      'changedAfter',
      'priorityFirst',
      'priorityLater',
      'priorityOut',
      'priorityReason',
      'failedAttempt',
      'failedSignal',
      'failedNext',
      'nextMove',
      'nextMeasure',
      'nextReconsider',
      'whyStack',
      'whyMetric',
      'whyFirst',
      'evidenceNotes',
      'evolutionEarly',
      'evolutionWorking',
      'evolutionCurrent',
      'question',
      'building',
      'lesson',
    ])
      r[f] = str(v[f] ?? '', 4000);
    r.updatedAt = Date.now();
    return r;
  }
  if (/^project:[a-z0-9][a-z0-9-]{0,49}$/.test(k)) {
    const r: any = { id: k.slice(8) };
    for (const [f, n] of Object.entries({
      title: 160,
      number: 10,
      tag: 100,
      summary: 600,
      intro: 3000,
      question: 3000,
      evidence: 4000,
      outcome: 4000,
    }))
      r[f] = str(v[f] ?? '', n);
    if (!r.title) throw Error('Add a project title.');
    r.room = v.room === 'founder' ? 'founder' : 'data';
    r.type = v.type === 'live' ? 'live' : 'project';
    r.stack = list(v.stack || [], 20, 100);
    r.work = list(v.work || [], 20, 2000);
    r.repository = str(v.repository ?? '', 300);
    if (
      r.repository &&
      !/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(r.repository)
    )
      throw Error('Use a GitHub repository URL.');
    r.featured = v.featured === true;
    r.archived = v.archived === true;
    r.pm = {};
    for (const f of ['problem', 'research', 'priorities', 'decisions', 'results', 'next'])
      r.pm[f] = str(v.pm?.[f] || '', 6000);
    return r;
  }
  throw Error('Unknown portfolio section.');
}
