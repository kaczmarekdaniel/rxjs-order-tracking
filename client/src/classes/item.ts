import { DBInterface } from "../adapters/DBinterface";
import { TItem } from "../types/main";
import {
    filter,
    fromEvent,
    map,
    pipe,
    switchMap,
    takeUntil,
    tap,
} from "rxjs";

export class CItem {
    public element: HTMLLIElement;
    private item: TItem;

    constructor(item: TItem) {
        this.item = item;
        this.element = pipe(
            this.createNode,
            this.attachEvents.bind(this)
            )(item);
    }

    createNode(item: TItem): HTMLLIElement {
        const li = document.createElement("li");
        li.className = "column__listing-item";
        li.draggable = true;
        li.textContent = item.name;

        return li;
    }

    attachEvents(element: HTMLLIElement) {
        const dragStart$ = fromEvent<DragEvent>(element, "dragstart").pipe(
            map((event) => {
                event.dataTransfer?.setData("text/plain", element.id);
                return element;
            })
        );

        const dragEnd$ = fromEvent<DragEvent>(element, "dragend");

        const drag$ = dragStart$.pipe(
            switchMap((draggedItem) =>
                fromEvent<DragEvent>(document, "dragover").pipe(
                    takeUntil(dragEnd$),
                    map((event) => {
                        const dropTarget = document.elementFromPoint(
                            event.clientX,
                            event.clientY
                        ) as HTMLElement;

                        return { event, draggedItem, dropTarget };
                    })
                )
            )
        );

        drag$
            .pipe(
                map(({ event, draggedItem, dropTarget }) => {
                    event.preventDefault();

                    const isColumn =
                        dropTarget?.classList.contains("column__listing");
                    const isItem = dropTarget?.classList.contains(
                        "column__listing-item"
                    );

                    return { draggedItem, dropTarget, isColumn, isItem };
                }),
                filter(({ isColumn, isItem }) => isColumn || isItem), 
                tap(({ isColumn, isItem, draggedItem, dropTarget }) => {
                    if (isColumn) {
                        dropTarget!.appendChild(draggedItem);
                    } else if (isItem) {
                        const parent = dropTarget!.parentElement;
                        parent?.insertBefore(draggedItem, dropTarget!);
                    }
                })
            )
            .subscribe();

        dragEnd$.subscribe(() => {      
            DBInterface.queueUpstream(this.item);
        });

        return element;
    }
}
