import "./styles/root.scss";
import "./styles/main.scss";

import { ColumnManager } from "./classes/columnManager";
import { TItem } from "./types/main";
import { DBInterface } from "./adapters/DBinterface";

// Initial data
const initialData: TItem[] = [
    { id: "1", category: "new", name: "Ball" },
    { id: "2", category: "new", name: "Jumprope" },
    { id: "3", category: "ready", name: "Roller" },
];



class Main {
    constructor() {
        new ColumnManager().init();
    }

  
}

// Initialize the application
new Main();
