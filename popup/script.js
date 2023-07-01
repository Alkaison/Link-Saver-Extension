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

const addLinkToDisplay = (name, link) => {

    // get current month and day 
    const date = new Date();

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];

    const today = date.getDate();
    const newDate = today < 10 ? '0' + today : today;

    const linkContentBody = `<div class="link">
                                <div class="link-context">
                                    <p class="link-title">$${name}</p>
                                    <p class="link-desc">${link}</p>
                                    <p class="link-date"><i class="fa-regular fa-calendar"></i> ${month} ${newDate}</p>
                                </div>

                                <div class="link-button">
                                    <button class="link-delete" title="Delete" type="button"><i class="fa-solid fa-trash"></i></button>
                                </div>
                            </div>`;

    // append it into container 
    linkContainer.insertAdjacentHTML("beforeend", linkContentBody);

    // disable the input box 
    clearInputs();
}

const saveNewLink = (username, link) => {

    // Convert the username and link to strings 
    const stringUsername = String(username).trim().toLowerCase().replaceAll(' ', '_');
    const stringLink = String(link).trim();

    // Store the value in Chrome's local storage 
    chrome.storage.local.set({
        [stringUsername]: stringLink
    }).then(() => {
        addLinkToDisplay(stringUsername, stringLink);
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
