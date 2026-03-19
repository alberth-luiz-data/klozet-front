import { useNavigate } from 'react-router-dom'

const C = {
  accent: '#6B46C1',
  accentLight: '#EDE9FE',
  accentMid: '#7C3AED',
  accentDark: '#4C1D95',
  text: '#1A1916',
  muted: '#6B7280',
  border: '#E5E7EB',
  bg: '#FAFAF9',
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'sans-serif', color: C.text, background: '#fff' }}>

      {/* ── Nav ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 80px', borderBottom: `1px solid ${C.border}`,
        position: 'sticky', top: 0, background: '#fff', zIndex: 100,
      }}>
        <div style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.5px' }}>
          Klozet<span style={{ color: C.accent, fontWeight: 700 }}>.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#funcionalidades" style={{ fontSize: '14px', color: C.muted, textDecoration: 'none' }}>Funcionalidades</a>
          <a href="#planos" style={{ fontSize: '14px', color: C.muted, textDecoration: 'none' }}>Planos</a>
          <button onClick={() => navigate('/login')} style={{ fontSize: '14px', color: C.muted, background: 'none', border: 'none', cursor: 'pointer' }}>Entrar</button>
          <button onClick={() => navigate('/login')} style={{
            padding: '9px 20px', borderRadius: '8px', border: 'none',
            background: C.accent, color: '#fff', fontSize: '14px',
            fontWeight: 500, cursor: 'pointer',
          }}>Começar grátis</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        padding: '100px 80px', maxWidth: '1100px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: C.accentLight, border: `1px solid #DDD6FE`,
            borderRadius: '20px', padding: '5px 14px',
            fontSize: '12.5px', color: C.accent, marginBottom: '24px', fontWeight: 500,
          }}>
            ✦ Sistema de gestão para locação de roupas
          </div>
          <h1 style={{
            fontSize: '52px', fontWeight: 700, lineHeight: 1.1,
            letterSpacing: '-1.5px', marginBottom: '24px',
          }}>
            Gerencie suas<br />
            <span style={{ color: C.accent }}>reservas</span> com<br />
            simplicidade
          </h1>
          <p style={{ fontSize: '17px', color: C.muted, lineHeight: 1.7, marginBottom: '40px', maxWidth: '420px' }}>
            Controle clientes, estoque e devoluções em um só lugar. Saiba sempre quem pegou, quem deve devolver e o que está disponível.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate('/login')} style={{
              padding: '13px 28px', borderRadius: '10px', border: 'none',
              background: C.accent, color: '#fff', fontSize: '15px',
              fontWeight: 500, cursor: 'pointer',
            }}>Começar grátis →</button>
            <button onClick={() => navigate('/login')} style={{
              padding: '13px 28px', borderRadius: '10px',
              border: `1px solid ${C.border}`, background: '#fff',
              fontSize: '15px', fontWeight: 500, cursor: 'pointer', color: C.text,
            }}>Ver demonstração</button>
          </div>
          <p style={{ fontSize: '12.5px', color: C.muted, marginTop: '16px' }}>
            Sem cartão de crédito · 14 dias grátis · Cancele quando quiser
          </p>
        </div>

        {/* Preview */}
        <div style={{
          background: C.accentLight, border: `1px solid #DDD6FE`,
          borderRadius: '16px', padding: '24px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            {[
              { label: 'Reservas ativas', value: '48', color: C.accentLight, text: C.accent },
              { label: 'Em atraso', value: '3', color: '#FEE2E2', text: '#9B1C1C' },
              { label: 'Disponíveis', value: '24', color: '#D8F3DC', text: '#2D6A4F' },
              { label: 'Clientes', value: '120', color: '#FEF3C7', text: '#8B5E10' },
            ].map(card => (
              <div key={card.label} style={{
                background: '#fff', border: `1px solid ${C.border}`,
                borderRadius: '10px', padding: '14px',
              }}>
                <div style={{ fontSize: '11px', color: C.muted, marginBottom: '6px' }}>{card.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.5px' }}>{card.value}</div>
                <span style={{ background: card.color, color: card.text, fontSize: '10px', padding: '2px 7px', borderRadius: '10px', fontWeight: 500 }}>
                  atualizado agora
                </span>
              </div>
            ))}
          </div>
          {[
            { nome: 'Ana Silva', peca: 'Vestido Midi Floral', status: 'Retirado', cor: '#FEF3C7', text: '#8B5E10' },
            { nome: 'Beatriz Melo', peca: 'Conjunto Festa Rose', status: 'Reservado', cor: C.accentLight, text: C.accent },
            { nome: 'Carla Ramos', peca: 'Blazer Alfaiataria', status: 'Atrasado', cor: '#FEE2E2', text: '#9B1C1C' },
          ].map(r => (
            <div key={r.nome} style={{
              background: '#fff', border: `1px solid ${C.border}`,
              borderRadius: '8px', padding: '10px 14px', marginBottom: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{r.nome}</div>
                <div style={{ fontSize: '11px', color: C.muted }}>{r.peca}</div>
              </div>
              <span style={{ background: r.cor, color: r.text, fontSize: '11px', padding: '3px 9px', borderRadius: '20px', fontWeight: 500 }}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Funcionalidades ── */}
      <section id="funcionalidades" style={{ background: C.accentLight, padding: '80px', borderTop: `1px solid #DDD6FE` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.8px', marginBottom: '12px' }}>
              Tudo que você precisa
            </h2>
            <p style={{ fontSize: '16px', color: C.muted }}>Desenvolvido especialmente para locadoras de roupas</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { icon: '📋', titulo: 'Gestão de reservas', desc: 'Controle completo do ciclo: reservado, retirado, devolvido e atrasado. Nunca perca o controle.' },
              { icon: '👗', titulo: 'Estoque inteligente', desc: 'Peças ficam indisponíveis automaticamente quando reservadas e voltam ao estoque na devolução.' },
              { icon: '👥', titulo: 'Cadastro de clientes', desc: 'Histórico completo de cada cliente, com telefone, CPF e todas as reservas anteriores.' },
              { icon: '⚠️', titulo: 'Alertas de atraso', desc: 'Saiba imediatamente quais peças estão com prazo vencido e entre em contato com o cliente.' },
              { icon: '💰', titulo: 'Cálculo automático', desc: 'O valor total é calculado automaticamente pela diária e período. Com opção de ajuste manual.' },
              { icon: '📱', titulo: 'Acesso de qualquer lugar', desc: 'Sistema 100% online. Acesse do celular, tablet ou computador, onde estiver.' },
            ].map(f => (
              <div key={f.titulo} style={{
                background: '#fff', border: `1px solid #DDD6FE`,
                borderRadius: '12px', padding: '24px',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
                <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{f.titulo}</div>
                <div style={{ fontSize: '13.5px', color: C.muted, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planos ── */}
      <section id="planos" style={{ padding: '80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.8px', marginBottom: '12px' }}>Planos simples</h2>
          <p style={{ fontSize: '16px', color: C.muted }}>Sem surpresas. Cancele quando quiser.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            {
              nome: 'Gratuito', preco: 'R$ 0', periodo: '/14 dias',
              desc: 'Para conhecer sem compromisso',
              items: ['Até 20 reservas', 'Até 30 peças', '1 usuário', 'Suporte email'],
              destaque: false, btn: 'Começar grátis',
            },
            {
              nome: 'Essencial', preco: 'R$ 49', periodo: '/mês',
              desc: 'Para lojas no dia a dia',
              items: ['Reservas ilimitadas', 'Estoque ilimitado', '1 usuário', 'Alertas de atraso', 'Suporte prioritário'],
              destaque: true, btn: 'Assinar agora',
            },
            {
              nome: 'Pro', preco: 'R$ 97', periodo: '/mês',
              desc: 'Para lojas que querem crescer',
              items: ['Tudo do Essencial', 'Até 3 usuários', 'Relatórios financeiros', 'Suporte WhatsApp'],
              destaque: false, btn: 'Assinar agora',
            },
          ].map(p => (
            <div key={p.nome} style={{
              border: `1px solid ${p.destaque ? C.accent : C.border}`,
              borderRadius: '16px', padding: '32px',
              background: p.destaque ? C.accent : '#fff',
              color: p.destaque ? '#fff' : C.text,
              position: 'relative',
            }}>
              {p.destaque && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: C.accentDark, borderRadius: '20px', padding: '3px 14px',
                  fontSize: '11.5px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap',
                }}>✦ Mais popular</div>
              )}
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', opacity: 0.7 }}>{p.nome}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '12px 0 8px' }}>
                <span style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' }}>{p.preco}</span>
                <span style={{ fontSize: '14px', opacity: 0.6 }}>{p.periodo}</span>
              </div>
              <div style={{ fontSize: '13px', opacity: 0.6, marginBottom: '24px' }}>{p.desc}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {p.items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}>
                    <span style={{ color: p.destaque ? '#C4B5FD' : C.accent, fontWeight: 600 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/login')} style={{
                width: '100%', padding: '11px', borderRadius: '8px',
                border: p.destaque ? '1px solid rgba(255,255,255,0.3)' : `1px solid ${C.border}`,
                background: p.destaque ? 'rgba(255,255,255,0.15)' : C.accentLight,
                color: p.destaque ? '#fff' : C.accent,
                fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              }}>{p.btn}</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: C.accent, color: '#fff', padding: '80px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '16px' }}>
          Pronto para organizar sua locadora?
        </h2>
        <p style={{ fontSize: '16px', opacity: 0.7, marginBottom: '36px' }}>
          Comece grátis por 14 dias. Sem cartão de crédito.
        </p>
        <button onClick={() => navigate('/login')} style={{
          padding: '14px 32px', borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.3)',
          background: '#fff', color: C.accent,
          fontSize: '15px', fontWeight: 600, cursor: 'pointer',
        }}>Criar conta grátis →</button>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '32px 80px', borderTop: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '13px', color: C.muted,
      }}>
        <div style={{ fontWeight: 600 }}>Klozet<span style={{ color: C.accent }}>.</span> © 2026</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" style={{ color: C.muted, textDecoration: 'none' }}>Privacidade</a>
          <a href="#" style={{ color: C.muted, textDecoration: 'none' }}>Termos</a>
          <a href="#" style={{ color: C.muted, textDecoration: 'none' }}>Contato</a>
        </div>
      </footer>
    </div>
  )
}