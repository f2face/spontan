import EventEmitter from 'eventemitter3';

/**
 * Represents the configuration options for the Spontan class.
 */
export type SpontanOptions = {
    /**
     * Whether to enable debugging mode.
     */
    debug: boolean;
};

/**
 * Represents the state of the Spontan instance as a key-value store.
 */
export type State = { [property: string]: unknown };

/**
 * The Spontan class is a simple state management library with event handling capabilities.
 */
export class Spontan {
    private state: State; // The internal state of the Spontan instance.
    private options: SpontanOptions; // Configuration options.
    private eventEmitter: EventEmitter; // Event emitter to handle property changes.

    /**
     * Creates a new Spontan instance.
     * @param initialState - The initial state of the Spontan instance (default is an empty object).
     * @param options - Configuration options (default is { debug: false }).
     */
    public constructor(initialState: State = {}, options?: SpontanOptions) {
        this.state = initialState || {};
        this.options = options || { debug: false };
        this.eventEmitter = new EventEmitter();
    }

    /**
     * Emits a change event when a state property is modified.
     * @param property - The name of the property that changed.
     * @param oldValue - The previous value of the property.
     * @param newValue - The new value of the property.
     * @private
     */
    private _notifyChange<O, N>(property: keyof State, oldValue: O, newValue: N) {
        this.eventEmitter.emit('*', property, oldValue, newValue);
        this.eventEmitter.emit(property.toString(), oldValue, newValue);
    }

    /**
     * Returns the event emitter associated with the Spontan instance.
     * @returns An instance of the EventEmitter class.
     */
    getEventEmitter(): EventEmitter {
        return this.eventEmitter;
    }

    /**
     * Returns a read-only copy of the current state.
     * @returns A read-only snapshot of the state.
     */
    getState(): Readonly<State> {
        return Object.freeze({ ...this.state });
    }

    /**
     * Sets a new state for multiple state properties.
     * @param newState - The new state to apply.
     */
    setState(newState: State) {
        for (const [prop, value] of Object.entries(newState)) {
            this.setProperty(prop, value);
        }
    }

    /**
     * Clears all state properties. This method does not emit any events.
     */
    clearState() {
        this.state = {};
    }

    /**
     * Sets a new value for a state property and emits a change event if the value changes.
     * @param property - The name of the property to update.
     * @param newValue - The new value to set for the property.
     */
    setProperty<N>(property: keyof State, newValue: N) {
        if (JSON.stringify(this.state[property]) !== JSON.stringify(newValue)) {
            const oldValue = structuredClone(this.state[property]);
            this.state[property] = newValue;
            this._notifyChange(property, oldValue, newValue);
        }
    }

    /**
     * Adds a listener to be notified when a specific state property changes.
     * @param property - The name of the property to listen for changes.
     * @param listener - A callback function to execute when the property changes.
     */
    onChanged<O, N>(property: keyof State, listener: (oldValue: O, newValue: N) => void) {
        if (this.options.debug) {
            console.log(`Listening to "${property}" property.`);
        }
        this.eventEmitter.on(property.toString(), listener);
    }

    /**
     * Adds a listener to be notified when any state property changes.
     * @param listener - A callback function to execute when any property changes.
     */
    onAnyChanged<O, N>(listener: (property: keyof State, oldValue: O, newValue: N) => void) {
        if (this.options.debug) {
            console.log(`Listening to any property.`);
        }
        this.eventEmitter.on('*', listener);
    }
}
