# Quellen – Recherchierte Realdaten (Herzogenaurach / Höchstadt a.d.Aisch)

Abrufzeitpunkt dieser Recherche: 2026-09-17T20:00:00Z

## Warum diese Daten anders erhoben wurden

Die Open Charge Map API und die Overpass API (OpenStreetMap) sind aus der
Ausführungsumgebung dieses Assistenten nicht direkt erreichbar (kein
Internetzugriff auf reine JSON-API-Endpunkte). Getestet wurden u.a.:
`api.openchargemap.io/v3/poi`, `overpass-api.de/api/interpreter`,
`overpass.kumi.systems/api/interpreter` — alle nicht erreichbar, während
normale HTML-Webseiten (z.B. goingelectric.de) abrufbar sind.

Deshalb wurden reale Ladepunkte und POIs stattdessen über öffentlich
zugängliche, browserlesbare Webseiten recherchiert (Aggregatoren und
offizielle Stadt-/Betreiberseiten). Jeder Datensatz trägt `source` und
`source_url` zur Nachvollziehbarkeit.

## Bekannte Einschränkung: fehlende Koordinaten

Diese Webseiten liefern in der Regel nur Adressen (kein maschinenlesbares
Lat/Lon in den geladenen Textinhalten, da Kartenpositionen oft per
JavaScript/Kartendienst nachgeladen werden). Nach der Projektregel
"keine Daten erfinden" wurden **keine Koordinaten geschätzt**.
`latitude`/`longitude` stehen auf `null`, `geocoding_pending: true`.

Das Skript `scripts/geocode_addresses.py` ergänzt die Koordinaten lokal
über die Nominatim-API (OpenStreetMap), sofern eine Internetverbindung
besteht. Es überschreibt nur Einträge ohne vorhandene Koordinaten.

## Erfasste Ladepunkte (charging_stations_real.json)

| Name | Adresse | Quelle |
|---|---|---|
| Herzo Base | Münchener Straße 19, 91074 Herzogenaurach | GoingElectric.de #44764 |
| Sportplatz am Gymnasium (Parkplatz) | Beethovenstraße, 91074 Herzogenaurach | GoingElectric.de #68462 |
| Hotel HerzogsPark | Beethoven Straße 6, 91074 Herzogenaurach | GoingElectric.de #72358 |
| bayernwerk e-mobil Ladestation Stadt Höchstadt | B470 7, 91315 Höchstadt a.d.Aisch | Electromaps.com |
| REWE Höchstadt an der Aisch | Kieferndorfer Weg 58C, 91315 Höchstadt a.d.Aisch | Electromaps.com |
| Höchstadt a.d. Aisch, Parkplatz Engelgarten | In der Brannerstatt 2, 91315 Höchstadt a.d.Aisch | LadeGuru.de |
| Kaufland Höchstadt | Rothenburger Straße 19, 91315 Höchstadt a.d.Aisch | Electromaps/Wallbox |

## Erfasste POIs (pois_real.json)

| Name | Kategorie | Adresse | Quelle |
|---|---|---|---|
| Abenteuerspielplatz 360° | Spielplatz | Berliner Straße 36, Herzogenaurach | Spielplatznet.de |
| Spielplatz Schwester-Ennodia-Weg | Spielplatz | Schwester-Ennodia-Weg, Herzogenaurach | Bambinimaps.com |
| Spielplatz Hammerbach | Spielplatz | Ecke Blumenstraße/Rosenstraße, Herzogenaurach | Stadt Herzogenaurach (offiziell) |
| Spielplatz Haydnstraße | Spielplatz | Haydnstraße, Herzogenaurach | Stadt Herzogenaurach (offiziell) |
| el Castagno – Zum Kastanienbaum | Biergarten | Bamberger Str. 2, Herzogenaurach | Biergartenfreunde.de |
| Restaurant Ignatz – Biergarten an der Stadtmauer | Biergarten | Marktplatz, Herzogenaurach | ignatz-herzo.de (offiziell) |
| Brauerei Hans Heller | Biergarten | Hauptstraße 33, Herzogenaurach | Bierland-Franken.de |
| Landgasthof Bär | Restaurant | Burgstall 29, Herzogenaurach | landgasthofbaer.de (offiziell) |

## Bekannte Lücken

- Die Recherche deckt nur Herzogenaurach und Höchstadt a.d.Aisch ab, nicht den
  gesamten Landkreis. Für eine Vollabdeckung ist der OCM-/Overpass-Abruf
  (siehe `spielend_laden_testdaten_erh.py`) mit echtem Internetzugriff nötig.
- Kategorien Café, Einkauf, WC, Park, Freizeit sind in dieser Teil-Recherche
  noch nicht abgedeckt.
- Leistungswerte/Anschlusszahlen bei Aggregator-Quellen (Electromaps,
  LadeGuru) teils unvollständig — als `null` belassen statt geschätzt.
- Zwei Höchstadt-Einträge (REWE / Aisch-Park-Center) könnten dieselbe
  Örtlichkeit beschreiben; vor dem produktiven Import gegen Duplikate prüfen
  (Regel: ≤20 m + gleiche Adresse/Betreiber).
