let currentDonation = null;

function loadDonation() {
  try {
    const saved = localStorage.getItem('pending_donation');
    if (saved) currentDonation = JSON.parse(saved);
  } catch (err) {
    currentDonation = null;
  }
}

function updateView() {
  const output = document.getElementById('donation_output');
  if (output) output.textContent = currentDonation ? JSON.stringify(currentDonation, null, 2) : '';

  const review = document.getElementById('review_section');
  if (!review) return;

  if (!currentDonation || currentDonation.status !== 'pending') {
    review.style.display = 'none';
    return;
  }

  const current = typeof getStoredOpLevel === 'function' ? getStoredOpLevel() : null;
  const levelNum = typeof opLevelToNumber === 'function' ? opLevelToNumber(current) : 0;
  const isDonor = current && currentDonation.donorLevel && current === currentDonation.donorLevel;

  review.style.display = levelNum >= 9 && !isDonor ? 'block' : 'none';
}

function initDonation() {
  loadDonation();
  const donateBtn = document.getElementById('donate_btn');
  if (donateBtn) donateBtn.addEventListener('click', handleDonate);
  const approve = document.getElementById('approve_btn');
  if (approve) approve.addEventListener('click', approveDonation);
  const reject = document.getElementById('reject_btn');
  if (reject) reject.addEventListener('click', rejectDonation);
  updateView();
}

function handleDonate() {
  const amountInput = document.getElementById('donation_amount');
  const amount = parseFloat(amountInput.value);
  if (!amount || amount <= 0) {
    alert('Bitte gültigen Betrag eingeben.');
    return;
  }
  const donorLevel = typeof getStoredOpLevel === 'function' ? getStoredOpLevel() : 'OP-0';
  currentDonation = {
    amount,
    currency: 'CHF',
    status: 'pending',
    donorLevel
  };
  localStorage.setItem('pending_donation', JSON.stringify(currentDonation));
  updateView();
}

function approveDonation() {
  if (!currentDonation) return;
  currentDonation.status = 'accepted';
  currentDonation.verifiedBy = typeof getStoredOpLevel === 'function' ? getStoredOpLevel() : 'unknown';
  localStorage.setItem('pending_donation', JSON.stringify(currentDonation));
  updateView();
}

function rejectDonation() {
  if (!currentDonation) return;
  currentDonation.status = 'redirected';
  currentDonation.verifiedBy = typeof getStoredOpLevel === 'function' ? getStoredOpLevel() : 'unknown';
  localStorage.setItem('pending_donation', JSON.stringify(currentDonation));
  updateView();
}

if (typeof window !== 'undefined') {
  window.initDonation = initDonation;
  window.handleDonate = handleDonate;
  window.approveDonation = approveDonation;
  window.rejectDonation = rejectDonation;
}
