# Athena 2 Monorepo

## Handmatig deployen

Trigger de publisher workflow handmatig via CLI:

```bash
# Alle sites publiceren
gh workflow run "athena-publisher.yml" --ref main

# Specifieke site(s) publiceren
gh workflow run "athena-publisher.yml" --ref main -f sites="karel-portfolio-ath"
gh workflow run "athena-publisher.yml" --ref main -f sites="karel-portfolio-ath de-salon-site"
```
