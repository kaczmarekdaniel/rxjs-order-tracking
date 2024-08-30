import "./styles/root.scss";
import "./styles/main.scss";

import { ColumnManager } from "./classes/columnManager";
import { TItem } from "./types/main";
import { DBInterface } from "./adapters/DBinterface";

class Main {
    constructor() {
        new ColumnManager().init();
    }
}

new Main();

