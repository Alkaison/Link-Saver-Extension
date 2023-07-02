const addNewLinkBtn = document.querySelector("#newLinkBtn");
const taskSectionBtn = document.querySelector(".task-section");
const nameInput = document.querySelector(".nameInput");
const linkInput = document.querySelector(".linkInput");
const linkContainer = document.querySelector(".links-container");
const inputContainer = document.querySelector(".addNewLink");
const confirmBtn = document.querySelector(".confirmInput");

const getNewLink = () => {
    inputContainer.style.display = "flex";
    addNewLinkBtn.setAttribute("disabled", "true");
    addNewLinkBtn.style.cursor = "not-allowed";
}

const saveNewLink = (username, link) => {

    // Convert the username and link to strings 
    const stringUsername = String(username).trim().toLowerCase().replaceAll(' ', '_');
    const stringLink = String(link).trim();

    // Store the value in Chrome's local storage 
    chrome.storage.local.set({
        [stringUsername]: stringLink
    }).then(() => {
        clearInputs();
        fetchInitialData();
    });
}

// delete the saved link from storage 
const deleteLink = (linkData) => {

    const linkName = linkData.querySelector(".link-title").textContent.substring(1);

    chrome.storage.local.remove(linkName).then(() => {
        fetchInitialData();
    });
}

const validateInputs = () => {

    let emptyInput = false;

    const handleEmptyInput = (input) => {
        input.previousElementSibling.classList.add("active");
        emptyInput = true;
    };

    const handleValidInput = (input) => {
        input.previousElementSibling.classList.remove("active");
    };

    if (nameInput.value === '')
        handleEmptyInput(nameInput);
    else
        handleValidInput(nameInput);

    if (linkInput.value === '' || !(linkInput.validity.valid))
        handleEmptyInput(linkInput);
    else
        handleValidInput(linkInput);

    if (emptyInput)
        return false;
    else
        saveNewLink(nameInput.value, linkInput.value);
}

const clearInputs = () => {

    // clear the inputs 
    nameInput.value = '';
    linkInput.value = '';

    // reset the error messages 
    nameInput.previousElementSibling.classList.remove("active");
    linkInput.previousElementSibling.classList.remove("active");

    // reset the addNewLink button 
    inputContainer.style.display = "none";
    addNewLinkBtn.removeAttribute("disabled");
    addNewLinkBtn.style.cursor = "pointer";
}

// check clicked button 
taskSectionBtn.addEventListener("click", (e) => {
    const clickedBtn = (e.target.tagName === "BUTTON") ? e.target : e.target.parentElement;
    const getIdName = clickedBtn.id;

    if(getIdName === "newLinkBtn")
        getNewLink();
    else if (getIdName === "githubBtn")
        window.open("https://github.com/Alkaison/Link-Saver-Extension/");

});

// check clicked button 
confirmBtn.addEventListener("click", (e) => {
    const clickedBtn = e.target;
    const getClassName = clickedBtn.className;

    if(getClassName === "addBtn")
        validateInputs();
    else if(getClassName === "cancelBtn")
        clearInputs();
});

// check delete button click 
linkContainer.addEventListener("click", (e) => {

    const getClickedLink = (e.target.tagName === "BUTTON" && e.target.className === "link-delete") ? e.target.parentElement.parentElement : (e.target.className === "fa-solid fa-trash") ? e.target.parentElement.parentElement.parentElement : null;

    if(getClickedLink)
        deleteLink(getClickedLink);
});

// load key, value pairs data from chrome local storage 
const loadData = async () => {
    
    const data = await new Promise((resolve) => {
        chrome.storage.local.get(null, (result) => {
            if (result === null || result === undefined) {
                resolve([]);
            } else {
                resolve(result);
            }
        });
    });

    const jsonData = JSON.stringify(data);
    return jsonData;
};

// list all the data from chrome storage to the UI 
const fetchInitialData = async () => {
    
    const jsonData = await loadData();
    const parsedData = JSON.parse(jsonData);

    linkContainer.innerHTML = '';

    // check whether the data is empty or not 
    if (Object.keys(parsedData).length === 0 && parsedData.constructor === Object) 
    {
        const noLinkFound = `<div class="noLinkFound">
                                <p>No links found, please try to add one by clicking the "+ Add Link" button.</p>
                            </div>`;

        // append it into container 
        linkContainer.insertAdjacentHTML("beforeend", noLinkFound);
    } 
    else 
    {
        for(const key in parsedData)
        {
            const linkContentBody = `<div class="link">
                                        <div class="link-context">
                                            <p class="link-title">$${key}</p>
                                            <p class="link-desc">${parsedData[key]}</p>
                                        </div>
        
                                        <div class="link-button">
                                            <button class="link-delete" title="Delete" type="button"><i class="fa-solid fa-trash"></i></button>
                                        </div>
                                    </div>`;
        
            // append it into container 
            linkContainer.insertAdjacentHTML("beforeend", linkContentBody);
        }
    }
}

// initial fetching data from storage 
fetchInitialData();
