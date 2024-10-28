import { db } from '../db';
import { updateRoomsResponse } from '../utils';

const updateRooms = () => {
  const { sockets, rooms } = db;

  Object.keys(sockets).forEach((key) =>
    sockets[key].send(updateRoomsResponse(rooms)),
  );
  console.log(
    `\x1b[32mMessage sent: \x1b[92m${updateRoomsResponse(rooms)}\x1b[0m`,
  );
};

export default updateRooms;
