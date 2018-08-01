let vultrapi = require("scripts/vultrapi");
let mainview = require("scripts/mainview");
let apikey = require("scripts/apikey");

async function main(apiKey) {
    if (typeof apiKey == "undefined")
        apiKey = apikey.getAPIKey() || apikey.saveAPIKey(await apikey.inputAPIKey());
    if (typeof apiKey == "undefined")
        $app.close();
    let vultr = new vultrapi.VultrAPI(apiKey);
    mainview.renderMain(vultr, resetAPIKey);
}

async function resetAPIKey() {
    let apiKey = apikey.saveAPIKey(await apikey.inputAPIKey());
    if (typeof apiKey == "undefined")
        $app.close();
    main(apiKey);
}

main();
