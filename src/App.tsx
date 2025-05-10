import { useState } from 'react'
import ThreeDContainer from './components/ThreeDContainer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [copied, setCopied] = useState(false)

  const contractAddress = '12e1241245pump'

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500) // Mensaje temporal
    })
  }

  return (
    <>
      <ThreeDContainer />
      {/* Esquinas */}
      <a href="https://pump.fun" target="_blank" rel="noopener noreferrer" style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        fontFamily: "'Press Start 2P', cursive, sans-serif",
        fontSize: '0.8rem',
        color: 'white',
        textShadow: '2px 2px 0 #000',
        zIndex: 20,
        textDecoration: 'none',
        cursor: 'pointer'
      }}>
        pumpfun
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        fontFamily: "'Press Start 2P', cursive, sans-serif",
        fontSize: '0.8rem',
        color: 'white',
        textShadow: '2px 2px 0 #000',
        zIndex: 20,
        textDecoration: 'none',
        cursor: 'pointer'
      }}>
        X
      </a>

      {/* CA + COPY */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'Press Start 2P', cursive, sans-serif",
        fontSize: '0.6rem',
        color: 'white',
        textShadow: '2px 2px 0 #000',
        zIndex: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '4px 8px',
        borderRadius: '8px'
      }}>
        CA: {contractAddress} {' '}
        <button 
          style={{
            background: '#ff69b4',
            color: 'white',
            border: 'none',
            padding: '2px 6px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: "'Press Start 2P', cursive, sans-serif",
            fontSize: '0.6rem',
            textShadow: '2px 2px 0 #000',
          }}
          onClick={handleCopy}
        >
          COPY
        </button>
        {copied && <span style={{ marginLeft: '10px', color: '#00ff00' }}>Copied!</span>}
      </div>

      {/* Contenido central */}
      <div className="content">
        <h1 className="title">LUKE</h1>
        <p className="subtitle">The most legendary meme coin on the blockchain </p>
        <button className="btn-meme" onClick={() => setCount(count + 1)}>
          Clicks: {count}
        </button>
      </div>
    </>
  )
}

export default App
