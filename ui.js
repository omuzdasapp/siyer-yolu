// Küçük DOM yardımcıları.
export function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  return el;
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function toast(msg, ms = 2600) {
  const t = h('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(t);
  setTimeout(() => t.classList.add('out'), ms);
  setTimeout(() => t.remove(), ms + 400);
}

export function confetti(n = 18) {
  const box = h('div', { class: 'confetti', 'aria-hidden': 'true' });
  for (let i = 0; i < n; i++) {
    box.append(h('span', { style: { left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 0.5}s`, background: ['#c8962e', '#1f7a6b', '#e9d8b4', '#0f3b3a'][i % 4] } }));
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 2400);
}
