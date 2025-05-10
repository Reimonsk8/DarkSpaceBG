import { useState, useEffect } from 'react'
import ThreeDContainer from './components/ThreeDContainer'
import './App.css'

function App() {
  const [copied, setCopied] = useState(false)
  const [imageSrc, setImageSrc] = useState("img1.png")
  const [showSplash, setShowSplash] = useState(true)
  const [typedText, setTypedText] = useState('')
  
  const splashText = "LUUKE: The cosmic meme awakens"
  const contractAddress = '12e1241245pump'

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  // Mostrar splash con animación máquina de escribir (1 seg aprox)
  useEffect(() => {
    let index = 0
    const typingSpeed = 1000 / splashText.length  // velocidad más rápida
    const typingInterval = setInterval(() => {
      setTypedText(prev => prev + splashText.charAt(index))
      index++
      if (index >= splashText.length) {
        clearInterval(typingInterval)
        setTimeout(() => setShowSplash(false), 300)  // espera breve al terminar
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [])

  // Cambiar imagen cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setImageSrc(prev => (prev === "img1.png" ? "img2.png" : "img1.png"))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  if (showSplash) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Press Start 2P', cursive, sans-serif",
        fontSize: '1.2rem',
        letterSpacing: '0.05em',
        textShadow: '2px 2px 0 #333',
        zIndex: 9999,
        whiteSpace: 'pre'   // 👈 esto evita el corte de la primera letra
      }}>
        {typedText}
      </div>
    )
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
        fontSize: '1.8rem',
        color: 'white',
        textShadow: '2px 2px 0 #000',
        zIndex: 20,
        textDecoration: 'none',
        cursor: 'pointer'
      }}>
        pump.fun
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        fontFamily: "'Press Start 2P', cursive, sans-serif",
        fontSize: '1.8rem',
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
        fontSize: '1rem',
        color: 'white',
        textShadow: '2px 2px 0 #000',
        zIndex: 20,
        padding: '4px 8px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <img style={{ width: "200px" }} src={imageSrc} alt="LUKE" className="meme-image" />
        <br />
        CA: {contractAddress}{' '}
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
        <p className="subtitle">Two things are infinite: the universe and human stupidity; and I’m not sure about the universe.</p>
      </div>
    </>
  )
}

export default App
