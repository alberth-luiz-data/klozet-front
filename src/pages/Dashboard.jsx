import { useEffect, useState } from 'react'
import { reservasService, clientesService, pecasService } from '../services/api'
import { Home, Calendar, Users, Shirt, LogOut } from 'lucide-react'


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
      fontSize: '12px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px',
      background: deltaType === 'up' ? '#D8F3DC' : deltaType === 'down' ? '#FEE2E2' : '#EDE9FE',
      color: deltaType === 'up' ? '#2D6A4F' : deltaType === 'down' ? '#9B1C1C' : '#6B46C1',
    }}>{delta}</span>
  </div>
)

const STATUS_STYLE = {
  reservado: { background: '#EDE9FE', color: '#6B46C1' },
  retirado:  { background: '#FEF3C7', color: '#8B5E10' },
  devolvido: { background: '#D8F3DC', color: '#2D6A4F' },
  atrasado:  { background: '#FEE2E2', color: '#9B1C1C' },
  cancelado: { background: '#F3F4F6', color: '#6B7280' },
}

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function Dashboard() {
  const [reservas, setReservas] = useState([])
  const [clientes, setClientes] = useState([])
  const [pecas, setPecas] = useState([])
  const [loading, setLoading] = useState(true)
  const [barAtiva, setBarAtiva] = useState(null)

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
  const recentes = [...reservas].slice(0, 5)

  // Reservas por dia da semana
  const porDia = Array(7).fill(0)
  reservas.forEach(r => {
    const dia = new Date(r.criado_em).getDay()
    porDia[dia]++
  })
  const maxDia = Math.max(...porDia, 1)

  // Alertas
  const alertas = [
    ...reservas.filter(r => r.status === 'atrasado').map(r => ({
      tipo: 'red', titulo: `${r.peca_detalhe?.nome || 'Peça'} em atraso`, sub: `${r.cliente_detalhe?.nome || '—'}`,
    })),
    ...reservas.filter(r => {
      if (r.status !== 'retirado') return false
      const diff = Math.ceil((new Date(r.data_devolucao) - new Date()) / (1000 * 60 * 60 * 24))
      return diff >= 0 && diff <= 2
    }).map(r => ({
      tipo: 'amber', titulo: `Devolução em breve`, sub: `${r.cliente_detalhe?.nome} · ${r.peca_detalhe?.nome}`,
    })),
    ...reservas.filter(r => r.status === 'devolvido').slice(0, 2).map(r => ({
      tipo: 'green', titulo: `Peça devolvida`, sub: `${r.cliente_detalhe?.nome} · disponível`,
    })),
  ].slice(0, 5)

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

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <StatCard label="Reservas ativas" value={ativas} delta={ativas > 0 ? `${ativas} aguardando retirada` : 'Nenhuma no momento'} deltaType="neutral" />
        <StatCard label="Peças retiradas" value={retiradas} delta={retiradas > 0 ? `${retiradas} em uso agora` : 'Nenhuma em uso'} deltaType="neutral" />
        <StatCard label="Em atraso" value={atrasadas} delta={atrasadas > 0 ? `${atrasadas} com prazo vencido` : 'Tudo em dia'} deltaType={atrasadas > 0 ? 'down' : 'up'} />
        <StatCard label="Devolvidas" value={devolvidas} delta={`${devolvidas} concluídas`} deltaType="up" />
      </div>

      {/* Grid 2 colunas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', marginBottom: '20px' }}>

        {/* Tabela recentes */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Reservas recentes</div>
            <a href="/app/reservas" style={{ fontSize: '12px', color: '#6B46C1', textDecoration: 'none', fontWeight: 500 }}>Ver todas →</a>
          </div>
          {recentes.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Nenhuma reserva ainda</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Cliente', 'Peça', 'Devolução', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B7280', padding: '10px 20px', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentes.map(reserva => (
                  <tr key={reserva.id} style={{ borderBottom: '1px solid #E5E7EB' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ fontWeight: 500, fontSize: '13px' }}>{reserva.cliente_detalhe?.nome || '—'}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280' }}>{reserva.cliente_detalhe?.telefone || ''}</div>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ fontWeight: 500, fontSize: '13px' }}>{reserva.peca_detalhe?.nome || '—'}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace' }}>{reserva.peca_detalhe?.codigo || ''}</div>
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>
                      {new Date(reserva.data_devolucao + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ ...STATUS_STYLE[reserva.status], padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>
                        {reserva.status.charAt(0).toUpperCase() + reserva.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Painel lateral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Alertas */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Alertas</div>
            </div>
            {alertas.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>Nenhum alerta no momento</div>
            ) : alertas.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '13px 16px', borderBottom: '1px solid #E5E7EB', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', marginTop: '4px', flexShrink: 0, background: a.tipo === 'red' ? '#DC2626' : a.tipo === 'amber' ? '#D97706' : '#059669' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{a.titulo}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Gráfico semanal */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Reservas por dia</div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
                {porDia.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div
                      onClick={() => setBarAtiva(barAtiva === i ? null : i)}
                      style={{
                        width: '100%', borderRadius: '4px 4px 0 0', cursor: 'pointer',
                        height: `${Math.max((v / maxDia) * 70, 4)}px`,
                        background: barAtiva === i ? '#6B46C1' : '#EDE9FE',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { if (barAtiva !== i) e.currentTarget.style.background = '#C4B5FD' }}
                      onMouseLeave={e => { if (barAtiva !== i) e.currentTarget.style.background = '#EDE9FE' }}
                    />
                    <div style={{ fontSize: '10px', color: '#6B7280', fontFamily: 'monospace' }}>{DIAS[i]}</div>
                  </div>
                ))}
              </div>
              {barAtiva !== null && (
                <div style={{ marginTop: '12px', padding: '8px 12px', background: '#EDE9FE', borderRadius: '8px', fontSize: '12.5px', color: '#6B46C1', fontWeight: 500, textAlign: 'center' }}>
                  {DIAS[barAtiva]}: {porDia[barAtiva]} reserva{porDia[barAtiva] !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          {/* Ações rápidas */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Ações rápidas</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '16px' }}>
              {[
                { label: 'Nova reserva', href: '/app/reservas', icon: '📋' },
                { label: 'Add cliente', href: '/app/clientes', icon: '👤' },
                { label: 'Add peça', href: '/app/estoque', icon: '👗' },
                { label: 'Ver estoque', href: '/app/estoque', icon: '📦' },
              ].map(a => (
                <a key={a.label} href={a.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '6px', padding: '14px 8px', borderRadius: '10px',
                    border: '1px solid #E5E7EB', cursor: 'pointer', background: '#F9FAFB',
                    fontSize: '12px', fontWeight: 500, color: '#1A1916', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#6B46C1'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#6B46C1' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#1A1916'; e.currentTarget.style.borderColor = '#E5E7EB' }}
                  >
                    <span style={{ fontSize: '20px' }}>{a.icon}</span>
                    {a.label}
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}