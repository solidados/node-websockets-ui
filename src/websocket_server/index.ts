import { WebSocket, WebSocketServer } from 'ws';

interface Player {
  id: string;
  name: string;
  password: string;
  wins: number;
}

interface Room {
  id: string;
  players: Player[];
}

const players: Player[] = [];
const rooms: Room[] = [];

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
  console.log(`New Client connected`);

  ws.on('message', (message: string) => {
    const parsedMessage = JSON.parse(message);
    console.log(`Received: ${parsedMessage}`);

    handleMessage(ws, parsedMessage);
  });

  ws.on('close', () => {
    console.log(`Client was disconnected`);
  });
});

function handleMessage(ws: WebSocket, message: any) {
  switch (message.type) {
    case 'reg':
      registerPlayer(ws, message.data);
      break;
    case 'create_room':
      createRoom(ws);
      break;
    default:
      ws.send(JSON.stringify({ error: `Unknown command` }));
  }
}

function registerPlayer(
  ws: WebSocket,
  data: { name: string; password: string },
) {
  const existingPlayer: Player | undefined = players.find(
    (player: Player): boolean => player.name === data.name,
  );

  if (existingPlayer) {
    ws.send(
      JSON.stringify({
        type: 'reg',
        data: {
          name: data.name,
          index: existingPlayer.id,
          error: false,
          errorText: '',
        },
        id: 0,
      }),
    );
  } else {
    const newPlayer: Player = { id: crypto.randomUUID(), ...data, wins: 0 };
    players.push(newPlayer);
    ws.send(
      JSON.stringify({
        type: 'reg',
        data: {
          name: newPlayer.name,
          index: newPlayer.id,
          error: false,
          errorText: '',
        },
        id: 0,
      }),
    );
  }
}

function createRoom(ws: WebSocket) {
  const newRoom: Room = { id: crypto.randomUUID(), players: [] };
  rooms.push(newRoom);

  ws.send(
    JSON.stringify({
      type: 'create_room',
      data: {
        idGame: newRoom.id,
        idPlayer: crypto.randomUUID(),
        id: 0,
      },
    }),
  );
}

console.log(`WebSocket server started on PORT: ${8080}`);
