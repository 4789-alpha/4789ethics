(() => {
  const allowed = new Set(['www.youtube-nocookie.com', 'open.spotify.com', 'embed.music.apple.com']);
  document.querySelectorAll('[data-music-src]').forEach(button => {
    button.addEventListener('click', () => {
      const album = button.closest('.album');
      const player = album.querySelector('.music-player');
      if (button.getAttribute('aria-pressed') === 'true') return;
      const url = new URL(button.dataset.musicSrc);
      if (url.protocol !== 'https:' || !allowed.has(url.hostname)) return;
      // Stop other albums before replacing the active embedded player.
      document.querySelectorAll('.music-player iframe').forEach(frame => {
        const owner = frame.closest('.album');
        owner.querySelectorAll('[data-music-src]').forEach(b => b.setAttribute('aria-pressed', 'false'));
        const message = document.createElement('p');
        message.textContent = 'Wähle eine Plattform, um dieses Album zu laden.';
        frame.parentElement.replaceChildren(message);
        owner.querySelector('.music-feedback').textContent = '';
      });
      album.querySelectorAll('[data-music-src]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      const frame = document.createElement('iframe');
      frame.title = `${album.querySelector('h2').textContent} von EREL – ${button.dataset.provider}`;
      frame.src = url.href;
      frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      frame.allowFullscreen = true;
      player.dataset.provider = button.dataset.provider;
      player.replaceChildren(frame);
      album.querySelector('.music-feedback').textContent = `${button.dataset.provider}-Player geöffnet. Falls die Wiedergabe hier nicht verfügbar ist, öffne das Album über «In der Musik-App öffnen».`;
    });
  });
})();
