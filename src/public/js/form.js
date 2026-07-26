// Log the scan as soon as the page loads (this is what the QR code hits)
fetch('/api/flowcode/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ referrer: document.referrer }),
}).catch((err) => console.error('Scan log failed:', err));

const form = document.getElementById('applicant-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('/api/applicants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Submission failed');

    status.textContent = 'Thank you — we will be in touch.';
    form.reset();
  } catch (err) {
    status.textContent = 'Something went wrong. Please try again.';
    console.error(err);
  }
});
