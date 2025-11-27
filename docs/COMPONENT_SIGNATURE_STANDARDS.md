# Component Signature Standards

## Standard Pattern Adottato

Tutti i componenti React nel progetto seguono il pattern moderno e uniforme:

```typescript
export const ComponentName = ({ prop1, prop2 }: ComponentProps) => {
  // component logic
  return (
    // JSX
  );
};
```

## Caratteristiche del Pattern

1. **`const` con arrow function**: Preferito rispetto a `function` declaration
2. **Destrutturazione props nella signature**: `({ prop1, prop2 }: PropsType)`
3. **Nessun tipo di ritorno esplicito**: TypeScript inferisce automaticamente il tipo
4. **Interface per props separate**: `ComponentProps` definito sopra il componente

## Pattern NON Utilizzati

❌ **Evitare**:
- `export function ComponentName()` - meno moderno
- `export const ComponentName: React.FC<Props> = () => {}` - deprecato, problemi con children impliciti
- `export const ComponentName = (): JSX.Element => {}` - tipo di ritorno esplicito non necessario

## Standardizzazione Completata

Tutti i componenti sono stati verificati e standardizzati:
- ✅ **171 componenti** verificati
- ✅ **3 file** standardizzati:
  - `google-calendar-card.tsx` (da `function` a `const`)
  - `integrations-client.tsx` (da `function` a `const`)
  - `search-results-utils.tsx` (rimosso tipo di ritorno esplicito)

## Utility Functions

Per le utility functions che ritornano JSX, il pattern è:
```typescript
export const utilityFunction = (param: Type) => {
  return <JSX />;
};
```

Nessun tipo di ritorno esplicito necessario - TypeScript lo inferisce.

## Vantaggi

1. **Uniformità**: Tutti i componenti seguono lo stesso pattern
2. **Modernità**: Allineato con le best practices React/TypeScript 2024
3. **Manutenibilità**: Pattern consistente facilita la lettura e modifica
4. **Type Safety**: TypeScript inferisce correttamente i tipi senza annotazioni esplicite
5. **Conformità ESLint**: Rispetta la configurazione `"@typescript-eslint/explicit-function-return-type": "off"`

## Riferimenti

- ESLint config: `eslint.config.mjs`
- TypeScript config: `tsconfig.json` (jsx: "react-jsx")
- Best practices: Programma funzionale, mai class, type inference

