const API_BASE = window.location.origin;                    //Sets API base URL to current origin 
let currentShortId = null;

// ----- Shorten URL -----------------------------------------------------------
async function shortenUrl() {
  const input = document.getElementById('url-input');
  const btn = document.getElementById('shorten-btn');
  const errorMsg = document.getElementById('error-msg');
  const resultBox = document.getElementById('result-box');
  const resultLink = document.getElementById('result-link');

  const url = input.value.trim();
  errorMsg.textContent = '';                    //Clears previous error message

  // Basic validation
  if (!url) {
    errorMsg.textContent = '⚠️ Please enter a URL.';
    return;
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    errorMsg.textContent = '⚠️ URL must start with http:// or https://';
    return;
  }

  // Loading state
  btn.classList.add('loading');
  btn.querySelector('.btn-text').textContent = 'Shortening...';
  btn.disabled = true;
  resultBox.classList.remove('show');

  try {
    const res = await fetch(`${API_BASE}/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = `⚠️ ${data.error || 'Something went wrong.'}`;
      return;
    }

    currentShortId = data.id;
    const shortUrl = `${API_BASE}/${data.id}`;

    resultLink.textContent = shortUrl;
    resultLink.href = shortUrl;
    resultBox.classList.add('show');

    // Reset copy button
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      Copy
    `;
    copyBtn.classList.remove('copied');

  } catch (err) {
    errorMsg.textContent = '⚠️ Could not connect to server. Please try again.';
  } finally {
    btn.classList.remove('loading');
    btn.querySelector('.btn-text').textContent = 'Shorten';
    btn.disabled = false;
  }
}

// ----- Copy Link -----------------------------------------------------------
async function copyLink() {
  const link = document.getElementById('result-link').textContent;
  const btn = document.getElementById('copy-btn');

  try {
    await navigator.clipboard.writeText(link);
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      Copied!
    `;
    btn.classList.add('copied');

    setTimeout(() => {
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Copy
      `;
      btn.classList.remove('copied');
    }, 2500);
  } catch {
    alert('Could not copy. Please copy manually: ' + link);
  }
}

// ----- View Analytics -----------------------------------------------------------
async function viewAnalytics() {
  if (!currentShortId) return;

  const overlay = document.getElementById('modal-overlay');
  const totalClicks = document.getElementById('total-clicks');
  const visitsList = document.getElementById('visits-list');
  const modalShortId = document.getElementById('modal-short-id');

  modalShortId.textContent = `${window.location.host}/${currentShortId}`;
  totalClicks.textContent = '...';
  visitsList.innerHTML = '<div class="no-visits">Loading...</div>';
  overlay.classList.add('show');

  try {
    const res = await fetch(`${API_BASE}/url/analytics/${currentShortId}`);
    const data = await res.json();

    if (!res.ok) {
      visitsList.innerHTML = `<div class="no-visits">${data.error || 'Failed to load analytics.'}</div>`;
      return;
    }

    totalClicks.textContent = data.totalClicks;

    if (!data.analytics || data.analytics.length === 0) {
      visitsList.innerHTML = '<div class="no-visits">No visits yet. Share your link to get started! 🚀</div>';
      return;
    }

    // Sort newest first
    const sorted = [...data.analytics].sort((a, b) => b.timestamp - a.timestamp);

    visitsList.innerHTML = sorted.map((visit, i) => {
      const date = new Date(visit.timestamp);
      const formatted = date.toLocaleString();
      const ago = timeAgo(visit.timestamp);
      return `
        <div class="visit-item">
          <div class="visit-dot"></div>
          <span class="visit-time">${formatted}</span>
          <span class="visit-ago">${ago}</span>
        </div>
      `;
    }).join('');

  } catch {
    visitsList.innerHTML = '<div class="no-visits">⚠️ Could not reach server.</div>';
  }
}

// ----- Close Modal -----------------------------------------------------------
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

// ----- Helper: Time Ago -----------------------------------------------------------
function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ----- Enter key support -----------------------------------------------------------
document.getElementById('url-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') shortenUrl();
});

// ----- Escape key closes modal -----------------------------------------------------------
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
