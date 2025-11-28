import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

// Placeholder for emergency animation - you can replace this with actual Lottie JSON
const EmergencyAnimation = ({ className = '', fullScreen = false }) => {
  const [animationData, setAnimationData] = useState(null)

  useEffect(() => {
    // In a real app, you would load the Lottie JSON file here
    // Example: import emergencyAnimation from '../assets/emergency.json'
    // setAnimationData(emergencyAnimation)
    
    // For now, we'll use a CSS animation as fallback
    setAnimationData(null)
  }, [])

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

  // Enhanced CSS fallback emergency animation
  const size = fullScreen ? 'w-64 h-64 md:w-80 md:h-80' : 'w-32 h-32 md:w-40 md:h-40'
  const textSize = fullScreen ? 'text-6xl md:text-8xl' : 'text-4xl md:text-5xl'

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Main pulsing circle */}
        <div className={`${size} bg-emergency-red rounded-full flex items-center justify-center text-white ${textSize} font-bold animate-pulse shadow-2xl`}>
          🚨
        </div>
        
        {/* Expanding rings */}
        <div className={`absolute inset-0 ${size} bg-emergency-red rounded-full animate-ping opacity-75`}></div>
        <div className={`absolute inset-0 ${size} border-4 border-emergency-red rounded-full animate-pulse`}></div>
        
        {/* Additional outer ring for full screen */}
        {fullScreen && (
          <>
            <div className={`absolute inset-0 w-96 h-96 md:w-[28rem] md:h-[28rem] border-4 border-emergency-orange rounded-full animate-ping opacity-50`} style={{ animationDelay: '0.5s' }}></div>
            <div className={`absolute inset-0 w-[24rem] h-[24rem] md:w-[32rem] md:h-[32rem] border-4 border-white rounded-full animate-pulse opacity-30`} style={{ animationDelay: '1s' }}></div>
          </>
        )}
      </div>
      
      <style>{`
        @keyframes emergency-pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.9;
          }
        }
        .emergency-pulse {
          animation: emergency-pulse 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default EmergencyAnimation
