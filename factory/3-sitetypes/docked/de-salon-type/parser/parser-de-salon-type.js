import { runParser } from '../../../../5-engine/parser-engine.js';

const customPrompt = `Dit is een prompt die de AI dwingt tot een gestructureerde, relationele extractie en strikt de datatypes volgt.

---

## Krachtige Instructie Prompt: Data-Extractie naar JSON Blueprint

**ROL:** Je bent een gestructureerde Data Engineer. Jouw taak is om de verstrekte ruwe tekst te analyseren en alle relevante informatie te extraheren en te formatteren in een enkel JSON-object dat **strikt** voldoet aan de hieronder gespecificeerde relationele blueprint.

---

### STRIKTE EISEN VOOR DE OUTPUT

1.  **Formaat:** De output moet één enkel JSON-object zijn. De hoofdsleutels van dit object moeten overeenkomen met de 'table_name's uit de blueprint (e.g., '"basis"', '"locaties"'). De waarden moeten lijsten van JSON-objecten zijn (de records).
2.  **Relaties (Foreign Keys):** Je moet interne IDs genereren en relaties leggen.
    *   Genereer unieke 'groep_id''s voor 'diensten_hoofdgroepen' en koppel deze aan de juiste records in 'diensten_tarieven'.
    *   Genereer 'gradatie_id''s voor 'stylist_gradatie' en koppel deze aan de relevante records in 'teamleden'.
3.  **Datatypen:** **Strict toepassen:**
    *   Numerieke velden (e.g., 'basis_prijs', 'min_ervaring_jaren', ID's, 'volgorde') moeten als nummers (integers of floats) worden ingevoerd, **niet als strings**. 'basis_prijs' moet als float (met twee decimalen) worden behandeld.
    *   Boolean velden (e.g., 'gradatie_afhankelijk', 'is_call_to_action', 'is_actief', 'is_behandeling') moeten als de Boolean waarden 'true' of 'false' worden ingevoerd.
4.  **Volledigheid:** Elk veld gespecificeerd in de blueprint moet aanwezig zijn in de output, ook als de informatie ontbreekt in de ruwe tekst. Gebruik dan 'null' of een lege string ('""') indien passend voor het datatype.

### FOCUS BIJ EXTRACTIE

*   **'basis':** Zorg ervoor dat 'telefoonnummer' en de link-velden (URL's) correct worden geëxtraheerd, ongeacht de opmaak in de brontekst.
*   **'diensten_tarieven':** De velden 'basis_prijs', 'prijs_indicatie' en de Boolean 'gradatie_afhankelijk' zijn cruciaal. Gebruik context om te bepalen of een dienst van een stylistgradatie afhankelijk is.
*   **'stylist_gradatie' & 'teamleden':** Eerst de unieke gradaties definiëren en daarna de teamleden correct linken via de gegenereerde 'gradatie_id'.

**Begin met de JSON-output, startend met de eerste tabel, gebaseerd op de ruwe tekst die hierna volgt:**

---
[HIER KOMT DE RUWE BRONTEKST]
---`;

runParser('de-salon-type.json', customPrompt);
