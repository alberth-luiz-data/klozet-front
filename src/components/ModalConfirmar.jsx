import Modal from './Modal'

export default function ModalConfirmar({ mensagem, onConfirmar, onCancelar }) {
  return (
    <Modal titulo="Confirmar exclusão" onClose={onCancelar}>
      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px', lineHeight: 1.6 }}>
        {mensagem}
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancelar}
          style={{
            padding: '9px 16px', borderRadius: '8px',
            border: '1px solid #E5E7EB', background: '#fff',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          }}
        >Cancelar</button>
        <button
          onClick={onConfirmar}
          style={{
            padding: '9px 16px', borderRadius: '8px',
            border: 'none', background: '#DC2626', color: '#fff',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          }}
        >Sim, apagar</button>
      </div>
    </Modal>
  )
}