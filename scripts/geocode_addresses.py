#!/usr/bin/env python3
"""
Geokodiert die Adressen aus data/real/charging_stations_real.json und
data/real/pois_real.json über die Nominatim-API (OpenStreetMap) und
schreibt die Koordinaten zurück. Erfordert Internetzugang.

Nutzung:
    pip install requests
    python3 scripts/geocode_addresses.py

Hinweise:
- Nominatim Nutzungsbedingungen: max. 1 Anfrage/Sekunde, eigener User-Agent,
  keine Massenabfragen ohne eigenen Server. https://operations.osmfoundation.org/policies/nominatim/
- Adressen ohne Treffer bleiben mit latitude/longitude = null stehen und
  werden in der Konsole aufgelistet (manuell prüfen, keine Schätzung).
"""

import json
import time
import requests

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
HEADERS = {"User-Agent": "SpielendLaden-Geocoder/1.0 (Kontakt: projekt-spielend-laden@example.invalid)"}


def geocode(address, postcode, town, country="Deutschland"):
    query = ", ".join(filter(None, [address, f"{postcode} {town}".strip(), country]))
    params = {"q": query, "format": "json", "limit": 1, "countrycodes": "de"}
    resp = requests.get(NOMINATIM_URL, params=params, headers=HEADERS, timeout=30)
    time.sleep(1.1)  # Nominatim Policy: max. 1 req/s
    if resp.status_code == 200 and resp.json():
        r = resp.json()[0]
        return float(r["lat"]), float(r["lon"])
    return None, None


def process(path):
    with open(path, encoding="utf-8") as f:
        records = json.load(f)

    not_found = []
    for r in records:
        if r.get("latitude") is not None:
            continue
        lat, lon = geocode(r.get("address"), r.get("postcode"), r.get("town"))
        r["latitude"] = lat
        r["longitude"] = lon
        r["geocoding_pending"] = lat is None
        if lat is None:
            not_found.append(r.get("name") or r.get("poi_id") or r.get("charging_station_id"))
        print(f"{r.get('name')}: {lat}, {lon}")

    with open(path, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    if not_found:
        print("\nOHNE TREFFER (manuell prüfen, keine Koordinaten geschätzt):")
        for n in not_found:
            print(f"  - {n}")


if __name__ == "__main__":
    process("data/real/charging_stations_real.json")
    process("data/real/pois_real.json")
