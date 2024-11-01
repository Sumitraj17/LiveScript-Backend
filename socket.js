const socketConnection = (io) => {
  const userMapping = {};

  // Store the latest code for each room (id)
  const latestCodeForRoom = {};

  const getAll = (id) => {
    return Array.from(io.sockets.adapter.rooms.get(id) || []).map(
      (socketId) => {
        return {
          socketId,
          username: userMapping[socketId],
        };
      }
    );
  };

  io.on("connection", (socket) => {
    console.log(`Socket Connected ${socket.id}`);

    // Handling when a user joins a room
    socket.on("join", ({ id, username }) => {
      userMapping[socket.id] = username;
      socket.join(id);

      // Fetch all clients in the room
      const clients = getAll(id);

      // Sync the latest code to the newly joined user
      if (latestCodeForRoom[id]) {
        io.to(socket.id).emit("code_change", { code: latestCodeForRoom[id] });
      }

      // Notify all clients about the joined user
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit("joined", {
          clients,
          socketId: socket.id,
          userName: username,
        });
      });
    });

    // Code Change Handling
    socket.on("code_change", ({ id, code,lang }) => {
      // Update the latest code for the room
      latestCodeForRoom[id] = code;

      // Emit code change to everyone in the room
      io.to(id).emit("code_change", { code,lang });
    });

    //handle output
    socket.on("output", ({ resp, id }) => {
      io.to(id).emit("response", { resp });
    });

    // Sync code for the specific socket (newly joined)
    socket.on("sync_code", ({ socketId, code, lang }) => {
      if (socket.id !== socketId) {
        io.to(socketId).emit("code_change", { code, lang });
      }
    });
    socket.on("language_change",({id,language,sId})=>{
      console.log("Language change triggered")
      io.to(id).emit("lang_change", {language,sId});
      
    })
    socket.on("recent_code", ({ socketId, id }) => {
      const code = latestCodeForRoom[id];
      io.to(socketId).emit("code_change", { code });
    });
    // Handle the run button click for all users
    socket.on("code_run", ({ socketId, id }) => {
      // Emit the 'click_run' event to all users in the room
      io.to(id).emit("click_run", {});
    });

    // Handle disconnection
    socket.on("disconnecting", () => {
      const rooms = [...socket.rooms];
      rooms.forEach((roomId) => {
        socket.in(roomId).emit("disconnected", {
          socketID: socket.id,
          userName: userMapping[socket.id],
        });
      });
      delete userMapping[socket.id];
      socket.leave();
    });
  });
};


export default socketConnection;