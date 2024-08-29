import { ColumnManager } from "./../columnManager";
// import { CItem } from "../item";
// import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
// import { DBInterface } from "../../adapters/DBinterface";
// import { fromEvent, tap } from "rxjs";

jest.mock("../../adapters/DBinterface", () => ({
    DBInterface: {
        queueUpstream: jest.fn(),
    },
}));

describe("ColumnManager", () => {
    let columnManager: ColumnManager;

    beforeEach(() => {
        document.body.innerHTML = "<div id='wrapper'></div>";
        columnManager = new ColumnManager();
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("should create columns", () => {
        const columnNames = columnManager.columnNames;
        const createColumnSpy = jest.spyOn(columnManager, 'createColumn');

        columnNames.forEach((name) => {
            document.getElementById('wrapper')!.appendChild(columnManager.createColumn(name));
        });

        const wrapper = document.getElementById('wrapper')!;
        const columns = wrapper.querySelectorAll(".column");


        expect(createColumnSpy).toHaveBeenCalledTimes(columnNames.length);
        columnNames.forEach((name, index) => {
            expect(createColumnSpy).toHaveBeenCalledWith(name);
            expect(columns[index]).toHaveTextContent(name);
        });

        expect(columns).toHaveLength(columnNames.length);
    });
});