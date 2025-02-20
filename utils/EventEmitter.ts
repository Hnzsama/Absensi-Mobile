type Listener = (...args: any[]) => void;

export class EventEmitter {
    private listeners: { [key: string]: Listener[] } = {};

    addListener(event: string, listener: Listener): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    removeListener(event: string, listener: Listener): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    }

    removeAllListeners(event?: string): void {
        if (event) {
            delete this.listeners[event];
        } else {
            this.listeners = {};
        }
    }

    emit(event: string, ...args: any[]): void {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(listener => listener(...args));
    }
}
