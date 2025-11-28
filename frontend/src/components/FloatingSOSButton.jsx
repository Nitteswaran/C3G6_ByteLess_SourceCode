import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const FloatingSOSButton = () => {
  const navigate = useNavigate()
  const [isPressed, setIsPressed] = useState(false)

  const handleSOSClick = () => {
    // Navigate to AirSOS page and auto-activate emergency
    navigate('/air-sos?activate=true')
  }

  const handleLongPress = () => {
    // Long press for immediate emergency activation
    setIsPressed(true)
    const timer = setTimeout(() => {
      handleSOSClick()
      setIsPressed(false)
    }, 500)

    return () => clearTimeout(timer)
  }

  return (
    <button
      onClick={handleSOSClick}
      onMouseDown={handleLongPress}
      onTouchStart={handleLongPress}
      className={`fixed bottom-6 right-6 z-50 bg-emergency-red hover:bg-emergency-dark text-white rounded-full w-16 h-16 md:w-20 md:h-20 shadow-2xl flex items-center justify-center text-xl md:text-2xl font-bold transition-all duration-300 hover:scale-110 active:scale-95 ${
        isPressed ? 'animate-bounce' : 'animate-pulse'
      }`}
      aria-label="Emergency SOS"
    >
      <span className="text-white">SOS</span>
      
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-full bg-emergency-red animate-ping opacity-75"></span>
    </button>
  )
}

export default FloatingSOSButton
