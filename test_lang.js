import Dramabox from "./src/services/Dramabox.js";

async function testLanguage() {
    console.log("Testing Language Support...");

    const dramaboxIn = new Dramabox("in");
    const dramaboxEn = new Dramabox("en");

    try {
        console.log("Fetching Home (IN)...");
        const resIn = await dramaboxIn.getDramaList(1, 1);
        const bookIn = resIn.book[0];
        console.log(`[IN] Book: ${bookIn.name}, Tags: ${JSON.stringify(bookIn.tags)}`);

        console.log("Fetching Home (EN)...");
        const resEn = await dramaboxEn.getDramaList(1, 1);
        const bookEn = resEn.book[0];
        console.log(`[EN] Book: ${bookEn.name}, Tags: ${JSON.stringify(bookEn.tags)}`);

        if (bookIn.name !== bookEn.name) {
            console.log("SUCCESS: Content differs by language.");
        } else {
            console.log("WARNING: Content appears similar.");
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

testLanguage();
