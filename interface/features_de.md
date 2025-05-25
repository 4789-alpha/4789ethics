# Interface-Funktionen ohne Appbezug

Diese Datei fasst zentrale Funktionen der geplanten Benutzeroberfläche für **4789ethics** zusammen. Sie steht unabhängig von einer bestimmten App und konzentriert sich auf die Interaktion im Browser.

## 1. Vollbild-Module mit vertikalem Scrollen

Ein Inhaltsbereich wird bildschirmfüllend dargestellt. Durch vertikales Scrollen gelangen Nutzer zu weiteren Abschnitten.

- Jedes Modul ist ein `div` oder `section` mit `100vh` Höhe.
- Optional kann per JavaScript ein "Snap" zum nächsten Modul auslöst werden.
- Mögliche Inhalte: Texte, Animationen oder Audio.

```html
<div class="module-feed">
  <section class="module">Inhalt A</section>
  <section class="module">Inhalt B</section>
  <section class="module">Inhalt C</section>
</div>
```

## 2. Entscheidungs-Karten mit Swipe

Karten mit Aussagen oder Situationen lassen sich nach links oder rechts wischen. Dies entspricht einer Ablehnung bzw. Zustimmung.

- Die Karte reagiert auf Drag-Events.
- Die getroffene Wahl wird per JavaScript gespeichert.
- Alternativ können Buttons für "Ja" und "Nein" ergänzt werden.

```html
<div class="swipe-card">
  <p>"Ein KI-Agent darf heimlich zuhören."</p>
  <button onclick="swipeLeft()">Ablehnen</button>
  <button onclick="swipeRight()">Zustimmen</button>
</div>
```

## 3. Horizontale Navigation

Am unteren Rand befindet sich eine fixierte Icon-Leiste. Ein Klick wechselt den Hauptbereich zu einem anderen Inhalt.

- Umsetzung per CSS-Flexbox.
- JavaScript zeigt den entsprechenden Abschnitt an.
- Icons können als SVG oder Webfont eingebunden werden.

```html
<nav class="bottom-bar">
  <button onclick="showHome()">Home</button>
  <button onclick="showModules()">Module</button>
  <button onclick="showSignature()">Signatur</button>
  <button onclick="showSettings()">Einstellungen</button>
</nav>
```

## 4. Menüs nach OP-Level freischalten

Abhängig vom `op_level` einer Nutzerin werden Menüpunkte eingeblendet oder ausgeblendet.

```javascript
const user = { op_level: 6 };
if (user.op_level >= 5) {
  document.getElementById("menu-signatur").style.display = "block";
}
```

## 5. Fortschrittsanzeige

Ein schmaler Balken zeigt den aktuellen Fortschritt an, z.B. beim Ethiktest oder beim Erreichen eines OP-Levels.

```html
<div class="progress-bar">
  <div class="progress-fill" style="width: 40%"></div>
</div>
```

## 6. Schnellzugriff über Gesten oder Buttons

Ein Wischen vom oberen Rand oder ein Symbol oben rechts blendet ein Overlay mit Einstellungen ein.

- Overlay per `position: fixed`.
- Sichtbarkeit wird per JavaScript gesteuert.

---

Diese Funktionsbeschreibung dient als technische Orientierung für die Interface-Umsetzung. Sie soll kürzliche Entscheidungen dokumentieren und kann bei Bedarf erweitert werden.
