import { useState, useEffect, useRef } from 'react'
import ThreeDContainer from './components/ThreeDContainer'
import './App.css'

function App() {
  const [copied, setCopied] = useState(false)
  const [imageSrc, setImageSrc] = useState("img2.png")
  const [showSplash, setShowSplash] = useState(false)
  const [typedText, setTypedText] = useState('')
  const audioRef = useRef(null)
  const [audioStarted, setAudioStarted] = useState(false)

  const [ca, setCa] = useState('')
  const [twitterLink, setTwitterLink] = useState('')
  const [telegramLink, setTelegramLink] = useState('')
  const [metaInfo, setMetaInfo] = useState([])

  // Fetch data from API
  useEffect(() => {
  fetch('https://re9tawzde2.execute-api.us-west-1.amazonaws.com/stage1/API/FetchData')
    .then(response => response.json())
    .then(data => {
      // Parse the stringified body
      const parsedBody = JSON.parse(data.body);
      if (Array.isArray(parsedBody) && parsedBody.length > 0) {
        const info = parsedBody[0];
        setCa(info.ca);
        setTwitterLink(info.twitter_link);
        setTelegramLink(info.telegram_link);
        setMetaInfo(Array.isArray(info.meta_info) ? info.meta_info : []);
      }
    })
    .catch(error => console.error('Error fetching API data:', error));
  }, [])

  // Copy contract address
  const handleCopy = () => {
    if (!ca) return;
    navigator.clipboard.writeText(ca).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  // Toggle image if multiple frames
  const images = ["img1.png", "img2.png"]
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % images.length
      setImageSrc(images[index])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Start audio on first user click
  useEffect(() => {
    const handleFirstClick = () => {
      if (!audioStarted && audioRef.current) {
        audioRef.current.play()
        setAudioStarted(true)
      }
    }
    window.addEventListener('click', handleFirstClick)
    return () => window.removeEventListener('click', handleFirstClick)
  }, [audioStarted])

  // Optional splash screen typing effect
  useEffect(() => {
    if (showSplash) {
      const message = 'Loading TOM...'
      let i = 0
      const interval = setInterval(() => {
        setTypedText(message.slice(0, i + 1))
        i++
        if (i === message.length) clearInterval(interval)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [showSplash])

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
        whiteSpace: 'pre'
      }}>
        {typedText}
      </div>
    )
  }

  return (
    <>
      <audio ref={audioRef} src="/tom.mp3" preload="auto" />

      <ThreeDContainer />

      {/* Pump.fun Link */}
      <a href={`https://pump.fun/coin/${ca}?include-nsfw=true`} target="_blank" rel="noopener noreferrer" style={{
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

      {/* Twitter Link */}
      {twitterLink && (
        <a href={twitterLink} target="_blank" rel="noopener noreferrer" style={{
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
      )}

      {/* Telegram Link */}
      {telegramLink && (
        <a href={telegramLink} target="_blank" rel="noopener noreferrer" style={{
          position: 'fixed',
          top: twitterLink ? '60px' : '10px',
          right: '10px',
          fontFamily: "'Press Start 2P', cursive, sans-serif",
          fontSize: '1.8rem',
          color: 'white',
          textShadow: '2px 2px 0 #000',
          zIndex: 20,
          textDecoration: 'none',
          cursor: 'pointer'
        }}>
          Telegram
        </a>
      )}

      {/* Bottom Info */}
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
        <img style={{ width: "200px" }} src={imageSrc} alt="Animated meme" className="meme-image" />
        <br />
        CA: {ca}{' '}
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

      {/* Main Content */}
      <div className="content">
        <h1 className="title">LUKE</h1>
        <p className="subtitle">Two things are infinite: the universe and human stupidity; and I’m not sure about the universe.</p>
        {metaInfo.map((info, index) => (
          <p key={index} style={{ fontSize: '0.8rem', marginTop: '10px' }}>{info}</p>
        ))}
      </div>
    </>
  )
}

export default App
