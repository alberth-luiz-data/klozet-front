import { useEffect, useState } from 'react'
import { reservasService, clientesService, pecasService } from '../services/api'

const StatCard = ({ label, value, delta, deltaType }) => (
  <div style={{
    background: '#fff', border: '1px solid #E5E7EB',
    borderRadius: '12px', padding: '20px', flex: 1,
  }}>
    <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}
    </div>
    <div style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-1px', margin: '8px 0 4px' }}>
      {value}
    </div>
    <span style={{
      fontSize: '12px', fontWeight: 500,
      padding: '2px 8px', borderRadius: '20px',
      background: deltaType === 'up' ? '#D8F3DC' : deltaType === 'down' ? '#FEE2E2' : '#EDE9FE',
      color: deltaType === 'up' ? '#2D6A4F' : deltaType === 'down' ? '#9B1C1C' : '#6B46C1',
    }}>
      {delta}
    </span>
  </div>
)

const STATUS_STYLE = {
  reservado: { background: '#EDE9FE', color: '#6B46C1' },
  retirado:  { background: '#FEF3C7', color: '#8B5E10' },
  devolvido: { background: '#D8F3DC', color: '#2D6A4F' },
  atrasado:  { background: '#FEE2E2', color: '#9B1C1C' },
  cancelado: { background: '#F3F4F6', color: '#6B7280' },
}

export default function Dashboard() {
  const [reservas, setReservas] = useState([])
  const [clientes, setClientes] = useState([])
  const [pecas, setPecas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      reservasService.listar(),
      clientesService.listar(),
      pecasService.listar(),
    ]).then(([r, c, p]) => {
      setReservas(r.data)
      setClientes(c.data)
      setPecas(p.data)
    }).finally(() => setLoading(false))
  }, [])

  const ativas = reservas.filter(r => r.status === 'reservado').length
  const retiradas = reservas.filter(r => r.status === 'retirado').length
  const atrasadas = reservas.filter(r => r.status === 'atrasado').length
  const devolvidas = reservas.filter(r => r.status === 'devolvido').length
  const recentes = [...reservas].slice(0, 6)

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#6B7280' }}>
      Carregando...
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.4px' }}>Dashboard</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '3px', textTransform: 'capitalize' }}>{hoje}</p>
        </div>
      </div>

      {/* Stats principais */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <StatCard
          label="Reservas ativas"
          value={ativas}
          delta={ativas > 0 ? `${ativas} aguardando retirada` : 'Nenhuma no momento'}
          deltaType="neutral"
        />
        <StatCard
          label="Peças retiradas"
          value={retiradas}
          delta={retiradas > 0 ? `${retiradas} em uso agora` : 'Nenhuma em uso'}
          deltaType="neutral"
        />
        <StatCard
          label="Em atraso"
          value={atrasadas}
          delta={atrasadas > 0 ? `${atrasadas} com prazo vencido` : 'Tudo em dia'}
          deltaType={atrasadas > 0 ? 'down' : 'up'}
        />
        <StatCard
          label="Devolvidas"
          value={devolvidas}
          delta={`${devolvidas} concluídas`}
          deltaType="up"
        />
      </div>

      {/* Resumo rápido */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total de clientes', value: clientes.length, sub: 'cadastrados', color: '#EDE9FE', text: '#6B46C1' },
          { label: 'Peças disponíveis', value: `${pecas.filter(p => p.disponivel).length} / ${pecas.length}`, sub: 'do estoque livre', color: '#D8F3DC', text: '#2D6A4F' },
          { label: 'Total de reservas', value: reservas.length, sub: 'no sistema', color: '#FEF3C7', text: '#8B5E10' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#fff', border: '1px solid #E5E7EB',
            borderRadius: '12px', padding: '20px', flex: 1,
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {card.label}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-1px', margin: '8px 0 4px' }}>
              {card.value}
            </div>
            <span style={{
              fontSize: '12px', fontWeight: 500,
              padding: '2px 8px', borderRadius: '20px',
              background: card.color, color: card.text,
            }}>
              {card.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Reservas recentes */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>Reservas recentes</div>
          <a href="/app/reservas" style={{ fontSize: '12px', color: '#6B46C1', textDecoration: 'none', fontWeight: 500 }}>Ver todas →</a>
        </div>

        {recentes.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
            Nenhuma reserva ainda
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Cliente', 'Peça', 'Retirada', 'Devolução', 'Status'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', fontSize: '11px', fontWeight: 600,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: '#6B7280', padding: '11px 20px',
                    borderBottom: '1px solid #E5E7EB',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentes.map(reserva => (
                <tr
                  key={reserva.id}
                  style={{ borderBottom: '1px solid #E5E7EB', cursor: 'pointer' }}
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
                  <td style={{ padding: '13px 20px' }}>
                    <span style={{
                      ...STATUS_STYLE[reserva.status],
                      padding: '3px 10px', borderRadius: '20px',
                      fontSize: '11.5px', fontWeight: 500,
                    }}>
                      {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
                    </span>
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