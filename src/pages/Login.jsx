import { useState } from 'react'
import { authService } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [dados, setDados] = useState({ username: '', password: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const atualiza = (campo, valor) => setDados(d => ({ ...d, [campo]: valor }))

  const entrar = async () => {
    if (!dados.username || !dados.password) {
      setErro('Preencha usuário e senha.')
      return
    }
    setCarregando(true)
    setErro('')
    try {
      const res = await authService.login(dados.username, dados.password)
      localStorage.setItem('token', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      navigate('/app')
    } catch {
      setErro('Usuário ou senha incorretos.')
    } finally {
      setCarregando(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') entrar()
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#F7F6F3',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      <div style={{
        background: '#fff', border: '1px solid #E4E2DC',
        borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '380px',
      }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Klozet<span style={{ color: '#8A8880', fontWeight: 300 }}>.</span>
          </div>
          <div style={{ fontSize: '13px', color: '#8A8880' }}>Entre na sua conta para continuar</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#8A8880', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Usuário
          </span>
          <input
            style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #E4E2DC', fontSize: '13.5px', outline: 'none', fontFamily: 'sans-serif' }}
            value={dados.username}
            onChange={e => atualiza('username', e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="seu usuário"
            autoFocus
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#8A8880', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Senha
          </span>
          <input
            type="password"
            style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #E4E2DC', fontSize: '13.5px', outline: 'none', fontFamily: 'sans-serif' }}
            value={dados.password}
            onChange={e => atualiza('password', e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
          />
        </div>

        {erro && (
          <div style={{ background: '#FEE2E2', color: '#9B1C1C', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            {erro}
          </div>
        )}

        <button
          onClick={entrar}
          disabled={carregando}
          style={{
            width: '100%', padding: '11px', borderRadius: '8px',
            border: 'none', background: '#1A1916', color: '#fff',
            fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            opacity: carregando ? 0.6 : 1, transition: 'opacity 0.15s',
          }}
        >{carregando ? 'Entrando...' : 'Entrar'}</button>
      </div>
    </div>
  )
}