---
name: multi-agent-conductor
version: 2.1
description: Multi-agent coordination for Gemini CLI with Pulse Sensing and Foreground Monitoring.
---

# Multi-Agent Conductor (v2.1 - Pulse Sensing)

Dit protocol coördineert een "Lead Architect" en meerdere "Execution Agents".

## 📡 Pulse & Foreground Protocol (Nieuw in v2.1)
1. **Sensing**: Agents MOETEN `node conductor/pulse.js agent [ID]` draaien om signalen op te vangen.
2. **Foreground Blocking**: Draai de Pulse in de voorgrond om direct te reageren op de Lead Architect.
3. **Exit on Directive**: De Pulse stopt automatisch zodra een nieuwe `[DIRECTIVE]` wordt gedetecteerd.

## 🛡️ Leadership Rules
- **Lead Architect**: Verantwoordelijk voor Strategie en Directives.
- **Execution Agents**: Verantwoordelijk voor Implementatie en Logging.
