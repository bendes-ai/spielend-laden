# Spielend laden

MVP-Webanwendung: E-Auto-Ladepunkte kombiniert mit nahen Points of Interest
(Spielplatz, Biergarten, Restaurant, Café, Einkaufen, WC, Park, Freizeit)
im Landkreis Erlangen-Höchstadt.

## Status

Dies ist ein **MVP mit Beispieldaten (Demo)**. Die Dateien unter `data/`
enthalten fiktive, aber realistisch platzierte Beispiel-Ladepunkte und
-POIs im Landkreis Erlangen-Höchstadt. Es sind **keine Live-Daten** von
Open Charge Map oder OpenStreetMap.

Die Methodik zur Erzeugung echter Produktionsdaten (Overpass-Abfragen,
OCM-Anbindung, Distanzberechnung, Deduplizierung) ist im separat
bereitgestellten Testdaten-Skript und den zugehörigen `sources_and_methodology.md` /
`data_dictionary.md` Dateien dokumentiert und kann die Demo-JSONs unter
`data/` 1:1 ersetzen (gleiches Feldschema).

## Live-Demo (GitHub Pages)

1. Repository-Einstellungen öffnen: **Settings → Pages**
2. Unter „Build and deployment“ → Source: **Deploy from a branch**
3. Branch: `main`, Ordner: `/ (root)` auswählen, speichern
4. Nach 1–2 Minuten ist die Seite erreichbar unter:
   `https://<dein-github-username>.github.io/spielend-laden/`

## Lokal testen

Kein Build-Schritt nötig (reines HTML/CSS/JS + Leaflet via CDN).

```bash
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Struktur

```
index.html          Hauptseite mit Karte, Filtern und Ladepunkt-Liste
style.css            Styling
app.js               Lädt data/*.json, berechnet Distanzen (Haversine), rendert Karte + Liste
data/charging_stations.json   Beispiel-Ladepunkte (Demo)
data/pois.json                Beispiel-POIs (Demo)
```

## Datenschema

Felder folgen dem im Projekt "Spielend laden" hinterlegten Schema
(`data_dictionary.md` aus dem Testdaten-Skript): `charging_station_id`,
`name`, `operator`, `address`, `postcode`, `town`, `latitude`, `longitude`,
`status`, `num_connections`, `max_power_kw`, `connector_types`, `is_24_7`,
`access_usage_type` für Ladepunkte sowie `poi_id`, `category`, `subcategory`,
`name`, `town`, `latitude`, `longitude`, `osm_tags_json` für POIs.

## Nächste Schritte

- Demo-JSONs unter `data/` durch echte Ergebnisse aus dem OCM-/Overpass-
  Abrufskript ersetzen.
- Radius-Auswahl (aktuell 100–1000 m Slider) ist bereits frei wählbar,
  wie im MVP gefordert.
- Backend/PostGIS-Anbindung für größere Datenmengen statt statischer JSONs.
