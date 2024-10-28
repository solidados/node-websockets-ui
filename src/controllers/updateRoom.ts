import { db } from '../db';
import { updateRoomsResponse } from '../utils/handleResponseMessages';

const updateRooms = () => {
  const { sockets, rooms } = db;

  Object.keys(sockets).forEach((key) =>
    sockets[key].send(updateRoomsResponse(rooms)),
  );
  console.log('Message sent:', updateRoomsResponse(rooms));
};

export default updateRooms;
