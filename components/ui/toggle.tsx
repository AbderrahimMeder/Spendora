export const ToggleSwitch = ({
    checked,
    onChange,
    label,
    description,
    id,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
    label: string;
    description?: string;
    id?: string;
  }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: '#161616',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.2s ease',
      }}
      className="toggle-card hover:border-[#333333]"
    >
      <div style={{ paddingRight: '1rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>{label}</div>
        {description && (
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        style={{
          width: '46px',
          height: '26px',
          borderRadius: '9999px',
          background: checked ? 'var(--accent-primary)' : '#262626',
          border: '1px solid',
          borderColor: checked ? 'rgba(16, 185, 129, 0.4)' : '#333333',
          position: 'relative',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.2s ease',
          boxShadow: checked ? '0 0 12px rgba(16, 185, 129, 0.35)' : 'none',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '22px' : '3px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </button>
    </div>
  );