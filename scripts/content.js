let intervalTimer;

// Load key-value pairs data from Chrome local storage 
const loadData = () => {
    return new Promise((resolve) => {
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local)
        {
            chrome.storage.local.get(null, (result) => {
                if (chrome.runtime.lastError) {
                    resolve([]);
                } else {
                    resolve(result);
                }
            });
        } 
        else {
            resolve([]);
        }
    });
}

// Check if the input element is a text box 
const checkInputElement = async (e) => {
    
    const isInputBox = e.target.tagName === "INPUT";
    const isTextBox = e.target.tagName === "TEXTAREA";

    if (isInputBox || isTextBox) {
        const inputElement = e.target;
        const value = inputElement.value;

        const getIndexOfSign = value.lastIndexOf("$");

        if (getIndexOfSign !== -1)
        {
            const jsonData = await loadData();
            const parsedData = JSON.parse(JSON.stringify(jsonData));

            // check keys using regex 
            const regex = /\$([a-zA-Z0-9]+)/g;
            e.target.value = value.replaceAll(regex, (match, getKey) => {

                if (parsedData.hasOwnProperty(getKey))
                    return parsedData[getKey];
                else
                    return match;
            });
        }
    }
};

// Capture form text input events
document.addEventListener("input", (e) => {
    clearInterval(intervalTimer);
    intervalTimer = setTimeout(() => checkInputElement(e), 100);
});
