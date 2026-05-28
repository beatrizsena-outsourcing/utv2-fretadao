# Infleet — Utilização de Frota

Dashboard analítico em tempo real para monitoramento de utilização de veículos.

## Stack

- **Next.js 15** (App Router)
- **TypeScript** — tipagem completa
- **TailwindCSS** — utilitários de layout
- **TanStack React Query** — data fetching com polling automático
- **Zustand** — estado global (filtros, dados, UI)
- **Leaflet + leaflet.heat** — mapa de calor geográfico
- **DM Sans + DM Mono** — tipografia

## Estrutura

```
/app              → páginas Next.js (App Router)
/components
  /sidebar        → Sidebar.tsx
  /filters        → FilterBar.tsx
  /kpi            → KpiStrip.tsx
  /map            → MapArea.tsx, HeatMap.tsx
/services         → api.ts, map.service.ts, vehicles.service.ts, metrics.service.ts
/store            → dashboard.store.ts (Zustand)
/hooks            → useHeatmapData.ts
/types            → index.ts
/utils            → index.ts
```

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar backend

Copie `.env.example` para `.env.local` e ajuste a URL:

```bash
cp .env.example .env.local
```

Edite `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000 (ou a porta que o Next.js escolher)

### 4. Build de produção

```bash
npm run build
npm run start
```

## Integração com Backend

O frontend consume a seguinte rota obrigatória:

### `GET /api/heatmap/data?ignitionOnly=true`

**Resposta esperada:**
```json
{
  "success": true,
  "points": [
    {
      "Latitude": -14.23,
      "Longitude": -51.92,
      "Placa": "TCA0B14",
      "Data": "2026-04-15T10:30:00Z",
      "Velocidade": 54
    }
  ]
}
```

O serviço aceita campos em português ou inglês (normalização automática):
- `Latitude | latitude | lat`
- `Longitude | longitude | lng`
- `Placa | "Placa do veículo" | placa | veiculo | vehicle`
- `Data | data | date`
- `Velocidade | velocidade | speed`

## Atualização em Tempo Real

O React Query faz polling automático a cada **5 minutos**. Para alterar:

```typescript
// hooks/useHeatmapData.ts
refetchInterval: 5 * 60 * 1000, // 5 minutos em ms
```

## Mapeamento Placa → Área

O arquivo `types/index.ts` contém o mapeamento completo de placas para áreas (A1.1, A2.3, BLADES, SUPERVISOR, etc.). Caso o backend retorne a área diretamente, ela é usada; caso contrário, o mapeamento local é aplicado.

## Deploy

### Vercel (recomendado)

```bash
npm install -g vercel
vercel --prod
```

Configure a variável de ambiente `NEXT_PUBLIC_API_URL` no painel da Vercel apontando para o backend em produção.

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
