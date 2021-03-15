import * as _ from "lodash";
import __ from "../../app/javascript/utils/myLodash";

describe("Confirm my lodash works", () => {
    it("should return search for string", () => {
        const objectList = ["a", "b"];
        const objectToFind = "a";

        const lodashResult = _.includes(objectList, objectToFind)
        const myLodashResult = __.includes(objectList, objectToFind);

        expect(lodashResult).toBe(myLodashResult);
    })
});
