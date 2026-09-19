import '@/app/app.css';

export default function Loading(){
    return(
          <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--accent-primary)',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(16, 185, 129, 0.2)',
          borderTopColor: 'var(--accent-primary)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
    )
}

export  function LoadingTransaction({hight}:{hight:number}){
  return (
    <div className="loading-page">
      <div className="skeleton-content">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="skeleton-row" />
        ))}
      </div>

      <style>{`
        .loading-page {
          width: 100%;
          box-sizing: border-box;
        }

        .skeleton-content {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .skeleton-row {
          width: 100%;
          height: ${hight}px;
          background: #1f1f1f;
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        @keyframes skeleton-pulse {
          0%, 100% {
            opacity: 0.45;
          }

          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
