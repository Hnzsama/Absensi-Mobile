import { EventEmitter } from '@/utils/EventEmitter';

class AuthEventEmitter extends EventEmitter {
    emitUnauthorized() {
        this.emit('unauthorized');
    }
}

export const authEvents = new AuthEventEmitter();
