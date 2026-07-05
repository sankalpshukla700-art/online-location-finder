let room = {};

const { calculateDistanceAndEta } = require('./controlers/locationControllers');

const handelSocketconnection = (socket, io) => {
    console.log('a user connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        socket.roomId = roomId;
        if (!room[roomId]) room[roomId] = {};
        room[roomId][socket.id] = {};
    });

    socket.on('locationUpdate', async(data) => {
        const {lat , lng} = data;
        const roomId = socket.roomId;
        if (!roomId) return;
        room[roomId][socket.id] = { lat, lng };

        //calculate distance and ESTIMATED TIME FOR ALL ROOM USERS
        const users = room[roomId];
        const updateUsers = await Promise.all(
            Object.keys(users).map(async (id) => {
                let distance = null , duration = null;
                if(users[socket.id] && users[id]){
                    try {
                        if(id !== socket.id){
                            const result = await calculateDistanceAndEta(users[id], users[socket.id]);
                            distance = result.distance;
                            duration = result.duration;
                        } 

                    } catch (error) {
                        distance = 'N/A';
                        duration = 'N/A';
                    }
                }
                return { userId : id,
                        lat: users[id].lat,
                        lng: users[id].lng,
                        distance,
                        eta:duration,

                    };
                

            })
            
        ) 
        io.to(roomId).emit('user-offline', updateUsers);  
    });

    socket.on('disconnect', () => {
        const roomId = socket.roomId;
        if (roomId && room[roomId]) {
            delete room[roomId][socket.id];
            io.to(roomId).emit('user-offline', Object.keys(room[roomId]).map(id => ({
                userId: id,
                ...room[roomId][id]
            })));
            if (Object.keys(room[roomId]).length === 0) {
                delete room[roomId];
            }

        }
    });
}

module.exports = {handelSocketconnection};

