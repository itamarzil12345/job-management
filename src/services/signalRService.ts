import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { Job, JobProgressUpdate } from "../types/job";

export class SignalRService {
  private connection: HubConnection | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  constructor(private hubUrl: string) {}

  async connect(): Promise<void> {
    try {
      console.log("🔌 Connecting to SignalR hub:", this.hubUrl);

      this.connection = new HubConnectionBuilder()
        .withUrl(this.hubUrl)
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Exponential backoff
        .configureLogging(LogLevel.Information)
        .build();

      // Set up event handlers
      this.setupEventHandlers();

      // Start connection
      await this.connection.start();
      this.isConnected = true;
      this.reconnectAttempts = 0;

      console.log("✅ Connected to SignalR hub successfully");
    } catch (error) {
      console.error("❌ Failed to connect to SignalR hub:", error);
      this.isConnected = false;
      throw error;
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    // Handle connection state changes
    this.connection.onreconnecting((error) => {
      console.log("🔄 Reconnecting to SignalR hub...", error);
      this.isConnected = false;
    });

    this.connection.onreconnected((connectionId) => {
      console.log("✅ Reconnected to SignalR hub:", connectionId);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.connection.onclose((error) => {
      console.log("🔌 Disconnected from SignalR hub:", error);
      this.isConnected = false;

      // Attempt manual reconnection
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(
          `🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`
        );
        setTimeout(() => this.connect(), this.reconnectDelay);
      } else {
        console.error("❌ Max reconnection attempts reached");
      }
    });
  }

  // Subscribe to job progress updates
  onJobProgressUpdate(callback: (update: JobProgressUpdate) => void): void {
    if (!this.connection) {
      console.warn("⚠️ SignalR connection not established");
      return;
    }

    this.connection.on("UpdateJobProgress", (update: JobProgressUpdate) => {
      console.log("📡 Received job progress update:", update);
      callback(update);
    });
  }

  // Subscribe to jobs list updates
  onJobsUpdated(callback: (jobs: Job[]) => void): void {
    if (!this.connection) {
      console.warn("⚠️ SignalR connection not established");
      return;
    }

    this.connection.on("JobsUpdated", (jobs: Job[]) => {
      console.log("📡 Received jobs update:", jobs.length, "jobs");
      callback(jobs);
    });
  }

  // Unsubscribe from events
  offJobProgressUpdate(): void {
    if (this.connection) {
      this.connection.off("UpdateJobProgress");
    }
  }

  offJobsUpdated(): void {
    if (this.connection) {
      this.connection.off("JobsUpdated");
    }
  }

  // Check connection status
  getConnectionState(): string {
    if (!this.connection) return "Disconnected";
    return this.connection.state;
  }

  isHubConnected(): boolean {
    return this.isConnected && this.connection?.state === "Connected";
  }

  // Disconnect from hub
  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        this.isConnected = false;
        console.log("🔌 Disconnected from SignalR hub");
      } catch (error) {
        console.error("❌ Error disconnecting from SignalR hub:", error);
      }
    }
  }

  // Get connection statistics
  getConnectionInfo() {
    return {
      isConnected: this.isConnected,
      state: this.getConnectionState(),
      reconnectAttempts: this.reconnectAttempts,
      hubUrl: this.hubUrl,
    };
  }
}

// Create singleton instance
export const signalRService = new SignalRService(
  process.env.REACT_APP_SIGNALR_HUB_URL ||
    "https://localhost:5001/JobSignalRHub"
);
