import { BehaviorSubject, Observable, Subject } from "rxjs";
import { TItem } from "../types/main";
import { tap } from "rxjs/operators";

class DatabaseConnector {
    private downstream$: BehaviorSubject<TItem[]>;
    private upstream$: Subject<TItem>;
    private ws: WebSocket = new WebSocket("ws://localhost:9001");

    constructor() {
        this.downstream$ = new BehaviorSubject<TItem[]>([]);
        this.upstream$ = new Subject<TItem>();
        this.setupSocketConnection();
        this.logUpstreamData();
    }

    initialize(): {
        downstream$: Observable<TItem[]>;
        upstream$: Observable<TItem>;
    } {
        return {
            downstream$: this.downstream$.asObservable(),
            upstream$: this.upstream$.asObservable(),
        };
    }

    queueUpstream(item: TItem): void {
        // const updatedValue = [...this.upstream$.value, item];
        this.upstream$.next(item);
    }

    updateDownstream(newItems: TItem[]): void {
        let updatedValue: TItem[] = [...this.downstream$.value];

        if (Array.isArray(newItems)) {
            updatedValue = [...updatedValue, ...newItems];
        } else {
            const newItem: TItem = newItems;
            const filteredItems = updatedValue.filter(
                (item) => item.id !== newItem.id
            );
            updatedValue = [...filteredItems, newItems];
        }

        this.downstream$.next(updatedValue);
    }

    subscribeToDownstream(onNewItems: (items: TItem[]) => void): void {
        this.downstream$.pipe(tap(onNewItems)).subscribe();
    }

    private logUpstreamData(): void {
        this.upstream$.subscribe((data) => {
            this.ws.send(JSON.stringify(data));
        });
    }

    private setupSocketConnection(): void {
        this.ws.onmessage = (event) => {
            this.updateDownstream(JSON.parse(event.data));
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }
}

class DatabaseService {
    private dbConnector: DatabaseConnector;

    constructor() {
        this.dbConnector = new DatabaseConnector();
    }

    initialize(): {
        downstream$: Observable<TItem[]>;
        upstream$: Observable<TItem>;
    } {
        return this.dbConnector.initialize();
    }

    queueUpstream(item: TItem): void {
        this.dbConnector.queueUpstream(item);
    }

    updateDownstream(newItems: TItem[]): void {
        this.dbConnector.updateDownstream(newItems);
    }

    subscribeToDownstream(onNewItems: (items: TItem[]) => void): void {
        this.dbConnector.subscribeToDownstream(onNewItems);
    }
}

export const DBInterface = new DatabaseService();
