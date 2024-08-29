import { CItem } from "../item";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { DBInterface } from "../../adapters/DBinterface";
import { fromEvent, tap } from "rxjs";

jest.mock("../../adapters/DBinterface", () => ({
    DBInterface: {
        queueUpstream: jest.fn(),
    },
}));


describe("CItem", () => {
    let item: CItem;

    beforeEach(() => { 
        document.body.innerHTML = ""; 
    });

    it("should create a list item element with the correct text", () => {
        document.body.innerHTML = "<ul></ul>";
        const list = document.querySelector("ul");
        const mockItemData = { id: "1", category: "new", name: "yoga mat" };

        item = new CItem(mockItemData);
        list?.appendChild(item.element);

        const listItem = screen
            .getAllByRole("listitem")
            .find((listitem) => listitem.textContent === "yoga mat");

        if (!listItem) {
            throw new Error(
                "List item with text 'yoga mat' was not found in the document"
            );
        }

        expect(listItem).toBeInTheDocument();
    });

    it("should trigger queueUpstream on dragEnd event", () => {
        const element = document.createElement("li");
        element.className = "column__listing-item";

        const dragEnd$ = fromEvent<DragEvent>(element, "dragend");

        dragEnd$.pipe(
            tap(() => {
                DBInterface.queueUpstream({ id: "1", category: "new", name: "yoga mat" });
            })
        ).subscribe();

        const event = new Event("dragend");
        element.dispatchEvent(event);

        expect(DBInterface.queueUpstream).toHaveBeenCalledWith({ id: "1", category: "new", name: "yoga mat" });
    });
});
