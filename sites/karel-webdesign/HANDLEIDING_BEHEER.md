# 📘 Handleiding: karel-webdesign

**Type Website:** karel-webdesign
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

### Tabblad: `site_settings`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `site_title` | Titel van de website. |
| `site_description` | Meta beschrijving van de site. |
| `contact_email` | Algemeen contact e-mailadres. |
| `logo_text` | Tekst voor het logo. |

### Tabblad: `navigation`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `label` | Menu label. |
| `href` | Link naar sectie (bv. #services). |
| `order` | Volgorde in menu. |

### Tabblad: `hero`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `title` | Hoofdtitel op de hero sectie. |
| `subtitle` | Ondertitel op de hero sectie. |
| `cta_text` | Tekst op de call-to-action knop. |
| `cta_link` | Link voor de call-to-action knop. |
| `image_url` | Achtergrondafbeelding URL. |

### Tabblad: `features`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `title` | Titel van de feature. |
| `description` | Beschrijving van de feature. |
| `icon` | Icoon naam (bv. vanuit Lucide of Heroicons). |

### Tabblad: `services`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `title` | Naam van het pakket. |
| `price` | Prijs (bv. €499). |
| `description` | Korte uitleg. |
| `features_list` | Komma-gescheiden lijst van features. |
| `recommended` | Boolean (True/False) voor highlight. |
| `order` | Sorteervolgorde. |

### Tabblad: `portfolio`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `title` | Projectnaam. |
| `description` | Projectbeschrijving. |
| `tech_stack` | Komma-gescheiden lijst van technologieën. |
| `status` | Live, In Ontwikkeling, etc. |
| `github_url` | Link naar GitHub repo. |
| `live_url` | Link naar live demo. |
| `image_url` | Project screenshot URL. |

### Tabblad: `about`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `title` | Titel van de about sectie. |
| `content` | Inhoud van de about sectie. |
| `image_url` | Afbeelding van Karel/Bedrijf. |

### Tabblad: `contact`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `title` | Titel contact sectie. |
| `description` | Aansporende tekst. |
| `address` | Fysiek adres. |
| `phone` | Telefoonnummer. |



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
