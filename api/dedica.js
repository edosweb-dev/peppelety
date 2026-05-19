import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENT = 'giuseppe.famiani@edos.it';

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const body = (typeof req.body === 'object' && req.body !== null) ? req.body : {};

  if (String(body._honey || '').trim() !== '') {
    res.status(200).json({ success: true });
    return;
  }

  const nome = String(body.nome || '').trim();
  const messaggio = String(body.messaggio || '').trim();

  if (!nome || !messaggio) {
    res.status(400).json({ success: false, error: 'Campi mancanti' });
    return;
  }
  if (nome.length > 200 || messaggio.length > 5000) {
    res.status(400).json({ success: false, error: 'Campo troppo lungo' });
    return;
  }

  const safeName = escapeHtml(nome);
  const safeMsg = escapeHtml(messaggio).replace(/\n/g, '<br>');

  try {
    const result = await resend.emails.send({
      from: 'Dediche Giuseppe & Letizia <onboarding@resend.dev>',
      to: RECIPIENT,
      subject: `Nuova dedica da ${nome}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fffaf0;border-radius:12px;">
  <h2 style="color:#2c5282;margin:0 0 16px;font-family:Georgia,serif;">Una nuova dedica</h2>
  <p style="margin:0 0 8px;color:#555;"><strong>Da:</strong> ${safeName}</p>
  <p style="margin:16px 0 8px;color:#555;"><strong>Messaggio:</strong></p>
  <blockquote style="border-left:4px solid #d4af37;padding:12px 18px;margin:0;color:#222;background:#fff;border-radius:6px;font-style:italic;">
    ${safeMsg}
  </blockquote>
  <p style="margin-top:24px;font-size:12px;color:#999;">Inviato dal sito save-the-date di Giuseppe &amp; Letizia.</p>
</div>`,
      text: `Nuova dedica per Giuseppe & Letizia\n\nDa: ${nome}\n\nMessaggio:\n${messaggio}\n\n--\nInviato dal sito save-the-date.`,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      res.status(500).json({ success: false, error: 'Invio non riuscito' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ success: false, error: 'Errore server' });
  }
}
