import { runParser } from '../../../../5-engine/parser-engine.js';

const customPrompt = `Dit is de krachtige, gerichte instructie-prompt voor het AI-model:

---

# Instructie-Prompt: Schema-gestuurde Data Generatie

**CONTEXT:** Je bent een gespecialiseerde data transformatie-engine. Je taak is het genereren van een volledig, realistisch en samenhangend JSON-dataset op basis van de verstrekte relationele database-blueprint (schema). Alle veldnamen en de structuur moeten *exact* overeenkomen met het schema.

**TAAK:** Genereer één enkel JSON-object. De top-level sleutels van dit object moeten de 'table_name's zijn (bijv. '"basis"', '"producten"'). De waarden voor deze sleutels moeten arrays van data-records zijn.

---

### **Specifieke Eisen en Extractietips**

1.  **Algemene Structuur en Data Volume:**
    *   Genereer minstens 30 records voor de 'producten' tabel.
    *   Genereer minstens 50 records voor 'product_specificaties' (zorg voor meerdere specificaties per product).
    *   Zorg voor minimaal 10 beoordelingen in 'klantbeoordelingen'.
    *   De tabel 'basis' mag **slechts één record** bevatten.

2.  **Relaties en Sleutels (Cruciaal):**
    *   **Vreemde Sleutels:** Gebruik integers voor alle ID's ('product_id', 'categorie_id', etc.). De AI moet deze sleutels consistent en correct koppelen (bijv. de 'categorie_id' in 'producten' moet verwijzen naar een bestaande ID in 'categorieen').
    *   **Product ID Link:** Zorg ervoor dat de 'product_id' in 'product_specificaties' en 'klantbeoordelingen' verwijst naar een bestaand record in de 'producten' tabel.

3.  **Data Formaat Validatie:**
    *   **Prijzen:** Het veld 'prijs' (in 'producten') moet een **float of integer** zijn. Gebruik geen valutasymbool (€) of duizendpunten.
    *   **Categorieën:** Zorg ervoor dat het veld 'slug' uniek is en correct is opgemaakt (kleine letters, spaties vervangen door koppeltekens, bijv. '"laptop-xps-13"').
    *   **Beoordelingen:** De 'score_sterren' moet een **integer** zijn tussen 1 en 5.
    *   **Basis:** Vul 'valuta_code' in als "EUR".

4.  **Verplichte Vulling:**
    *   Zorg ervoor dat alle velden in de blueprint gevuld zijn (geen 'null' waarden).
    *   Gebruik geloofwaardige, tech-gerelateerde productnamen en beschrijvingen.

---

### **OUTPUT VEREISTE (JSON Format)**

'''json
{
  "basis": [
    { /* ... 1 record hier ... */ }
  ],
  "categorieen": [
    { /* ... alle categorieën hier ... */ }
  ],
  "producten": [
    { /* ... alle producten hier ... */ }
  ],
  "product_specificaties": [
    { /* ... alle specificaties hier ... */ }
  ],
  "klantbeoordelingen": [
    { /* ... alle beoordelingen hier ... */ }
  ],
  "sterke_punten": [
    { /* ... alle sterke punten hier ... */ }
  ]
}
'''`;

runParser('computer-shop.json', customPrompt);
