import { BehaviorSubject, Observable, Subject } from "rxjs";
import { TItem } from "../types/main";
import { startWith, pairwise, map } from "rxjs/operators";

class DatabaseConnector {
    private downstream$: BehaviorSubject<TItem[]>;
    private upstream$: Subject<TItem>;

    constructor() {
        this.downstream$ = new BehaviorSubject<TItem[]>([]);
        this.upstream$ = new Subject<TItem>();
        this.simulateSocketConnection();
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
        // console.log(updatedValue);
        this.upstream$.next(item);
    }

    updateDownstream(newItems: TItem[]): void {
        const updatedValue = [...this.downstream$.value, ...newItems];
        this.downstream$.next(updatedValue);
    }

    subscribeToDownstream(onNewItems: (items: TItem[]) => void): void {
        this.downstream$
            .pipe(
                startWith([]),
                pairwise(),
                map(([previousItems, currentItems]) =>
                    this.filterNewItems(previousItems, currentItems)
                )
            )
            .subscribe(onNewItems);
    }

    private filterNewItems(
        previousItems: TItem[],
        currentItems: TItem[]
    ): TItem[] {
        if (previousItems.length === 0) return currentItems;

        return currentItems.filter(
            (newItem) =>
                !previousItems.some(
                    (previousItem) => previousItem.id === newItem.id
                )
        );
    }

    private logUpstreamData(): void {
        this.upstream$.subscribe((data) => {
            console.log("API call", data);
        });
    }

    private simulateSocketConnection(): void {
        // Simulated socket data
        setTimeout(
            () =>
                this.updateDownstream([
                    { id: "7", category: "inProgress", name: "test shoes" },
                    { id: "11", category: "shipped", name: "test" },
                ]),
            2000
        );

        // setTimeout(
        //     () =>
        //         this.queueUpstream([
        //             { id: "4", category: "inProgress", name: "Running shoes" },
        //             { id: "5", category: "shipped", name: "Tent" },
        //         ]),
        //     2000
        // );

        // setTimeout(
        //     () =>
        //         this.queueUpstream([
        //             { id: "6", category: "inProgress", name: "Running shoes" },
        //             { id: "7", category: "shipped", name: "Tent" },
        //         ]),
        //     2000
        // );

        setTimeout(
            () =>
                this.updateDownstream([
                    { id: "4", category: "inProgress", name: "Running shoes" },
                    { id: "5", category: "shipped", name: "Tent" },
                ]),
            2000
        );

        setTimeout(
            () =>
                this.updateDownstream([
                    { id: "6", category: "new", name: "yoga mat" },
                    { id: "7", category: "shipped", name: "Bike" },
                ]),
            3500
        );
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
