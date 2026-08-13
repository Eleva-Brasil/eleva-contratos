import { useRef, useState } from 'react'

const STORAGE_KEY = 'eleva-dashboard-data-v1'

export function loadStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function UploadPanel({ onDataLoaded, currentMeta }) {
  const inputRef = useRef(null)
  const [status, setStatus] = useState(null) // { type: 'ok'|'error'|'loading', msg }

  async function handleFile(file) {
    if (!file) return
    setStatus({ type: 'loading', msg: 'Lendo planilha…' })
    try {
      const { parseContractsFile } = await import('../parseContracts.js')
      const result = await parseContractsFile(file)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
      onDataLoaded(result)
      setStatus({
        type: 'ok',
        msg: `${result.summary.grand_qtde} registros carregados de "${file.name}" (${result.summary._meta.excluidasSemSerie} sem Nº de série excluídas).`,
      })
    } catch (e) {
      console.error(e)
      const msg = e instanceof Error && e.message
        ? e.message
        : 'Não foi possível ler o arquivo. Confira se é um .xlsx válido.'
      setStatus({ type: 'error', msg })
    }
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY)
    setStatus({ type: 'ok', msg: 'Dados originais restaurados.' })
    onDataLoaded(null)
  }

  return (
    <div className="upload-panel">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button className="upload-btn" onClick={() => inputRef.current?.click()}>
        ⭱ Atualizar dados (.xlsx)
      </button>
      {currentMeta && (
        <button className="upload-btn ghost" onClick={handleReset}>
          Restaurar base original
        </button>
      )}
      {currentMeta && (
        <span className="upload-meta">
          Base atual: <b>{currentMeta.arquivo}</b> · atualizado {new Date(currentMeta.atualizadoEm).toLocaleString('pt-BR')}
        </span>
      )}
      {status && <div className={`upload-status ${status.type}`}>{status.msg}</div>}
    </div>
  )
}
