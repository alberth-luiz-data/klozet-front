import { useEffect, useState } from 'react'
import { pecasService } from '../services/api'
import FormPeca from '../components/FormPeca'
import FormEditarPeca from '../components/FormEditarPeca'
import ModalConfirmar from '../components/ModalConfirmar'
import { Pencil, Trash2 } from 'lucide-react'

export default function Estoque() {
  const [pecas, setPecas] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroDisponivel, setFiltroDisponivel] = useState('todos')
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [apagando, setApagando] = useState(null)

  const carregar = () => {
    setLoading(true)
    pecasService.listar()
      .then(res => setPecas(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

  const confirmarApagar = async () => {
    try {
      await pecasService.deletar(apagando.id)
      carregar()
    } catch {
      alert('Erro ao apagar. A peça pode ter reservas vinculadas.')
    } finally {
      setApagando(null)
    }
  }

  const filtradas = pecas.filter(p => {
    const buscaOk = p.nome.toLowerCase().includes(busca.toLowerCase()) || p.codigo.toLowerCase().includes(busca.toLowerCase())
    const dispOk = filtroDisponivel === 'todos' ? true : filtroDisponivel === 'disponivel' ? p.disponivel : !p.disponivel
    return buscaOk && dispOk
  })

  const totalDisponivel = pecas.filter(p => p.disponivel).length
  const totalIndisponivel = pecas.filter(p => !p.disponivel).length

  return (
    <div>
      {modalAberto && <FormPeca onClose={() => setModalAberto(false)} onSalvo={carregar} />}
      {editando && <FormEditarPeca peca={editando} onClose={() => setEditando(null)} onSalvo={carregar} />}
      {apagando && (
        <ModalConfirmar
          mensagem={`Tem certeza que deseja apagar "${apagando.nome}"? Esta ação não pode ser desfeita.`}
          onConfirmar={confirmarApagar}
          onCancelar={() => setApagando(null)}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.4px' }}>Estoque</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '3px' }}>{totalDisponivel} disponíveis · {totalIndisponivel} indisponíveis</p>
        </div>
        <button onClick={() => setModalAberto(true)} style={{ background: '#6B46C1', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
          + Nova peça
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { key: 'todos', label: `Todas (${pecas.length})` },
          { key: 'disponivel', label: `Disponível (${totalDisponivel})` },
          { key: 'indisponivel', label: `Indisponível (${totalIndisponivel})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFiltroDisponivel(f.key)} style={{
            padding: '5px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 500,
            cursor: 'pointer', border: '1px solid',
            borderColor: filtroDisponivel === f.key ? '#6B46C1' : '#E5E7EB',
            background: filtroDisponivel === f.key ? '#6B46C1' : '#fff',
            color: filtroDisponivel === f.key ? '#fff' : '#6B7280',
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #E5E7EB' }}>
          <input placeholder="Buscar por nome ou código..." value={busca} onChange={e => setBusca(e.target.value)}
            style={{ width: '100%', padding: '8px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px', outline: 'none', fontFamily: 'sans-serif' }} />
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Carregando...</div>
        ) : filtradas.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Nenhuma peça encontrada</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Código', 'Nome', 'Tamanho', 'Cor', 'Diária', 'Disponível', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B7280', padding: '11px 20px', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map(peca => (
                <tr key={peca.id} style={{ borderBottom: '1px solid #E5E7EB' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td style={{ padding: '13px 20px', fontFamily: 'monospace', fontSize: '12.5px', color: '#6B7280' }}>{peca.codigo}</td>
                  <td style={{ padding: '13px 20px', fontWeight: 500, fontSize: '13.5px' }}>{peca.nome}</td>
                  <td style={{ padding: '13px 20px', fontSize: '13px' }}>{peca.tamanho || '—'}</td>
                  <td style={{ padding: '13px 20px', fontSize: '13px' }}>{peca.cor || '—'}</td>
                  <td style={{ padding: '13px 20px', fontSize: '13px', fontWeight: 500 }}>R$ {parseFloat(peca.valor_diaria).toFixed(2)}</td>
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{ background: peca.disponivel ? '#D8F3DC' : '#FEE2E2', color: peca.disponivel ? '#2D6A4F' : '#9B1C1C', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 500 }}>
                      {peca.disponivel ? 'Disponível' : 'Indisponível'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setEditando(peca)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B7280' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#EDE9FE'; e.currentTarget.style.color = '#6B46C1'; e.currentTarget.style.borderColor = '#DDD6FE' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB' }}>
                        <Pencil size={14} strokeWidth={1.8} />
                      </button>
                      <button onClick={() => setApagando(peca)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B7280' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.borderColor = '#FCA5A5' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB' }}>
                        <Trash2 size={14} strokeWidth={1.8} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}