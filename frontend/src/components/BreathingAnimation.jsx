import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

// Placeholder for breathing animation - you can replace this with actual Lottie JSON
const BreathingAnimation = ({ className = '', fullScreen = false }) => {
  const [animationData, setAnimationData] = useState(null)
  const [breathPhase, setBreathPhase] = useState('inhale') // 'inhale', 'hold', 'exhale'

  useEffect(() => {
    // In a real app, you would load the Lottie JSON file here
    // Example: import breathingAnimation from '../assets/breathing.json'
    // setAnimationData(breathingAnimation)
    
    // For now, we'll use a CSS animation as fallback
    setAnimationData(null)
  }, [])

  // Breathing cycle: 4s inhale, 2s hold, 4s exhale, 2s pause
  useEffect(() => {
    if (!animationData) {
      let timeouts = []
      
      const cycle = () => {
        setBreathPhase('inhale')
        timeouts.push(setTimeout(() => {
          setBreathPhase('hold')
          timeouts.push(setTimeout(() => {
            setBreathPhase('exhale')
            timeouts.push(setTimeout(() => {
              setBreathPhase('pause')
              timeouts.push(setTimeout(cycle, 2000))
            }, 4000))
          }, 2000))
        }, 4000))
      }
      
      cycle()
      
      return () => {
        timeouts.forEach(clearTimeout)
      }
    }
  }, [animationData])

  if (animationData) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Lottie 
          animationData={animationData} 
          loop={true}
          style={fullScreen ? { width: '100%', height: '100%' } : {}}
        />
      </div>
    )
  }

  // Enhanced CSS breathing animation with instructions - Responsive sizing
  const size = fullScreen 
    ? 'w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72' 
    : 'w-24 h-24 md:w-32 md:h-32'
  const scale = breathPhase === 'inhale' ? 'scale-125' : breathPhase === 'exhale' ? 'scale-75' : 'scale-100'
  const duration = breathPhase === 'inhale' || breathPhase === 'exhale' ? 'duration-[4000ms]' : 'duration-[2000ms]'

  const getInstruction = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe In...'
      case 'hold':
        return 'Hold...'
      case 'exhale':
        return 'Breathe Out...'
      case 'pause':
        return 'Pause...'
      default:
        return 'Breathe...'
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer circle - breathing */}
        <div className={`${size} bg-gradient-to-br from-teal-400 to-teal-600 rounded-full transition-transform ${duration} ease-in-out ${scale} shadow-lg`}></div>
        
        {/* Inner circle - pulse effect */}
        <div className={`absolute inset-4 ${size} bg-teal-300 rounded-full animate-ping opacity-50`} style={{ 
          width: 'calc(100% - 2rem)', 
          height: 'calc(100% - 2rem)',
          animationDuration: breathPhase === 'inhale' || breathPhase === 'exhale' ? '4s' : '2s'
        }}></div>
        
        {/* Center dot */}
        <div className="absolute inset-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md"></div>
      </div>
      
      {/* Instruction text */}
      {fullScreen && (
        <p className="mt-6 md:mt-8 text-white text-xl md:text-2xl lg:text-3xl font-semibold animate-pulse">
          {getInstruction()}
        </p>
      )}
      
      <style>{`
        @keyframes breathe-in {
          0% { transform: scale(1); }
          100% { transform: scale(1.25); }
        }
        @keyframes breathe-out {
          0% { transform: scale(1.25); }
          100% { transform: scale(0.75); }
        }
        @keyframes breathe-hold {
          0%, 100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default BreathingAnimation
