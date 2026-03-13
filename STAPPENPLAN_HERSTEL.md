# 🔱 Athena Herstelplan: Stap-voor-Stap (Human Readable)

Voer deze stappen morgen één voor één uit met mij in een **nieuwe chat-sessie**.

## STAP 1: De "Grote Reset"
*   **Actie:** Typ `exit` en start de CLI opnieuw op.
*   **Waarom?** Om de irritante padfouten (`after-agent.sh`) definitief uit het geheugen te wissen.

## STAP 2: De "Master Key" (SSH)
*   **Actie:** Laat mij een SSH-sleutelpaar genereren.
*   **Wat gebeurt er?** We maken een digitale sleutel die speciaal bedoeld is voor het pushen van code, zonder dat we wachtwoorden of tokens nodig hebben.

## STAP 3: De Website openzetten
*   **Actie:** Voeg de "Publieke Sleutel" toe aan je websites op GitHub (bijv. `test-portfolio`).
*   **Locatie:** Settings > Deploy keys > Add deploy key.
*   **Let op:** Vink `Allow write access` aan!

## STAP 4: De Fabriek de sleutel geven
*   **Actie:** Voeg de "Privé Sleutel" toe aan de monorepo (`athenacmsfactory/athena`).
*   **Locatie:** Settings > Secrets and variables > Actions.
*   **Naam:** `ATHENA_SSH_KEY`.

## STAP 5: De Code aanpassen
*   **Actie:** Ik pas de `athena-publisher.yml` aan zodat deze de nieuwe SSH-sleutel gebruikt.
*   **Resultaat:** De "Brug" tussen de monorepo en de websites is hersteld en onverwoestbaar.

## STAP 6: Testen
*   **Actie:** We doen een test-push en vieren de groene vinkjes!

---
*Status vandaag:* De site `test-portfolio` werkt weer, de code is veilig. Morgen maken we de automaat weer heel.*
