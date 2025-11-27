# SSR Optimization - Summary Table
## Quick Reference per Componenti da Ottimizzare

**Last Updated**: December 2024

---

## ✅ Quick Wins - Componenti da Convertire in SSR

### Tabella Riepilogativa

| Componente | Path | Priorità | Complessità | Motivo Client | Può essere SSR? |
|------------|------|----------|-------------|---------------|-----------------|
| Dashboard Getting Started | `dashboard/dashboard-getting-started.tsx` | ⭐⭐⭐ ALTA | Bassa | Nessuno (solo Link) | ✅ SÌ |
| Dashboard Quick Actions | `dashboard/dashboard-quick-actions.tsx` | ⭐⭐⭐ ALTA | Bassa | Nessuno (solo Link) | ✅ SÌ |
| Agents Header | `agents/agents-header.tsx` | ⭐⭐⭐ ALTA | Bassa | Nessuno (solo Link/Button) | ✅ SÌ |
| Workflows Header | `workflows/workflows-header.tsx` | ⭐⭐⭐ ALTA | Bassa | Nessuno (solo Link/Button) | ✅ SÌ |
| Runs Header | `runs/runs-header.tsx` | ⭐⭐⭐ ALTA | Bassa | Nessuno (solo testo) | ✅ SÌ |
| Empty Agents State | `agents/empty-agents-state.tsx` | ⭐⭐⭐ ALTA | Bassa | Nessuno (solo Link) | ✅ SÌ |
| Empty Workflows State | `workflows/empty-workflows-state.tsx` | ⭐⭐⭐ ALTA | Bassa | Nessuno (solo Link) | ✅ SÌ |
| Empty Runs State | `runs/empty-runs-state.tsx` | ⭐⭐⭐ ALTA | Bassa | Nessuno (solo testo) | ✅ SÌ |
| Workflow Card | `workflows/workflow-card.tsx` | ⭐⭐⭐ ALTA | Bassa | Nessuno (solo Link) | ✅ SÌ |
| Account GDPR Section | `account/account-gdpr-section.tsx` | ⭐⭐⭐ ALTA | Bassa | Nessuno (solo composizione) | ✅ SÌ |
| Account Details Section | `account/account-details-section.tsx` | ⭐⭐⭐ ALTA | Media | Hook di formattazione | ✅ SÌ* |
| Cookie Banner Message | `cookie-banner/cookie-banner-message.tsx` | ⭐⭐ MEDIA | Bassa | Nessuno | ✅ SÌ** |
| Run Timeline | `runs/run-timeline.tsx` | ⭐⭐ MEDIA | Bassa | Nessuno (solo mapping) | ✅ SÌ |

**Note**:
- *Richiede conversione hook `useAccountDetails` in utility function
- **Poco beneficio se parent è client, ma può essere SSR

---

## ❌ Componenti che DEVONO Rimanere Client

| Componente | Path | Motivo | Note |
|------------|------|--------|------|
| Agent Card | `agents/agent-card.tsx` | Usa `useRouter()` per navigazione programmatica | Potrebbe essere ottimizzato convertendo onClick in Link |
| Cookie Banner | `cookie-banner.tsx` | Usa localStorage + hook state | Necessario per funzionalità |
| Forms | Vari | React Hook Form + validazione | Necessario |
| Interactive Components | Vari | useState, useEffect, event handlers | Necessario |

---

## 📊 Impatto Stimato

### Fase 1 (Quick Wins) ✅ COMPLETATO
- **Componenti ottimizzati**: 15 componenti + 2 hooks
- **Riduzione bundle JS**: ~5-10%
- **Tempo implementazione**: 2-3 ore
- **Rischi**: Bassi (componenti statici)
- **Risultato**: 50.8% Client / 49.2% Server

### Fase 2A (Subcomponents Statici) ✅ COMPLETATO
- **Componenti ottimizzati**: 4 componenti + 1 hook
- **Riduzione bundle JS aggiuntiva**: ~2-3%
- **Tempo implementazione**: ~2 ore
- **Rischi**: Bassi (subcomponents statici)
- **Risultato**: 48.9% Client / 51.1% Server 🎉

### Fase 2B/C (Ottimizzazioni Medie) ⏭️ PROPOSTA
- **Componenti ottimizzabili**: ~5-10 componenti
- **Riduzione bundle JS aggiuntiva**: ~2-4%
- **Tempo implementazione**: 6-9 ore
- **Rischi**: Medi (richiede refactoring maggiore)
- **Risultato target**: ~45% Client / 55% Server

### Totale Potenziale (Fase 1 + 2)
- **Componenti ottimizzabili**: ~24-29 componenti
- **Riduzione bundle JS totale**: ~8-15%
- **Miglioramento performance**: 10-20% FCP, 15-25% TTI

---

**Per dettagli completi, vedere**: `SSR_OPTIMIZATION_ANALYSIS.md`

