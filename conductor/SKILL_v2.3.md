---
name: multi-agent-conductor
version: 2.3
description: Multi-agent coordination with Proposal-Approval Cycle and Pulse Sensing.
---

# Multi-Agent Conductor (v2.3 - Governance)

## 📡 Pulse Sensing (v2.1)
Agents draaien `node conductor/pulse.js agent [ID]` in de voorgrond om direct te reageren op signalen.

## 🤝 Proposal-Approval Cycle (Nieuw in v2.3)
1. **Directive**: De Lead Architect schrijft een `[DIRECTIVE]`.
2. **Proposal**: De Agent schrijft EERST een `[PROPOSAL]` in de `execution_log.md` met de voorgestelde aanpak.
3. **Approval**: De Agent wacht tot de Lead Architect `[APPROVED]` antwoordt.
4. **Action**: PAS NA goedkeuring voert de Agent de wijzigingen uit.

## 🛡️ Leadership Rules
- **Lead Architect**: Strategie, Directives en Approvals.
- **Execution Agents**: Implementatie, Proposals en Logging.
