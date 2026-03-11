# 📘 Handleiding: dirk-de-witte-kappers

**Type Website:** kapper
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
| `bedrijfsnaam` | De officiële naam van de herenkapper/barbierzaak. |
| `adres` | Het volledige fysieke adres van de locatie. |
| `telefoonnummer` | Het algemene telefoonnummer voor contact en afspraken. |
| `emailadres` | Het algemene e-mailadres voor vragen. |
| `openingstijden_info` | Een korte samenvatting van de openingstijden (bijv. Di t/m Za 10:00 - 18:00). |
| `boekings_url` | De directe link naar het online boekingssysteem voor afspraken. |

### Tabblad: `diensten`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `dienst_id` | Unieke identificatiecode voor de dienst. |
| `naam` | De naam van de behandeling (bv. 'Strakke Fade', 'Klassieke Snit', 'Luxe Baardverzorging'). |
| `beschrijving` | Een gedetailleerde omschrijving van wat de klant kan verwachten bij deze behandeling. |
| `categorie` | Het type dienst (bv. Kapsel, Baard, Combinatie, Scheren). |
| `duur_minuten` | De verwachte duur van de behandeling in minuten. |
| `prijs` | De prijs van deze behandeling in euro's. |
| `populair` | Geeft aan of dit een veelgevraagde dienst is (Ja/Nee). |

### Tabblad: `team`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `barbier_id` | Unieke identificatiecode voor de teamlid. |
| `naam` | De volledige naam van de barbier. |
| `specialisatie` | De primaire expertise of specialiteit van deze barbier (bv. Klassieke snitten, Fades, Baard contouren). |
| `korte_bio` | Een korte introductie over de ervaring en passie van de barbier. |
| `profielfoto_url` | De link naar een professionele foto van de barbier. |
| `directe_boekingslink` | De directe link om een afspraak te maken bij deze specifieke barbier. |

### Tabblad: `producten`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `product_id` | Unieke identificatiecode voor het product. |
| `product_naam` | De officiële naam van het styling- of verzorgingsproduct. |
| `merk` | Het merk van het product (bv. 'Eigen Lijn' of externe leverancier). |
| `omschrijving` | Een gedetailleerde uitleg over het product, ingrediënten en de werking. |
| `prijs` | De verkoopprijs in euro's. |
| `type_product` | De categorie van het product (bv. Pommade, Baardolie, Wax, Scheercrème). |
| `afbeelding_url` | De link naar de productafbeelding. |



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

## 4. Afbeeldingen en Iconen
*   **Foto's:** Plak altijd een **directe link** naar een afbeelding (eindigend op `.jpg`, `.png` of `.webp`).
*   **Iconen:** U kunt in de kolom 'Icoon' gewoon een Emoji plakken (✂️, 🥐, 💻) of een woord typen dat past bij uw dienst.

---

*Gegenereerd door Athena Factory v6.0*
