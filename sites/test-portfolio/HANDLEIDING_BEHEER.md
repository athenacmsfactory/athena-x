# 📘 Handleiding: test-portfolio

**Type Website:** portfolio
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

### Tabblad: `Profile`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `full_name` | Naam van de persoon of het bureau |
| `tagline` | Korte, pakkende slogan (bv. 'Building digital dreams') |
| `professional_title` | Bv. 'Full Stack Developer' of 'Grafisch Ontwerper' |
| `bio_short` | Introductie voor de Hero sectie |
| `bio_long` | Uitgebreid verhaal voor de 'Over mij' sectie |
| `avatar_prompt` | Prompt voor een AI-profielfoto |
| `contact_email` | Geen beschrijving beschikbaar. |
| `cta_text` | Tekst voor de hoofdknop (bv. 'Hire Me') |

### Tabblad: `Projects`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `title` | Geen beschrijving beschikbaar. |
| `category` | Bv. 'Web', 'Mobile', 'Branding' |
| `summary` | Korte beschrijving voor de kaart |
| `description` | Volledige beschrijving van de case |
| `tech_stack` | Comma-separated (bv. 'React, Figma') |
| `demo_url` | Geen beschrijving beschikbaar. |
| `repo_url` | Geen beschrijving beschikbaar. |
| `image_prompt` | Beschrijving voor een project screenshot/mockup |

### Tabblad: `Services`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `title` | Dienst naam (bv. 'Web Development') |
| `description` | Uitleg van de dienst |
| `icon_name` | Naam van een icoon (bv. 'Code', 'Pen') |

### Tabblad: `Testimonials`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `client_name` | Geen beschrijving beschikbaar. |
| `company` | Geen beschrijving beschikbaar. |
| `quote` | De aanbeveling |

### Tabblad: `Socials`

| Kolomnaam | Beschrijving |
| :--- | :--- |
| `platform` | LinkedIn, GitHub, Twitter, etc. |
| `url` | Geen beschrijving beschikbaar. |



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
