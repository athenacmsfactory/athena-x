# 📘 Handleiding: chocolade-shop

**Type Website:** webshop-order
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
| `config_id` | Primaire sleutel. |
| `site_naam` | De naam van de webshop. |
| `hero_header` | De hoofdtekst van de hero sectie. |
| `order_email` | Het e-mailadres waar bestellingen naar verzonden worden. |
| `valuta_code` | Standaard valuta (EURO). |

### Tabblad: `categorieen`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `categorie_id` | Primaire sleutel. Unieke identificatie van de categorie. |
| `naam` | Naam van de categorie (Laptop, Desktop, Monitor, Componenten, Kabels). |
| `slug` | SEO-vriendelijke URL slug voor de categorie. |

### Tabblad: `producten`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `product_id` | Primaire sleutel. |
| `naam` | De naam van het product. |
| `categorie_id` | Vreemde sleutel naar de categorieën tabel (Laptop, Kabels, etc.). |
| `prijs` | De prijs van het product in euro's. |
| `korte_beschrijving` | Korte samenvatting voor overzichtspagina's. |
| `uitgebreide_beschrijving` | Volledige productbeschrijving. |
| `product_foto_url` | URL of pad naar de primaire productafbeelding. |

### Tabblad: `product_specificaties`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `specificatie_id` | Primaire sleutel. |
| `product_id` | Vreemde sleutel naar het product waartoe deze specificatie behoort. |
| `specificatie_naam` | Naam van de specificatie (bijv. 'CPU', 'RAM', 'Schermgrootte'). |
| `waarde` | De waarde van de specificatie (bijv. 'Intel i9', '32GB DDR5'). |

### Tabblad: `klantbeoordelingen`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `beoordeling_id` | Primaire sleutel. |
| `product_id` | Vreemde sleutel naar het beoordeelde product (optioneel, kan ook site-breed zijn). |
| `klant_naam` | De naam van de klant die de beoordeling heeft achtergelaten. |
| `score_sterren` | De gegeven score (integer, 1 tot 5 sterren). |
| `ervaring_tekst` | De geschreven recensie/ervaring van de klant. |
| `datum_geplaatst` | Datum waarop de beoordeling is ingediend. |

### Tabblad: `sterke_punten`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `punt_id` | Primaire sleutel. |
| `titel` | De sterke punt beschrijving (bijv. 'Snel geleverd', '2 jaar garantie', 'Deskundig advies'). |
| `icoon_naam` | Verwijzing naar het te gebruiken icoon (bv. font awesome class). |
| `prioriteit` | Definieert de weergavevolgorde op de website. |



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
