import { LogEntry } from "../components/SystemLogs";

class LoggingService {
  private logs: LogEntry[] = [];
  private listeners: ((logs: LogEntry[]) => void)[] = [];
  private maxLogs = 200;

  addLog(
    level: LogEntry["level"],
    message: string,
    source?: LogEntry["source"]
  ) {
    const log: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
      source,
    };

    this.logs.push(log);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Notify listeners
    this.notifyListeners();
  }

  addInfo(message: string, source?: LogEntry["source"]) {
    this.addLog("info", message, source);
  }

  addSuccess(message: string, source?: LogEntry["source"]) {
    this.addLog("success", message, source);
  }

  addWarning(message: string, source?: LogEntry["source"]) {
    this.addLog("warning", message, source);
  }

  addError(message: string, source?: LogEntry["source"]) {
    this.addLog("error", message, source);
  }

  subscribe(callback: (logs: LogEntry[]) => void) {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback([...this.logs]));
  }
}

// Create a singleton instance
export const loggingService = new LoggingService();
