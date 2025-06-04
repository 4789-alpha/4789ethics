(function(){
  async function biometricLogin() {
    const statusEl = document.getElementById('login_status');
    if (!window.PublicKeyCredential) {
      if (statusEl) statusEl.textContent = 'Biometric login not supported.';
      return;
    }
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required'
        }
      });
      if (statusEl) statusEl.textContent = 'Biometric check successful.';
    } catch (e) {
      if (statusEl) statusEl.textContent = 'Biometric check failed. Please try again.';
    }
  }
  window.biometricLogin = biometricLogin;
})();
