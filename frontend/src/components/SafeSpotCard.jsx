const SafeSpotCard = ({ safeSpot, onSelect }) => {
  if (!safeSpot) return null

  return (
    <div 
      className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-teal-500"
      onClick={() => onSelect && onSelect(safeSpot)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {safeSpot.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{safeSpot.address}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {safeSpot.amenities && safeSpot.amenities.map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
        
        <div className="ml-4 text-right">
          <div className="text-2xl mb-1">🛡️</div>
          {safeSpot.distance && (
            <p className="text-sm text-gray-600">{safeSpot.distance} km</p>
          )}
        </div>
      </div>
      
      {safeSpot.rating && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Safety Rating:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < safeSpot.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SafeSpotCard

