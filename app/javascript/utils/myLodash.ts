export default {
    includes(
        listOfObject: any[],
        objectToFind: any
    ) {
        return !!listOfObject.find(obj => obj === objectToFind);
    }
};