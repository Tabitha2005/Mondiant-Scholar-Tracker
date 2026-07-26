async function loadSummary() {
  const res = await fetch('/api/dashboard/summary');
  const data = await res.json();

  document.getElementById('total-scans').textContent = data.totalScans;
  document.getElementById('total-applicants').textContent = data.totalApplicants;
  document.getElementById('completion-rate').textContent = `${data.completionRate}%`;

  renderBarChart('scans-chart', data.scansByDay.map((d) => ({ label: d._id, value: d.count })));
  renderBarChart(
    'region-chart',
    data.applicantsByRegion.map((r) => ({ label: r._id || 'Unspecified', value: r.count }))
  );
}

function renderBarChart(containerId, points) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (points.length === 0) {
    container.innerHTML = '<p style="color:#999">No data yet.</p>';
    return;
  }

  const max = Math.max(...points.map((p) => p.value), 1);

  points.forEach((p) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(p.value / max) * 160}px`;
    bar.innerHTML = `<span class="bar-value">${p.value}</span><span class="bar-label">${p.label}</span>`;
    container.appendChild(bar);
  });
}

loadSummary();
setInterval(loadSummary, 5000); // live refresh during the demo
