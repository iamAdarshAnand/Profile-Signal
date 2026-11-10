'use strict';

const signals = [
  { id: 'impersonation', label: 'Copies an identity', hint: 'Uses someone else’s name, photo, or brand with conflicting identity details.', weight: 4 },
  { id: 'payment', label: 'Requests money or sensitive information', hint: 'Asks for a payment, password, login code, or private documents.', weight: 5 },
  { id: 'links', label: 'Sends suspicious links', hint: 'Uses a lookalike domain or an unexpected login, giveaway, or download page.', weight: 4 },
  { id: 'pressure', label: 'Uses pressure or urgency', hint: 'Pushes you to act immediately or move a conversation off-platform.', weight: 3 },
  { id: 'consistency', label: 'Profile details conflict', hint: 'The bio, handle, stated affiliation, and posts tell inconsistent stories.', weight: 2 },
  { id: 'spam', label: 'Repeats promotional activity', hint: 'Posts or sends the same promotions, replies, or unsolicited messages repeatedly.', weight: 2 },
  { id: 'history', label: 'Shows an abrupt change in activity', hint: 'A previously unrelated profile suddenly changes its identity or starts promoting offers.', weight: 2 }
];

const guidance = {
  insufficient: 'Confirm the account through a website or contact channel you already trust. Check more signals when you can see additional evidence.',
  low: 'Use a known contact channel to confirm any important request. Keep an eye out for unusual messages or links.',
  elevated: 'Compare the account with links from the person’s or organization’s official website. Use a trusted channel to confirm any requests.',
  high: 'Pause before replying, opening links, or sending money or codes. Confirm the request through an independent channel and use the platform’s report tools if you verify abuse.'
};

const labels = {
  insufficient: 'Insufficient evidence',
  low: 'Low observed risk',
  elevated: 'Elevated risk',
  high: 'High risk'
};

function assess(observations) {
  const findings = signals.filter(signal => observations[signal.id] === 'yes');
  const reviewed = signals.filter(signal => ['yes', 'no'].includes(observations[signal.id])).length;
  const points = findings.reduce((total, signal) => total + signal.weight, 0);
  let level = 'low';
  if (points >= 8 || observations.payment === 'yes') level = 'high';
  else if (points >= 3) level = 'elevated';
  else if (reviewed < 4) level = 'insufficient';
  return { findings, reviewed, level };
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('#screen');
  const profile = document.querySelector('#profile');
  const report = document.querySelector('#report');
  const initialReport = report.firstElementChild.cloneNode(true);
  const signalList = document.querySelector('#signals');
  const placeholders = {
    Facebook: 'e.g. facebook.com/example',
    X: 'e.g. x.com/example',
    Instagram: 'e.g. instagram.com/example'
  };

  for (const signal of signals) {
    const row = element('div', '', 'signal');
    const description = element('div');
    const label = element('label', signal.label);
    label.htmlFor = signal.id;
    const hint = element('small', signal.hint);
    hint.id = signal.id + '-hint';
    description.append(label, hint);
    const select = element('select');
    select.name = select.id = signal.id;
    select.setAttribute('aria-describedby', hint.id);
    for (const [value, title] of [['unknown', 'Unknown'], ['yes', 'Yes'], ['no', 'No']]) {
      const option = element('option', title);
      option.value = value;
      select.append(option);
    }
    row.append(description, select);
    signalList.append(row);
  }

  function renderReport() {
    const data = Object.fromEntries(new FormData(form));
    const { findings, reviewed, level } = assess(data);
    const card = element('div', '', 'report-card');
    const badge = element('span', labels[level], 'badge');
    badge.dataset.level = level;
    card.append(badge, element('h3', data.platform));
    if (data.profile.trim()) card.append(element('p', data.profile.trim(), 'account'));
    card.append(element('p', reviewed + ' of ' + signals.length + ' signals reviewed', 'coverage'));
    const list = element('ul', '', 'findings');
    for (const signal of findings) list.append(element('li', signal.label));
    if (findings.length === 0) list.append(element('li', 'No risk signals marked Yes.'));
    card.append(list, element('p', guidance[level], 'recommendation'));
    report.replaceChildren(card);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    renderReport();
    if (matchMedia('(max-width: 780px)').matches) report.scrollIntoView({ block: 'center' });
  });

  form.addEventListener('change', () => {
    profile.placeholder = placeholders[form.elements.platform.value];
    report.replaceChildren(initialReport.cloneNode(true));
  });

  profile.addEventListener('input', () => report.replaceChildren(initialReport.cloneNode(true)));

  form.addEventListener('reset', () => {
    profile.placeholder = placeholders.Facebook;
    report.replaceChildren(initialReport.cloneNode(true));
  });

  document.querySelector('#demo').addEventListener('click', () => {
    profile.value = 'Example profile (fictional)';
    for (const signal of signals) form.elements[signal.id].value = 'unknown';
    form.elements.impersonation.value = 'yes';
    form.elements.payment.value = 'yes';
    form.elements.pressure.value = 'yes';
    form.requestSubmit();
  });
}

if (typeof module !== 'undefined') module.exports = { assess };
