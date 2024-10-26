import { WebSocket } from 'ws';
import { RegistrationResponse } from '../types';

export function parseJSON<T>(data: string, ws: WebSocket): T | null {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error(
      `Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    sendError(ws, 'Invalid JSON format');
    return null;
  }
}

export function createResponse(
  name: string,
  id: string,
  error: boolean,
  errorText: string,
): RegistrationResponse {
  return {
    type: 'reg',
    data: JSON.stringify({ name, index: id, error, errorText }),
    id: 0,
  };
}

export function sendResponse(ws: WebSocket, response: RegistrationResponse) {
  try {
    ws.send(JSON.stringify(response));
  } catch (error) {
    console.error(
      `Error sending response: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    sendError(ws, 'Failed to send response');
  }
}

export function sendError(ws: WebSocket, errorText: string) {
  const errorResponse: RegistrationResponse = createResponse(
    '',
    '',
    true,
    errorText,
  );
  sendResponse(ws, errorResponse);
}
