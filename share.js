// Instagram hikâyesi boyutunda (1080×1920) paylaşım görseli üretir ve paylaşır.
import { toast } from './ui.js';

const SITE = location.host || 'siyer-yolu.vercel.app';

function draw({ kind, streak, lessons, me, opp, mine, theirs, res }) {
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1920;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 1920);
  grad.addColorStop(0, '#0f3b3a'); grad.addColorStop(1, '#1f5f57');
  g.fillStyle = grad; g.fillRect(0, 0, 1080, 1920);
  // Geometrik süs: sekiz köşeli yıldızlar
  g.strokeStyle = 'rgba(233,216,180,.12)'; g.lineWidth = 3;
  for (let y = 120; y < 1920; y += 260) for (let x = (y / 260) % 2 ? 130 : 0; x < 1080 + 130; x += 260) {
    g.save(); g.translate(x, y);
    for (const r of [0, Math.PI / 4]) { g.save(); g.rotate(r); g.strokeRect(-60, -60, 120, 120); g.restore(); }
    g.restore();
  }
  g.textAlign = 'center';
  g.fillStyle = '#e9d8b4'; g.font = '700 64px Unbounded, sans-serif'; g.fillText('Siyer Yolu', 540, 260);
  g.fillStyle = 'rgba(251,247,238,.75)'; g.font = '600 40px Manrope, sans-serif'; g.fillText('Günde 5 dakikada siyer', 540, 330);

  g.fillStyle = '#fbf7ee';
  if (kind === 'seri') {
    g.font = '700 300px Unbounded, sans-serif'; g.fillText(String(streak), 540, 1000);
    g.font = '700 72px Unbounded, sans-serif'; g.fillText('günlük seri 🔥', 540, 1120);
    g.fillStyle = '#e9d8b4'; g.font = '600 48px Manrope, sans-serif'; g.fillText(`${lessons} ders tamamlandı`, 540, 1230);
  } else {
    g.font = '700 84px Unbounded, sans-serif';
    g.fillText(res === 'win' ? 'Kazandım! 🏆' : res === 'draw' ? 'Berabere 🤝' : 'Rövanş zamanı!', 540, 760);
    g.font = '700 200px Unbounded, sans-serif'; g.fillText(`${mine}`, 300, 1060); g.fillText(`${theirs}`, 780, 1060);
    g.font = '700 80px Unbounded, sans-serif'; g.fillText('–', 540, 1030);
    g.fillStyle = '#e9d8b4'; g.font = '600 44px Manrope, sans-serif';
    g.fillText(me.slice(0, 16), 300, 1150); g.fillText(opp.slice(0, 16), 780, 1150);
  }
  g.fillStyle = '#c8962e'; g.beginPath(); g.roundRect(240, 1560, 600, 120, 60); g.fill();
  g.fillStyle = '#0f3b3a'; g.font = '700 42px Manrope, sans-serif'; g.fillText('Sen de katıl', 540, 1634);
  g.fillStyle = 'rgba(251,247,238,.8)'; g.font = '600 36px Manrope, sans-serif'; g.fillText(SITE, 540, 1760);
  return c;
}

export async function shareCard(data) {
  try {
    await document.fonts?.ready;
    const c = draw(data);
    const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
    const file = new File([blob], 'siyer-yolu.png', { type: 'image/png' });
    const text = data.kind === 'seri' ? `Siyer Yolu'nda ${data.streak} günlük serim var! 🔥 https://${SITE}` : `Siyer Yolu siyer yarışında ${data.mine}–${data.theirs}! ⚡ https://${SITE}`;
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], text }); return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'siyer-yolu.png'; a.click();
    toast('Görsel indirildi. Instagram hikâyende paylaşabilirsin.');
  } catch (e) { if (e?.name !== 'AbortError') toast('Paylaşım açılamadı.'); }
}
