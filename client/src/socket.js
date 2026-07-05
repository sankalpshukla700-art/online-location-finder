import{io} from"socket.io-client";
const socket = io("http://localhost:4000")
export const joinRoom = (roomId) => {
    socket.emit("join_room", roomId);
}

export const emitLocationUpdate = (location) => {
    socket.emit('locationUpdat', location);
}


export const listenForLocationUpdates = (callback) => {
    socket.on('user-offline', callback)
}

// Add listenForUsersUpdated to match App.jsx import
export const listenForUsersUpdated = (callback) => {
    socket.on('users-updated', callback);
}

export default socket;