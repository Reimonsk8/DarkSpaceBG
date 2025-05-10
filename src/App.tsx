import { useState } from 'react'
import ThreeDContainer from './components/ThreeDContainer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ThreeDContainer />
      <div className="content">
        <h1 className="title">LUKE THE BOY</h1>
        <p className="subtitle">The most legendary meme coin on the blockchain 🌐🚀</p>
        <button className="btn-meme" onClick={() => setCount(count + 1)}>
          Clicks: {count}
        </button>
      </div>
    </>
  )
}

export default App
