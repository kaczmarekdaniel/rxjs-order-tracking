import { TItem } from "./../types/main";
import { CItem } from "./item";
import { DBInterface } from "../adapters/DBinterface";

export class ColumnManager {
    private columns: { [category: string]: HTMLElement } = {};
    public columnNames = ["new", "ready", "inProgress", "shipped"];
    private wrapper: HTMLElement | undefined;

    

    init() {
        this.wrapper = this.getWrapperElement();

        this.initializeColumns();
        DBInterface.subscribeToDownstream(this.addItemsToColumns.bind(this));
    }

    private getWrapperElement(): HTMLElement {
        const wrapper = document.getElementById("wrapper");
        if (!wrapper) {
            throw new Error("Wrapper element not found");
        }
        return wrapper;
    }

    private initializeColumns(): void {
        this.columnNames.forEach((name) => {
            const column = this.createColumn(name);
            this.columns[name] = column;
            this.wrapper?.appendChild(column);
        });
    }

    public createColumn(name: string): HTMLElement {
        const column = document.createElement("div");
        column.className = "column";
        column.id = name;

        const title = this.createColumnTitle(name);
        column.appendChild(title);

        const listing = this.createColumnListing();
        column.appendChild(listing);

        return column;
    }

    private createColumnTitle(name: string): HTMLElement {
        const title = document.createElement("h2");
        title.textContent = name;
        return title;
    }

    private createColumnListing(): HTMLElement {
        const listing = document.createElement("ul");
        listing.className = "column__listing";
        return listing;
    }

    private addItemsToColumns(items: TItem[]): void {
        items.forEach((item) => {
            const column = this.columns[item.category];
            if (column) {
                const itemElement = new CItem(item).element;
                column.querySelector("ul")?.appendChild(itemElement);
            }
        });
    }
}
