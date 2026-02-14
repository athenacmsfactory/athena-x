# 📘 Handleiding: karel-portfolio-ath

**Type Website:** karel-portfolio-ath
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
| `theme` | dark of light |

### Tabblad: `profile`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `full_name` | Naam van de persoon. |
| `tagline` | Korte slogan. |
| `professional_title` | Bv. Full Stack Developer. |
| `bio_short` | Intro voor de hero. |
| `bio_long` | Lange bio voor de about sectie. |
| `avatar_url` | URL naar profielfoto. |
| `contact_email` | E-mailadres voor contact. |
| `cta_text` | Tekst op de knop. |

### Tabblad: `projects`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `title` | Projectnaam. |
| `category` | Bv. Web, App, AI. |
| `summary` | Korte samenvatting. |
| `description` | Gedetailleerde beschrijving. |
| `tech_stack` | Komma-gescheiden technologieën. |
| `demo_url` | Link naar demo. |
| `repo_url` | Link naar GitHub. |
| `image_url` | Project screenshot URL. |
| `status` | Live, In Progress, etc. |

### Tabblad: `services`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `title` | Naam van de dienst. |
| `description` | Uitleg van de dienst. |
| `icon_name` | Icoon naam (Lucide). |

### Tabblad: `testimonials`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `client_name` | Naam van de klant. |
| `company` | Bedrijf van de klant. |
| `quote` | De testimonial tekst. |

### Tabblad: `socials`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `platform` | Bv. LinkedIn. |
| `url` | Link naar profiel. |
| `icon` | Icoon naam. |



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
