import EventEmitter from 'eventemitter3';

export type SpontanOptions = {
    debug: boolean;
};

export type State = { [property: string]: unknown };

export class Spontan {
    private state: State;
    private options: SpontanOptions;
    private eventEmitter: EventEmitter;

    public constructor(initialState: State = {}, options?: SpontanOptions) {
        this.state = initialState || {};
        this.options = options || { debug: false };
        this.eventEmitter = new EventEmitter();
    }

    /**
     * [Private method] Emit state property change.
     */
    private _notifyChange<T, U>(property: keyof State, oldValue: T, newValue: U) {
        this.eventEmitter.emit('*', property, oldValue, newValue);
        this.eventEmitter.emit(property.toString(), oldValue, newValue);
    }

    /**
     * Get event emmiter.
     */
    getEventEmitter(): EventEmitter {
        return this.eventEmitter;
    }

    /**
     * Get latest state (read-only).
     */
    getState(): object {
        return Object.freeze(structuredClone(this.state));
    }

    /**
     * Set new state for multiple state properties.
     */
    setState(newState: object) {
        for (const [prop, value] of Object.entries(newState)) {
            this.setProperty(prop, value);
        }
    }

    /**
     * Set new value for a state property.
     */
    setProperty(property: keyof State, newValue: unknown) {
        if (JSON.stringify(this.state[property]) !== JSON.stringify(newValue)) {
            const oldValue = structuredClone(this.state[property]);
            this.state[property] = newValue;
            this._notifyChange(property, oldValue, newValue);
        }
    }

    /**
     * Listen to the specific state property change.
     */
    onChanged(property: keyof State, listener: (oldValue: object, newValue: object) => void) {
        if (this.options.debug) {
            console.log(`Listening to "${property}" property.`);
        }
        this.eventEmitter.on(property.toString(), listener);
    }

    /**
     * Listen to the any state property change.
     */
    onAnyChanged(listener: (property: keyof State, oldValue: unknown, newValue: unknown) => void) {
        if (this.options.debug) {
            console.log(`Listening to any property.`);
        }
        this.eventEmitter.on('*', listener);
    }
}
