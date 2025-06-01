import { useState, useEffect, useRef } from 'react'
import ThreeDContainer from './components/ThreeDContainer'
import PigRainEffect from './components/PigRainEffect'
import './App.css'

function App() {
  const [copied, setCopied] = useState(false)
  const [imageSrc, setImageSrc] = useState("img2.png")
  const [showSplash, setShowSplash] = useState(false)
  const [typedText, setTypedText] = useState('')
  const audioRef = useRef(null)
  const [audioStarted, setAudioStarted] = useState(false)

  // Updated state for new JSON structure
  const [projectData, setProjectData] = useState(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [currentMultimedia, setCurrentMultimedia] = useState(0)

  // Fetch data from API (updated to handle new structure)
  useEffect(() => {
    fetch('https://re9tawzde2.execute-api.us-west-1.amazonaws.com/stage1/API/FetchData')
      .then(response => response.json())
      .then(data => {
        // Parse the stringified body
        const parsedBody = JSON.parse(data.body);
        if (Array.isArray(parsedBody) && parsedBody.length > 0) {
          setProjectData(parsedBody[0]);
          
          // Set the background image CSS variable if multimedia array exists
          if (parsedBody[0]?.multimedia && parsedBody[0].multimedia.length > 0) {
            document.documentElement.style.setProperty('--bg-image', `url("${parsedBody[0].multimedia[0]}")`);
          }
        }
      })
      .catch(error => console.error('Error fetching API data:', error));
  }, [])

  // Auto-cycle through sections
  useEffect(() => {
    if (projectData?.sections) {
      const interval = setInterval(() => {
        setCurrentSection(prev => 
          prev >= projectData.sections.length - 1 ? 0 : prev + 1
        );
      }, 6000); // Change section every 6 seconds
      
      return () => clearInterval(interval);
    }
  }, [projectData]);

  // Auto-cycle through multimedia
  useEffect(() => {
    if (projectData?.multimedia && projectData.multimedia.length > 1) {
      const interval = setInterval(() => {
        setCurrentMultimedia(prev => 
          prev >= projectData.multimedia.length - 1 ? 0 : prev + 1
        );
      }, 4000); // Change multimedia every 4 seconds
      
      return () => clearInterval(interval);
    }
  }, [projectData]);

  // Copy contract address
  const handleCopy = () => {
    if (!projectData?.ca) return;
    navigator.clipboard.writeText(projectData.ca).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

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
      const message = projectData?.title || 'Loading...'
      let i = 0
      const interval = setInterval(() => {
        setTypedText(message.slice(0, i + 1))
        i++
        if (i === message.length) clearInterval(interval)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [showSplash, projectData])

  if (showSplash) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
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

  const currentSectionData = projectData?.sections?.[currentSection]

  return (
    <>
      <audio ref={audioRef} src="/tom.mp3" preload="auto" />

      {/* <ThreeDContainer /> */}
      
      {/* Pig Rain Effect */}
      <PigRainEffect density={1} emoji="🐷" />

      {/* Pump.fun Link */}
      <a href={`https://pump.fun/coin/${projectData?.ca}?include-nsfw=true`} target="_blank" rel="noopener noreferrer" style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        fontFamily: "'Press Start 2P', cursive, sans-serif",
        fontSize: '1.8rem',
        color: 'purple',
        textShadow: '2px 2px 0 #000',
        zIndex: 20,
        textDecoration: 'none',
        cursor: 'pointer'
      }}>
        pump.fun
        <br></br>
        <img style={{width: '120px', height: '120px'}} src="https://pbs.twimg.com/media/GNKYIaaXMAApZY4.png" alt="pump.fun" />

      </a>

      {/* Twitter Link */}
      {projectData?.twitter_link && (
        <a href={projectData.twitter_link} target="_blank" rel="noopener noreferrer" style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          fontFamily: "'Press Start 2P', cursive, sans-serif",
          fontSize: '1.8rem',
          color: 'pink',
          textShadow: '2px 2px 0 #000',
          zIndex: 20,
          textDecoration: 'none',
          cursor: 'pointer'
        }}>
          X
        </a>
      )}

      {/* Telegram Link */}
      {projectData?.telegram_link && (
        <a href={projectData.telegram_link} target="_blank" rel="noopener noreferrer" style={{
          position: 'fixed',
          top: projectData.twitter_link ? '60px' : '10px',
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

      {/* Section Navigation Dots */}
      {projectData?.sections && projectData.sections.length > 1 && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 20
        }}>
          {projectData.sections.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSection(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: index === currentSection ? '#ff69b4' : 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid #fff'
              }}
            />
          ))}
        </div>
      )}

      {/* Background Multimedia */}
      {projectData?.multimedia && projectData.multimedia.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: -1,
          opacity: 1.0
        }}>
          <img
            src={projectData.multimedia[currentMultimedia]}
            alt="Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              // If image fails to load, try the next one or hide
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Bottom Contract Info */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'Press Start 2P', cursive, sans-serif",
        fontSize: '1rem',
        color: 'yellow',
        textShadow: '2px 2px 0 #000',
        zIndex: 20,
        padding: '4px 8px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <br />
        CA: {projectData?.ca}{' '}
        <button
          style={{
            background: '#ff69b4',
            color: 'white',
            border: 'none',
            padding: '2px 6px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: "'Press Start 2P', cursive, sans-serif",
            fontSize: '1.6rem',
            textShadow: '2px 2px 0 #000',
          }}
          onClick={handleCopy}
        >
          COPY
        </button>
        {copied && <span style={{ marginLeft: '10px', color: '#00ff00' }}>Copied!</span>}
      </div>

      {/* Main Content */}
      <div className="content" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 className="title" style={{
          fontFamily: "'Press Start 2P', cursive, sans-serif",
          fontSize: '2.5rem',
          color: '#ff69b4',
          textShadow: '3px 3px 0 #000',
          marginBottom: '20px',
          letterSpacing: '0.1em'
        }}>
          {projectData?.title || 'Loading...'}
        </h1>

        {/* Current Section Content */}
        {currentSectionData && (
          <div style={{
            maxWidth: '800px',
            backgroundColor: 'rgba(153, 67, 146, 0.8)',
            padding: '30px',
            borderRadius: '15px',
            border: '3px solidrgba(255, 105, 180, 0.49)',
            margin: '20px 0'
          }}>
            <h2 style={{
              fontFamily: "'Press Start 2P', cursive, sans-serif",
              fontSize: '1.5rem',
              color: '#00ff00',
              textShadow: '2px 2px 0 #000',
              marginBottom: '20px'
            }}>
              {currentSectionData.title}
            </h2>
            
            {currentSectionData.image_url && (
              <div style={{ marginBottom: '20px' }}>
                <img
                  src={currentSectionData.image_url}
                  alt={currentSectionData.title}
                  style={{
                    maxWidth: '300px',
                    maxHeight: '200px',
                    borderRadius: '10px',
                    border: '2px solid #fff'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <p style={{
              fontFamily: "'Press Start 2P', cursive, sans-serif",
              fontSize: '0.9rem',
              color: 'white',
              lineHeight: '1.6',
              textShadow: '1px 1px 0 #000'
            }}>
              {currentSectionData.text}
            </p>
          </div>
        )}

        {/* Section Progress Bar */}
        {projectData?.sections && projectData.sections.length > 1 && (
          <div style={{
            width: '300px',
            height: '4px',
            borderRadius: '2px',
            marginTop: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentSection + 1) / projectData.sections.length) * 100}%`,
              height: '100%',
              backgroundColor: '#ff69b4',
              transition: 'width 0.3s ease'
            }} />
          </div>
        )}
      </div>
    </>
  )
}

export default App