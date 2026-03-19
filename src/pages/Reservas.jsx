import { useEffect, useState } from 'react'
import { reservasService } from '../services/api'
import FormReserva from '../components/FormReserva'
import FormEditarReserva from '../components/FormEditarReserva'
import ModalConfirmar from '../components/ModalConfirmar'
import { Pencil, Trash2 } from 'lucide-react'

const STATUS_STYLE = {
  reservado: { background: '#EDE9FE', color: '#6B46C1' },
  retirado:  { background: '#FEF3C7', color: '#8B5E10' },
  devolvido: { background: '#D8F3DC', color: '#2D6A4F' },
  atrasado:  { background: '#FEE2E2', color: '#9B1C1C' },
  cancelado: { background: '#F3F4F6', color: '#6B7280' },
}

export default function Reservas() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [apagando, setApagando] = useState(null)

  const carregar = () => {
    setLoading(true)
    reservasService.listar()
      .then(res => setReservas(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

  const confirmarApagar = async () => {
    try {
      await reservasService.deletar(apagando.id)
      carregar()
    } catch {
      alert('Erro ao apagar a reserva.')
    } finally {
      setApagando(null)
    }
  }

  const filtradas = filtro === 'todos' ? reservas : reservas.filter(r => r.status === filtro)
  const contagem = (status) => reservas.filter(r => r.status === status).length

  return (
    <div>
      {modalAberto && <FormReserva onClose={() => setModalAberto(false)} onSalvo={carregar} />}
      {editando && <FormEditarReserva reserva={editando} onClose={() => setEditando(null)} onSalvo={carregar} />}
      {apagando && (
        <ModalConfirmar
          mensagem={`Tem certeza que deseja apagar a reserva de "${apagando.cliente_detalhe?.nome}"? Esta ação não pode ser desfeita.`}
          onConfirmar={confirmarApagar}
          onCancelar={() => setApagando(null)}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.4px' }}>Reservas</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '3px' }}>{reservas.length} reservas no total</p>
        </div>
        <button onClick={() => setModalAberto(true)} style={{ background: '#6B46C1', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
          + Nova reserva
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { key: 'todos', label: 'Todas' },
          { key: 'reservado', label: `Reservado (${contagem('reservado')})` },
          { key: 'retirado', label: `Retirado (${contagem('retirado')})` },
          { key: 'atrasado', label: `Atrasado (${contagem('atrasado')})` },
          { key: 'devolvido', label: `Devolvido (${contagem('devolvido')})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFiltro(f.key)} style={{
            padding: '5px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 500,
            cursor: 'pointer', border: '1px solid',
            borderColor: filtro === f.key ? '#6B46C1' : '#E5E7EB',
            background: filtro === f.key ? '#6B46C1' : '#fff',
            color: filtro === f.key ? '#fff' : '#6B7280',
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Carregando...</div>
        ) : filtradas.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Nenhuma reserva encontrada</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Cliente', 'Peça', 'Retirada', 'Devolução', 'Valor', 'Status', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B7280', padding: '11px 20px', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map(reserva => (
                <tr key={reserva.id} style={{ borderBottom: '1px solid #E5E7EB' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td style={{ padding: '13px 20px' }}>
                    <div style={{ fontWeight: 500, fontSize: '13.5px' }}>{reserva.cliente_detalhe?.nome || '—'}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{reserva.cliente_detalhe?.telefone || ''}</div>
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <div style={{ fontWeight: 500, fontSize: '13px' }}>{reserva.peca_detalhe?.nome || '—'}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace' }}>{reserva.peca_detalhe?.codigo || ''}</div>
                  </td>
                  <td style={{ padding: '13px 20px', fontSize: '12.5px', color: '#6B7280', fontFamily: 'monospace' }}>
                    {new Date(reserva.data_retirada + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '13px 20px', fontSize: '12.5px', color: '#6B7280', fontFamily: 'monospace' }}>
                    {new Date(reserva.data_devolucao + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '13px 20px', fontSize: '13px', fontWeight: 500 }}>
                    {reserva.valor_total ? `R$ ${parseFloat(reserva.valor_total).toFixed(2)}` : '—'}
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{ ...STATUS_STYLE[reserva.status], padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: 500 }}>
                      {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setEditando(reserva)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B7280' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#EDE9FE'; e.currentTarget.style.color = '#6B46C1'; e.currentTarget.style.borderColor = '#DDD6FE' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB' }}>
                        <Pencil size={14} strokeWidth={1.8} />
                      </button>
                      <button onClick={() => setApagando(reserva)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B7280' }}
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