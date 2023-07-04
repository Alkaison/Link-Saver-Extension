let intervalTimer;

// Load key-value pairs data from Chrome local storage 
const loadData = () => {
    return new Promise((resolve) => {
        chrome.storage.local.get(null, (result) => {
            if (result === null || result === undefined)
                resolve([]);
            else
                resolve(result);
        });
    });
};

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
            const regex = /\$([a-zA-Z]+)/g;
            e.target.value = value.replaceAll(regex, (match, getKey) => {

                if (parsedData.hasOwnProperty(getKey))
                    return parsedData[getKey];
                
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
