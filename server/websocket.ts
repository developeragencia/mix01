import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface ClientConnection {
  ws: WebSocket;
  userId?: number;
  matchId?: number;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server: server, 
      path: '/ws',
      clientTracking: true
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      const clientId = this.generateClientId();
      const connection: ClientConnection = { ws };
      
      this.clients.set(clientId, connection);
      
      console.log(`WebSocket client connected: ${clientId}`);

      // Send welcome message with error handling
      try {
        this.sendToClient(clientId, {
          type: 'connected',
          message: 'WebSocket connection established',
          clientId
        });
      } catch (error) {
        console.error('Error sending welcome message:', error);
      }

      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          // Send error response to client
          try {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
          } catch (sendError) {
            console.error('Failed to send error message:', sendError);
          }
        }
      });

      // Handle client disconnect
      ws.on('close', (code, reason) => {
        console.log(`WebSocket client disconnected: ${clientId}, code: ${code}, reason: ${reason.toString()}`);
        this.clients.delete(clientId);
      });

      // Handle errors with detailed logging
      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });

      // Handle unexpected response
      ws.on('unexpected-response', (request, response) => {
        console.error(`WebSocket unexpected response: ${response.statusCode}`);
      });
    });
  }

  private handleMessage(clientId: string, message: any) {
    const connection = this.clients.get(clientId);
    if (!connection) return;

    switch (message.type) {
      case 'join_chat':
        connection.userId = message.userId;
        connection.matchId = message.matchId;
        console.log(`User ${message.userId} joined chat ${message.matchId}`);
        break;

      case 'send_message':
        this.broadcastMessage(connection.matchId!, {
          type: 'new_message',
          message: message.data,
          senderId: connection.userId,
          timestamp: new Date().toISOString()
        });
        break;

      case 'typing_start':
        this.broadcastToMatch(connection.matchId!, connection.userId!, {
          type: 'user_typing',
          userId: connection.userId,
          isTyping: true
        });
        break;

      case 'typing_stop':
        this.broadcastToMatch(connection.matchId!, connection.userId!, {
          type: 'user_typing',
          userId: connection.userId,
          isTyping: false
        });
        break;

      case 'online_status':
        this.broadcastUserStatus(connection.userId!, {
          type: 'user_online',
          userId: connection.userId,
          isOnline: message.isOnline
        });
        break;

      default:
        console.log(`Unknown message type: ${message.type}`);
    }
  }

  private broadcastMessage(matchId: number, message: any) {
    this.clients.forEach((connection) => {
      if (connection.matchId === matchId && connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.send(JSON.stringify(message));
      }
    });
  }

  private broadcastToMatch(matchId: number, excludeUserId: number, message: any) {
    this.clients.forEach((connection) => {
      if (connection.matchId === matchId && 
          connection.userId !== excludeUserId && 
          connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.send(JSON.stringify(message));
      }
    });
  }

  private broadcastUserStatus(userId: number, message: any) {
    this.clients.forEach((connection) => {
      if (connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.send(JSON.stringify(message));
      }
    });
  }

  private sendToClient(clientId: string, message: any) {
    const connection = this.clients.get(clientId);
    if (connection && connection.ws.readyState === WebSocket.OPEN) {
      try {
        connection.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to client ${clientId}:`, error);
        // Remove broken connection
        this.clients.delete(clientId);
      }
    }
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Public methods for external use
  public notifyNewMatch(userId1: number, userId2: number) {
    this.clients.forEach((connection) => {
      if ((connection.userId === userId1 || connection.userId === userId2) && 
          connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.send(JSON.stringify({
          type: 'new_match',
          userId1,
          userId2,
          timestamp: new Date().toISOString()
        }));
      }
    });
  }

  public notifyNewMessage(matchId: number, message: any) {
    this.broadcastMessage(matchId, {
      type: 'new_message',
      message,
      timestamp: new Date().toISOString()
    });
  }

  public getConnectedUsers(): number[] {
    const users: number[] = [];
    this.clients.forEach((connection) => {
      if (connection.userId) {
        users.push(connection.userId);
      }
    });
    return users;
  }

  public getClientCount(): number {
    return this.clients.size;
  }
}