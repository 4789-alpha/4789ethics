# BSVRB Dart

Live-Beta unter https://bsvrb.ch/dart/ mit lokalen Partien, privaten PeerJS-WebRTC-Räumen, synchroner Wertung, Boardvideos, experimenteller bestätigter Bildanalyse, Radius-/Ringvorschlag und Browser-Punkteansagen.

Bedienung, Netzwerkvoraussetzungen, Tests und Grenzen: [konzept.md](konzept.md).

Prüfung: `node test/dart.test.js` und `node test/dart-vision.test.js`.

PeerJS 1.5.5 liegt mit MIT-Lizenz in `vendor/`. Kein eigener TURN-Dienst ist bereitgestellt; bei eingeschränkten Netzwerken einen vorhandenen Relayserver konfigurieren. Die Erkennung verwendet Bildvergleich und geometrische Hypothesen, kein trainiertes Dartmodell; jeden Dart prüfen und bestätigen.
