# Projekt: spielend-laden

E-Auto-Ladepunkte kombiniert mit nahen POIs (Spielplatz, Biergarten, …) im Landkreis Erlangen-Höchstadt.

## Stack
- Reines HTML/CSS/JS, Leaflet per CDN; kein Build-Schritt
- Python-Skript für Geocoding (Nominatim), Deployment via GitHub Pages (Branch `main`, Root)

## Wichtige Befehle
- Lokal testen: `python3 -m http.server 8000` (Repo-Root)
- Geocoding: `scripts/geocode_addresses.py` (venv `.venv`, gitignored; siehe Memory `debian-sandbox-setup`)

## Regeln
- Keine Koordinaten raten: fehlende Treffer bleiben `latitude/longitude: null`, `geocoding_pending: true`.
- Nominatim braucht eine echte Kontakt-Mail im User-Agent.
- Push nur per SSH (`git@github.com:bendes-ai/spielend-laden.git`).

## Architektur
- `index.html`, `app.js`, `style.css`: Karte, Filter, Liste
- `data/real/`: echte Daten (aktiv); `data/*.json`: Demo-Daten (nicht mehr genutzt)
- `data/real/sources_real.md`: Quellen
- `app.js` filtert Einträge mit null-Koordinaten heraus

## Offene Punkte
- 5 Adressen ohne Koordinaten (Engelgarten Höchstadt, bayernwerk-Ladestation, Spielplätze Hammerbach/Haydnstraße, Restaurant Ignatz)
