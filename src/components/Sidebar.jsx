import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Calendar, Users, Shirt, LogOut } from 'lucide-react'

const navItems = [
  { to: '/app', label: 'Dashboard', icon: Home },
  { to: '/app/reservas', label: 'Reservas', icon: Calendar },
  { to: '/app/clientes', label: 'Clientes', icon: Users },
  { to: '/app/estoque', label: 'Estoque', icon: Shirt },
]

export default function Sidebar() {
  const navigate = useNavigate()

  const sair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    navigate('/login')
  }

  return (
    <aside style={{
      width: '220px', background: '#fff', borderRight: '1px solid #E5E7EB',
      display: 'flex', flexDirection: 'column', padding: '24px 16px',
      position: 'fixed', top: 0, left: 0, bottom: 0,
    }}>
      <div style={{
        fontSize: '20px', fontWeight: 700, padding: '0 8px 28px',
        borderBottom: '1px solid #E5E7EB', marginBottom: '24px',
        letterSpacing: '-0.5px',
      }}>
        Klozet<span style={{ color: '#6B46C1' }}>.</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 10px', borderRadius: '8px',
                textDecoration: 'none', fontSize: '13.5px', fontWeight: 500,
                background: isActive ? '#EDE9FE' : 'transparent',
                color: isActive ? '#6B46C1' : '#6B7280',
                transition: 'all 0.15s',
              })}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#F5F3FF'
                e.currentTarget.style.color = '#6B46C1'
              }}
              onMouseLeave={e => {
                const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
                e.currentTarget.style.background = isActive ? '#EDE9FE' : 'transparent'
                e.currentTarget.style.color = isActive ? '#6B46C1' : '#6B7280'
              }}
            >
              <Icon size={16} strokeWidth={1.8} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px',
          padding: '8px 10px', borderRadius: '8px', background: '#F5F3FF',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#6B46C1', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, flexShrink: 0,
          }}>K</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1916' }}>Klozet</div>
            <div style={{ fontSize: '11px', color: '#6B46C1', fontWeight: 500 }}>Plano Pro</div>
          </div>
        </div>
        <button
          onClick={sair}
          style={{
            width: '100%', padding: '8px 10px', borderRadius: '8px',
            border: '1px solid #E5E7EB', background: '#fff',
            fontSize: '12.5px', fontWeight: 500, color: '#6B7280',
            cursor: 'pointer', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#FEE2E2'
            e.currentTarget.style.color = '#9B1C1C'
            e.currentTarget.style.borderColor = '#FCA5A5'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#fff'
            e.currentTarget.style.color = '#6B7280'
            e.currentTarget.style.borderColor = '#E5E7EB'
          }}
        >
          <LogOut size={14} strokeWidth={1.8} />
          Sair
        </button>
      </div>
    </aside>
  )
}