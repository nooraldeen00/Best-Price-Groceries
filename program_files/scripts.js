//Nooraldeen Alsmady

const overlay = document.querySelector(".overlay");
const editModal = document.querySelector("#editModal");
const deleteModal = document.querySelector("#deleteModal");

const deleteCancelBtn = document.querySelector(".delete-cancel-btn");
const editCancelBtn = document.querySelector(".edit-cancel-btn");
let deleteConfirmBtn = document.querySelector(".delete-confirm-btn");
let saveEditBtn = document.querySelector(".save-btn");
const newItemBtn = document.querySelector(".new-item-btn");

const deleteBtns = document.querySelectorAll(".delete-btn");
const editBtns = document.querySelectorAll(".edit-btn");

const editName = editModal.querySelector("#editName");
const editDescription = editModal.querySelector("#editDescription");
const editPrice = editModal.querySelector("#editPrice");

const feedbackBar = document.querySelector("#feedback-bar");


function toggleOverlay() {
    if (overlay.style.display === "none") {
        overlay.style.display = "block";
    } else {
        overlay.style.display = "none";
    }
}

function toggleDeleteModal() {
    if (deleteModal.style.display === "none") {
        deleteModal.style.display = "flex";
    } else {
        deleteModal.style.display = "none";
    }
}

function toggleEditModal() {
    if (editModal.style.display === "none") {
        editModal.style.display = "flex";
    } else {
        editModal.style.display = "none";
    }
}

deleteCancelBtn.addEventListener("click", () => {
    toggleOverlay()
    toggleDeleteModal();
})

editCancelBtn.addEventListener("click", () => {
    toggleOverlay()
    toggleEditModal();
})


function deleteFeedback(output) {
    if(output) {
        feedbackBar.innerHTML = "<p>Item successfully deleted.</p>"
        feedbackBar.style.backgroundColor = "#006100";
    } else {
        feedbackBar.innerHTML = "<p>Item failed to be deleted.</p>"
        feedbackBar.style.backgroundColor = "#B30000";
    }
    toggleFeedbackBar();
}

function updateFeedback(output) {
    if(output) {
        feedbackBar.innerHTML = "<p>Item successfully updated.</p>"
        feedbackBar.style.backgroundColor = "#006100";
    } else {
        feedbackBar.innerHTML = "<p>Item failed to update.</p>"
        feedbackBar.style.backgroundColor = "#B30000";
    }
    toggleFeedbackBar();
}

function insertFeedback(output) {
    if(output) {
        feedbackBar.innerHTML = "<p>Item successfully added.</p>"
        feedbackBar.style.backgroundColor = "#006100";
    } else {
        feedbackBar.innerHTML = "<p>Item failed to be added.</p>"
        feedbackBar.style.backgroundColor = "#B30000";
    }
    toggleFeedbackBar();
}

function toggleFeedbackBar() {
    feedbackBar.classList.remove("hide");
    feedbackBar.classList.add("show");

    setTimeout(() => {
        feedbackBar.classList.remove("show");
        feedbackBar.classList.add("hide");
    }, 3000);
}

// Sets modal title and inputs for editing
function setEditModal(itemId, itemName, itemDesc, itemSprice) {
    const editModalHeader = editModal.querySelector("h2");
    editModalHeader.innerHTML = "Edit Item " + itemId;

    editName.value = itemName;
    editDescription.value = itemDesc;
    editPrice.value = itemSprice.substring(1);
}

// Sets modal title and inputs for inserting
function setInsertModal() {
    const editModalHeader = editModal.querySelector("h2");
    editModalHeader.innerHTML = "New Item";

    editName.value = "";
    editDescription.value = "";
    editPrice.value = "";
}

// Update values in item row to edits
function updateItem(itemRow, editName, editDescription, editPrice) {
    itemRow.querySelector(".item_name").textContent = editName;
    itemRow.querySelector(".item_desc").textContent = editDescription;
    itemRow.querySelector(".item_sprice").textContent = "$" + editPrice;
}

function setInsert() {
    setInsertModal();
    toggleOverlay();
    toggleEditModal();

    // Clone the saveEditBtn to remove any existing event listeners
    const newSaveEditBtn = saveEditBtn.cloneNode(true);
    saveEditBtn.parentNode.replaceChild(newSaveEditBtn, saveEditBtn);

    // Assign the new saveEditBtn to the original variable
    saveEditBtn = newSaveEditBtn;

    saveEditBtn.addEventListener("click", (e) => {
        e.preventDefault();
        fetch("Handler.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "insert", name: editName.value, description: editDescription.value, price: editPrice.value })
        })
            .then(response => response.text())
            .then(text => {
                console.log("Raw response:", text);
                return JSON.parse(text);
            })
            .then(data => {
                if (data.success) {
                    searchItems();
                    insertFeedback(true);
                } else {
                    console.log("Failed to edit item.");
                    insertFeedback(false);
                }
            })
            .catch(error => console.error("Error:", error));
        toggleOverlay();
        toggleEditModal();
    })
}
newItemBtn.addEventListener("click", setInsert);

// Set the save button to edit specific itemRow
function setEdit(itemRow) {
    const itemId = itemRow.querySelector(".item_id").textContent.trim();
    const itemName = itemRow.querySelector(".item_name").textContent.trim();
    const itemDesc = itemRow.querySelector(".item_desc").textContent.trim();
    const itemSprice = itemRow.querySelector(".item_sprice").textContent.trim();

    setEditModal(itemId, itemName, itemDesc, itemSprice);

    // Clone the saveEditBtn to remove any existing event listeners
    const newSaveEditBtn = saveEditBtn.cloneNode(true);
    saveEditBtn.parentNode.replaceChild(newSaveEditBtn, saveEditBtn);

    // Assign the new saveEditBtn to the original variable
    saveEditBtn = newSaveEditBtn;

    saveEditBtn.addEventListener("click", (e) => {
        e.preventDefault();
        fetch("Handler.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "edit", id: itemId, name: editName.value, description: editDescription.value, price: editPrice.value })
        })
            .then(response => response.text())
            .then(text => {
                console.log("Raw response:", text);
                return JSON.parse(text);
            })
            .then(data => {
                if (data.success) {
                    updateItem(itemRow, editName.value, editDescription.value, editPrice.value);
                    updateFeedback(true);
                } else {
                    console.log("Failed to edit item.");
                    updateFeedback(false);
                }
            })
            .catch(error => console.error("Error:", error));
        toggleOverlay();
        toggleEditModal();
    })
}

// Set delete button to delete specific itemRow
function setDelete(itemRow) {
    const itemId = itemRow.querySelector(".item_id").textContent.trim();

    // Clone the saveEditBtn to remove any existing event listeners
    const newDeleteConfirmBtn = deleteConfirmBtn.cloneNode(true);
    deleteConfirmBtn.parentNode.replaceChild(newDeleteConfirmBtn, deleteConfirmBtn);

    // Assign the new saveEditBtn to the original variable
    deleteConfirmBtn = newDeleteConfirmBtn;

    deleteConfirmBtn.addEventListener("click", () => {
        fetch("Handler.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "delete", iId: itemId })
        })
            .then(response => response.text())
            .then(text => {
                console.log("Raw response:", text);
                return JSON.parse(text);
            })
            .then(data => {
                if (data.success) {
                    itemRow.remove();
                    searchItems();
                    deleteFeedback(true);
                } else {
                    console.log("Failed to delete item.");
                    deleteFeedback(false);
                }
            })
            .catch(error => console.error("Error:", error));
        toggleOverlay()
        toggleDeleteModal();
    })
}

// Search for similar item after any input
function searchItems() {
    const searchTerm = document.getElementById("search_bar").value;
    console.log("searching " + searchTerm);

    fetch("Handler.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "search", query: searchTerm })
    })
        .then(response => response.text())
        .then(text => {
            console.log("Raw response:", text);
            return JSON.parse(text);
        })
        .then(data => displayItems(data))
        .catch(error => console.error("Error:", error));
}
// Initially start with all items listed
searchItems();

// Display search results
function displayItems(items) {
    const container = document.getElementById("item_container");
    container.innerHTML = '';

    items.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item_row");

        itemDiv.innerHTML = `
            <div class="item_field item_id">${item.iId}</div>
            <div class="item_field item_name">${item.Iname}</div>
            <div class="item_field item_desc">${item.Idescription}</div>
            <div class="item_field item_sprice">$${item.Sprice}</div>
            <div class="tools">
                <button class="edit-btn">
                    <svg height="20.6px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="m1 11v4h4l7-7-4-4zm10-10-2 2 4 4 2-2z" />
                    </svg>
                </button>
                <button class="delete-btn">
                    <svg height="18px" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="m432 32h-120l-9.4-18.7a24 24 0 0 0 -21.5-13.3h-114.3a23.72 23.72 0 0 0 -21.4 13.3l-9.4 18.7h-120a16 16 0 0 0 -16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0 -16-16zm-378.8 435a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45l21.2-339h-384z" />
                    </svg>
                </button>
            </div>
        `;

        container.appendChild(itemDiv);
    });
    refreshItemBtns();
}
// Refresh search after every input
document.getElementById("search_bar").addEventListener("input", searchItems);

function refreshItemBtns() {
    const deleteBtns = document.querySelectorAll(".delete-btn");
    const editBtns = document.querySelectorAll(".edit-btn");

    deleteBtns.forEach(btn => btn.addEventListener("click", () => {
        const itemRow = btn.closest(".item_row");
        setDelete(itemRow)
        toggleOverlay();
        toggleDeleteModal();
    }))

    editBtns.forEach(btn => btn.addEventListener("click", () => {
        const itemRow = btn.closest(".item_row");
        toggleOverlay();
        setEdit(itemRow);
        toggleEditModal();
    }))
}