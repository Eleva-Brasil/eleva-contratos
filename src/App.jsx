import { useEffect, useState } from 'react'
import KpiStrip from './components/KpiStrip.jsx'
import TabSintetica from './components/TabSintetica.jsx'
import TabAnalitica from './components/TabAnalitica.jsx'
import TabCategoria from './components/TabCategoria.jsx'
import TabGeografia from './components/TabGeografia.jsx'
import TabDados from './components/TabDados.jsx'
import UploadPanel, { loadStoredData } from './components/UploadPanel.jsx'

import summaryDefault from './data/summary.json'
import analiticaDefault from './data/analitica.json'
import dadosTratadosDefault from './data/dadosTratados.json'

const TABS = [
  { id: 'sintetica', label: 'Sintética' },
  { id: 'analitica', label: 'Analítica' },
  { id: 'categoria', label: 'Vendedor × Categoria' },
  { id: 'geografia', label: 'Região / Estado / Cidade' },
  { id: 'dados', label: 'Dados Tratados' },
]

export default function App() {
  const [tab, setTab] = useState('sintetica')
  const [dataset, setDataset] = useState(null) // null = usa os JSON padrão do build

  useEffect(() => {
    const stored = loadStoredData()
    if (stored) setDataset(stored)
  }, [])

  const summary = dataset?.summary ?? summaryDefault
  const analitica = dataset?.analitica ?? analiticaDefault
  const dadosTratados = dataset?.dadosTratados ?? dadosTratadosDefault
  const currentMeta = dataset?.summary?._meta ?? null

  return (
    <div className="wrap">
      <header>
        <div>
          <div className="eyebrow">Eleva Brasil · Locação de Equipamentos</div>
          <h1>Painel de Contratos — 2026</h1>
          <div className="subtitle">
            Potencial de faturamento por vendedor, mix de vendas e distribuição geográfica.
            Faturamento considera apenas Equipamentos + Operadores.
          </div>
        </div>
        <div className="meta">
          <div><b>Base:</b> Contratos - 13-08-2026.xlsx</div>
          <div><b>Registros válidos:</b> {summary.grand_qtde} (Nº de série obrigatório)</div>
          <div><b>Cidades:</b> nomes normalizados</div>
        </div>
      </header>

      <UploadPanel onDataLoaded={setDataset} currentMeta={currentMeta} />

      <KpiStrip summary={summary} />

      <nav className="main-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`main-tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'sintetica' && <TabSintetica summary={summary} />}
      {tab === 'analitica' && <TabAnalitica rows={analitica} vendedores={summary.vendedores} />}
      {tab === 'categoria' && (
        <TabCategoria categorias={summary.categorias} vendedorCategoria={summary.vendedor_categoria} />
      )}
      {tab === 'geografia' && (
        <TabGeografia regioes={summary.regioes} estados={summary.estados} cidades={summary.cidades} />
      )}
      {tab === 'dados' && <TabDados rows={dadosTratados} />}

      <footer>
        <div>
          <b>Metodologia:</b> linhas em branco e sem Nº de série excluídas · faturamento = Equipamentos + Operadores
          (Frete e Adicional não considerados) · cidades com variação de grafia unificadas
        </div>
        <div><b>Fonte:</b> Contratos - 13-08-2026.xlsx — atualizado em 13/08/2026</div>
      </footer>
    </div>
  )
}
