/**
 * Socket.IO helper functions
 */

export const emitToRoom = (io, roomId, event, data) => {
  io.to(roomId).emit(event, data)
}

export const broadcastToAll = (io, event, data) => {
  io.emit(event, data)
}

export const getRoomMembers = (io, roomId) => {
  const room = io.sockets.adapter.rooms.get(roomId)
  return room ? Array.from(room) : []
}

