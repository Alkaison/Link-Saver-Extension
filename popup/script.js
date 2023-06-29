const addNewLinkBtn = document.querySelector("#newLinkBtn");
const taskSectionBtn = document.querySelector(".task-section");
const nameInput = document.querySelector(".nameInput");
const linkInput = document.querySelector(".linkInput");
const inputContainer = document.querySelector(".addNewLink");
const confirmBtn = document.querySelector(".confirmInput");

const getNewLink = () => {
    inputContainer.style.display = "flex";
    addNewLinkBtn.setAttribute("disabled", "true");
    addNewLinkBtn.style.cursor = "not-allowed";
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
    {
        console.log(nameInput.value);
        console.log(linkInput.value);
    }
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
