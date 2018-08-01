async function inputAPIKey() {
    let api_key = await $input.text({
        type: $kbType.default,
        placeholder: "API_KEY"
      });
    console.log("Input API_KEY = " + api_key);
    return api_key;
}

function getAPIKey() {
    let data = $cache.get("API_KEY");

    if (typeof data != "undefined") {
        console.log("Cached API_KEY = " + data);
        return data;
    } else {
        return null;
    }
}

function saveAPIKey(apiKey) {
    if (typeof apiKey == "undefined") return apiKey;
    $cache.set("API_KEY", apiKey);
    return apiKey;
}

function removeAPIKey() {
    $cache.remove("API_KEY");
}

module.exports = {
    inputAPIKey: inputAPIKey,
    getAPIKey: getAPIKey,
    saveAPIKey: saveAPIKey,
    removeAPIKey: removeAPIKey
}