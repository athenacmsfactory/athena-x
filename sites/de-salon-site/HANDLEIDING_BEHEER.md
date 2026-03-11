# 📘 Handleiding: de-salon-site

**Type Website:** de-salon-type
**Status:** Live & Beheerbaar via Google Sheets

---

## 1. Snelstart: Een wijziging publiceren
Uw website is gekoppeld aan een Google Sheet. Alles wat u daar aanpast, komt op de site.

1.  **Aanpassen:** Doe uw wijzigingen in de Google Sheet (teksten, prijzen, etc.).
2.  **Opslaan:** Google slaat dit automatisch op.
3.  **Publiceren:** Klik in het menu bovenaan op **🚀 Athena CMS** > **Website Live Zetten**.
4.  **Klaar:** Wacht ongeveer 2 minuten. Ververs uw website om het resultaat te zien.

> **Tip:** Wilt u een nieuwe regel beginnen binnen één cel? Gebruik **Alt + Enter**.

---

## 2. De Inhoud beheren
De tabbladen onderaan uw Google Sheet bepalen de structuur van uw website. Hieronder vindt u een overzicht van alle beschikbare tabbladen en de betekenis van elke kolom.

### Tabblad: `basisgegevens`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `bedrijfsnaam` | De officiële naam van de zaak ('De Salon'). |
| `missie_kern` | De korte kern van de missie ('We care about your hair'). |
| `missie_uitgebreid` | Het combineren van schoonheid, milieubewustheid en welzijn. |
| `telefoonnummer` | Het algemene telefoonnummer voor contact en afspraken. |
| `copyright_tekst` | De copyright vermelding (incl. jaar). |
| `privacy_beleid_link` | Link naar de Privacybeleid pagina. |
| `cookies_beleid_link` | Link naar de Cookies pagina. |

### Tabblad: `locaties`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `locatie_id` | Primaire sleutel van de locatie. |
| `naam_locatie` | Gebruikelijke naam van de locatie (e.g., Hoofdvestiging Gent). |
| `straat_nummer` | Adres: Dok Zuid 3. |
| `postcode` | Postcode: 9000. |
| `stad` | Stad: Gent. |
| `ligging_omschrijving` | Beschrijving van de ligging (Dampoort, dokken, centrum Gent). |
| `parking_info` | Informatie over parkeermogelijkheden. |

### Tabblad: `stylist_gradatie`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `gradatie_id` | Primaire sleutel, unieke identificatie van de gradatie (e.g., 1, 2, 3). |
| `titel` | De titel van de stylist (Junior stylist, Stylist, Senior Stylist, Director). |
| `min_ervaring_jaren` | Minimum aantal jaren ervaring voor deze gradatie. |
| `omschrijving_criteria` | Gedetailleerde uitleg over de criteria (cursussen, werkzaam bij ons). |

### Tabblad: `teamleden`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `teamlid_id` | Primaire sleutel van het teamlid. |
| `naam` | De naam van het teamlid (Jan, Pascal, Lies & Freddy). |
| `functie` | De rol binnen het bedrijf (Zaakvoerder, Haarstyliste, Oprichters). |
| `gradatie_id` | Optionele Vreemde Sleutel naar de 'stylist_gradatie' tabel (indien van toepassing). |
| `foto_url` | URL van de profielfoto. |
| `bio_tekst` | Korte persoonlijke beschrijving (niet aanwezig in tekst, maar logisch). |

### Tabblad: `diensten_hoofdgroepen`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `groep_id` | Primaire sleutel voor de dienstengroep (e.g., Kapsalon Dames, Kleuringen, Behandelingen). |
| `naam` | De naam van de dienstengroep. |
| `volgorde` | Volgorde waarin de groep op de prijzenpagina verschijnt. |

### Tabblad: `diensten_tarieven`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `tarief_id` | Primaire sleutel van het specifieke tarief. |
| `groep_id` | Vreemde Sleutel naar de 'diensten_hoofdgroepen' tabel. |
| `dienst_naam` | De naam van de specifieke dienst (e.g., Wassen, snit en handdrogen). |
| `basis_prijs` | De start- of vaste prijs van de dienst (numeriek, e.g., 60.00). |
| `prijs_indicatie` | Tekstuele indicatie van de prijs (Vanaf, Per 10 min, Leeg). |
| `gradatie_afhankelijk` | Boolean: Geeft aan of de prijs varieert per stylist gradatie (True/False). |
| `is_behandeling` | Boolean: Geeft aan of het een therapeutische/schoonheidsbehandeling is (e.g., botanical therapy). |

### Tabblad: `testimonials`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `testimonial_id` | Primaire sleutel van de review. |
| `klant_naam` | De naam van de tevreden klant (Janne, Stijn, Joke, Vicky). |
| `gebruikte_service` | De dienst waarvoor de klant kwam (haarkleuring, haarstyling). |
| `beoordeling_tekst` | De volledige review tekst. |
| `datum_review` | Datum van de review (indien beschikbaar). |
| `is_actief` | Boolean om te bepalen of de review op de site getoond wordt. |

### Tabblad: `aveda_informatie`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `info_id` | Primaire sleutel voor de informatie sectie. |
| `titel` | De sectietitel (e.g., Aveda, Ayurveda). |
| `hoofdtekst_nl` | Gedetailleerde tekst over de filosofie en producten van Aveda. |
| `focus_punten` | Belangrijke kernwaarden (fair trade, groen denken, well-being). |

### Tabblad: `social_media`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `social_id` | Primaire sleutel. |
| `naam` | Naam van het platform (fa=Facebook, in=Instagram). |
| `icoon_klasse` | De font-awesome of andere klasse voor het icoon. |
| `url` | De link naar het social media profiel. |

### Tabblad: `paginastructuur`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `pagina_id` | Primaire sleutel. |
| `titel_navigatie` | De titel zoals getoond in het menu (Home, Prijzen, Afspraak). |
| `slug` | De URL-vriendelijke naam van de pagina (home, prijzen). |
| `menu_positie` | Volgorde in de hoofdnavigatie. |
| `is_call_to_action` | Boolean: geeft aan of dit een CTA-knop is (Afspraak). |



---

## 3. 🎨 Vormgeving & Huisstijl (Theme Engine)
U kunt het uiterlijk van uw site zelf aanpassen zonder technische kosten. Ga naar het tabblad **Basisgegevens**.

Zoek (of maak) regels met de namen in onderstaande tabel. De namen in de eerste kolom moeten **exact** zo geschreven worden.

| Naam (Kolom 1) | Waarde Voorbeeld (Kolom 2) | Effect op de site |
| :--- | :--- | :--- |
| `eerste_kleur` | `#3b82f6` | De hoofdkleur (knoppen, iconen, accenten). |
| `tweede_kleur` | `#0f172a` | De donkere steunkleur (vaak donkerblauw of zwart). |
| `achtergrond_kleur`| `#ffffff` | De achtergrondkleur van de pagina. |
| `tekst_kleur` | `#333333` | De kleur van de gewone leesbare tekst. |
| `font_koptekst` | `Playfair Display` | Lettertype voor grote titels (Kies uit Google Fonts). |
| `font_broodtekst` | `Lato` | Lettertype voor de broodtekst. |
| `afronding` | `0.5rem` | Ronding van knoppen/blokken (`0rem` = vierkant, `2rem` = rond). |
| `footer_tekst` | `© 2025 Mijn Bedrijf` | De tekst helemaal onderaan de pagina. |

**Hoe vind ik een kleurcode?**
Zoek op Google naar "Color Picker". Kies een kleur en kopieer de HEX-code (het begint met een `#`, bijvoorbeeld `#FF5733`).

---

## 4. Afbeeldingen Beheren (Nieuw!)
Met de nieuwe **Athena Media Manager** is het beheren van afbeeldingen een stuk eenvoudiger geworden.

1.  **Open de Media Manager:** Klik in het menu op **🚀 Athena CMS** > **📸 Afbeeldingen Manager**.
2.  **Uploaden:** Sleep uw foto's in het venster. Ze worden automatisch veilig opgeslagen.
3.  **Gebruiken:** Kopieer de bestandsnaam (bijvoorbeeld `nieuwe-taart.jpg`) en plak deze in de kolom `afbeelding` of `foto` in uw tabblad.

> **Let op:** U hoeft **geen** ingewikkelde links meer te gebruiken. Alleen de bestandsnaam (bv. `header.jpg`) is voldoende. Het systeem zoekt zelf de juiste afbeelding.

*   **Iconen:** U kunt in de kolom 'Icoon' gewoon een Emoji plakken (✂️, 🥐, 💻) of een woord typen dat past bij uw dienst.

---

*Gegenereerd door Athena Factory v6.0*
