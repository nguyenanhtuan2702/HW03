const fs = require('node:fs');
const path = require('node:path');
const cases = require('./cases.json');
const { excludedRuns } = require('./safari-evidence-review.json');

const task = path.resolve(__dirname, '..');
const platforms = ['chrome-windows', 'firefox-windows', 'safari-apple'];
const statuses = ['Passed', 'Failed', 'Blocked', 'Not Run', 'N/A'];
const input = fs.readdirSync(__dirname).filter((name) => /^(chrome-windows|firefox-windows|safari-apple)-.*\.json$/.test(name));
const runs = input.map((name) => ({ name, ...JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8')) }))
  .filter((run) => run.metadata.platform === 'safari-apple'
    ? (run.metadata.jobId || ['sauce-live-manual', 'student-manual'].includes(run.metadata.mode)) && run.results.length && !excludedRuns[run.metadata.runId]
    : run.metadata.finished && !run.metadata.error)
  .sort((a, b) => a.metadata.started.localeCompare(b.metadata.started));
const runMetadata = Object.fromEntries(runs.map((run) => [`automation/${run.name}`, run.metadata]));

const environment = Object.fromEntries(platforms.map((platform) => {
  const available = runs.filter((run) => run.metadata.platform === platform);
  const primary = available.findLast((run) => run.results.length === cases.length);
  const safariSmoke = platform === 'safari-apple' && fs.existsSync(path.join(task, 'evidence/sauce-smoke/HW03-MWG5L5L2/safari-window-video-39.35s.png'));
  const proof = available.findLast((run) => run.metadata.platformEvidence && run.metadata.proofAccepted === true) || (safariSmoke ? { metadata: {
    platformEvidence: 'evidence/sauce-smoke/HW03-MWG5L5L2/safari-window-video-39.35s.png',
  } } : undefined);
  const selected = new Map((primary?.results ?? []).map((result) => [result.id, { ...result, log: `automation/${primary.name}` }]));
  for (const run of available.filter((entry) => entry.results.length < cases.length && !entry.metadata.proofOnly)) {
    for (const result of run.results) {
      if ((primary && run.metadata.started < primary.metadata.started && result.id !== 'S-05') || result.status === 'Not Run') continue;
      if (result.status === 'Blocked' && ['Passed', 'Failed'].includes(selected.get(result.id)?.status)) continue;
      selected.set(result.id, { ...result, log: `automation/${run.name}` });
    }
  }
  const latest = available.findLast((run) => !['sauce-live-manual', 'student-manual'].includes(run.metadata.mode)) || available.at(-1);
  return [platform, { primary: primary || latest, proof, selected }];
}));

const entries = cases.map((definition) => {
  const outcomes = Object.fromEntries(platforms.map((platform) => [platform,
    environment[platform].selected.get(definition.id) ?? { status: 'Not Run', notes: 'Chưa có lượt thực thi trên môi trường này.' },
  ]));
  const [chrome, firefox] = platforms.map((platform) => outcomes[platform].status);
  const safari = outcomes['safari-apple'].status;
  const done = ['Passed', 'Failed'];
  let classification = '';
  if ([chrome, firefox, safari].every((status) => status === 'Failed')) classification = definition.task1 === 'Failed' ? 'Lỗi SUT tái hiện trên cả ba' : 'Sai lệch mới trên cả ba';
  else if ([chrome, firefox, safari].every((status) => done.includes(status)) && new Set([chrome, firefox, safari]).size > 1) classification = 'Khác biệt cần xác minh';
  else if (!done.includes(chrome) || !done.includes(firefox)) classification = 'Giới hạn kiểm thử';
  else if (chrome !== firefox) classification = 'Khác biệt trạng thái Windows';
  else if (chrome === 'Failed') classification = definition.task1 === 'Failed' ? 'Lỗi SUT tái hiện trên Windows' : 'Sai lệch mới trên cả hai';
  return { ...definition, outcomes, classification };
});

const counts = Object.fromEntries(platforms.map((p) => [p,
  Object.fromEntries(statuses.map((s) => [s, entries.filter((c) => c.outcomes[p].status === s).length])),
]));
for (const entry of entries) {
  for (const outcome of Object.values(entry.outcomes)) {
    if (outcome.status === 'Failed' && (!outcome.evidence || !fs.existsSync(path.join(task, outcome.evidence)))) {
      throw Error(`Thiếu ảnh lỗi ${entry.id} · ${outcome.log}`);
    }
  }
}
for (const [platform, count] of Object.entries(counts)) {
  console.log(platform, JSON.stringify(count), environment[platform].primary?.name ?? 'Chưa chạy', environment[platform].proof?.metadata.platformEvidence ?? 'Thiếu ảnh cửa sổ');
}

module.exports = { platforms, statuses, entries, environment, counts, runMetadata };
