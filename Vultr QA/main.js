const VERSION = "1.0.0";
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

async function checkUpdate() {
    let resp = await $http.get("https://github.com/tete1030/Vultr-Quick-Access/raw/master/release/version.json");
    if (resp.error === null) {
        let versionInfo = resp.data;
        console.log("Current version: " + VERSION);
        console.log("Remote version: " + versionInfo.version);
        if (versionInfo.version !== VERSION) {
            let confirm = await $ui.alert({
                title: "Update",
                message: "A new version detected: " + versionInfo.version + "\n" + versionInfo.log + "\n\nProceed updating?",
                actions: ["OK", "Cancel"]
            });
            console.log("Alert result = " + confirm.title);
            if (confirm.title != "OK") {
                console.log("User cancelled server destroying");
                return;
            }
            let url = versionInfo.url || "https://github.com/tete1030/Vultr-Quick-Access/raw/master/release/release.box";
            $app.openURL("jsbox://install?name=" + encodeURIComponent($addin.current.name) + "&url=" + encodeURIComponent(url));
            $app.close();
        }
    } else {
        console.error("Error while update: \n" + 
                      `error = {code: ${resp.error.code}, domain: ${resp.error.domain}, localizedDescription: ${resp.error.localizedDescription}}\n` + 
                      `resp.data = ${resp.data}`);
    }
}

checkUpdate();

main();
