// Sample data for initial testing
let staffList = [];

// Initialize the "Add Request" modal
const addRequestModal = new bootstrap.Modal(document.getElementById("addRequestModal"));

// Function to render the staff list
function renderStaffList() {
    const staffContainer = document.getElementById("requestsContainer");
    const staffListElement = document.getElementById("requestList");

    // Clear previous list
    staffListElement.innerHTML = "";

    // Render each staff item
    staffList.forEach((staffItem) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item custom-list-item";

        // Format the date as "MM/DD/YYYY"
        const formattedDateAdded = new Date(staffItem.dateAdded).toLocaleDateString('en-US');

        listItem.innerHTML = `
            <div class="custom-list-item-content">
                <h5 class="mb-1">Item Name: ${staffItem.itemName}, Date Added: ${formattedDateAdded}</h5>
                <p class="mb-1">Category: ${staffItem.category}</p>
            </div>
            <div class="custom-list-item-buttons">
                <button class="btn btn-primary btn-sm me-2" data-action="viewDetails" data-id="${staffItem.id}">View Details</button>
                <button class="btn btn-warning btn-sm me-2" data-action="editItem" data-id="${staffItem.id}">Edit</button>
                <button class="btn btn-danger btn-sm" data-action="confirmDelete" data-id="${staffItem.id}">Delete</button>
                <!-- Add "Text Student" button next to "View Details" button -->
                <button class="btn btn-info btn-dark btn-sm" data-action="textStudent" data-id="${staffItem.id}">Text Student</button>
            </div>
        `;

        staffListElement.appendChild(listItem);
    });

    staffContainer.appendChild(staffListElement);
}
// Function to add a new staff item
function addStaffItem(itemName, category, lastLocation, dateLost, itemDescription, image) {
    const currentDate = new Date(); // Get the current date and time
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format it as YYYY-MM-DD

    const newItem = {
        id: staffList.length + 1,
        itemName: itemName, // Use the original item name without the date
        category,
        lastLocation,
        dateLost,
        itemDescription,
        image,
        dateAdded: currentDate, // Add the dateAdded property to the new item
    };

    staffList.push(newItem);

    // Render the updated staff list
    renderStaffList();

    // Close the "Add Request" modal after adding a new staff item
    const addRequestModal = document.getElementById("addRequestModal");
    addRequestModal.style.display = "none";

    // Remove the modal backdrop
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
        modalBackdrop.parentNode.removeChild(modalBackdrop);
    }
}
// Function to view details of a staff item
function viewDetails(itemId) {
    const selectedItem = staffList.find((item) => item.id === itemId);

    // Update the modal content with details
    document.getElementById("viewDetailsDateLost").innerText = `Date Lost: ${selectedItem.dateLost}`;
    document.getElementById("viewDetailsItemDescription").innerText = `Description: ${selectedItem.itemDescription}`;
    document.getElementById("viewDetailsLastLocation").innerText = `Last Location: ${selectedItem.lastLocation}`;

    // Display the image, if available
    const imageView = document.getElementById("imageView");
    if (selectedItem.image) {
        imageView.innerHTML = `<img src="${selectedItem.image}" alt="Item Image" class="img-fluid">`;
    } else {
        imageView.innerHTML = "No image available";
    }

    // Show the details modal
    const viewDetailsModal = new bootstrap.Modal(document.getElementById("viewDetailsModal"));
    viewDetailsModal.show();
}

// Function to edit a staff item
function editItem(itemId) {
    const selectedItem = staffList.find((item) => item.id === itemId);

    // Update the modal inputs with existing details
    document.getElementById("editItemName").value = selectedItem.itemName;
    document.getElementById("editItemCategory").value = selectedItem.category;
    document.getElementById("editItemLastLocation").value = selectedItem.lastLocation;
    document.getElementById("editItemDateLost").value = selectedItem.dateLost;
    document.getElementById("editItemDescription").value = selectedItem.itemDescription;

    // Show the edit modal
    const editItemModal = new bootstrap.Modal(document.getElementById("editItemModal"));
    editItemModal.show();

    // Save changes on button click
    document.getElementById("saveChangesBtn").onclick = () => saveChanges(itemId);
}

// Function to save changes after editing
function saveChanges(itemId) {
    const selectedItemIndex = staffList.findIndex((item) => item.id === itemId);

    // Update item details with edited values
    staffList[selectedItemIndex].itemName = document.getElementById("editItemName").value;
    staffList[selectedItemIndex].category = document.getElementById("editItemCategory").value;
    staffList[selectedItemIndex].lastLocation = document.getElementById("editItemLastLocation").value;
    staffList[selectedItemIndex].dateLost = document.getElementById("editItemDateLost").value;
    staffList[selectedItemIndex].itemDescription = document.getElementById("editItemDescription").value;

    // Close the modal after saving changes
    const editItemModal = document.getElementById("editItemModal");
    editItemModal.style.display = "none";

    // Remove the modal backdrop
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
        modalBackdrop.parentNode.removeChild(modalBackdrop);
    }

    // Render the updated staff list
    renderStaffList();
}



// Function to confirm item deletion
function confirmDelete(itemId) {
    // Set up the confirmation modal
    const confirmationModal = new bootstrap.Modal(document.getElementById("confirmationModal"));
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

    // Show the confirmation modal
    confirmationModal.show();

    // Handle delete button click
    confirmDeleteBtn.onclick = () => {
        // Remove the modal backdrop
        const modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) {
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        }

        // Call the deleteItem function
        deleteItem(itemId);

        // Close the confirmation modal after deletion
        confirmationModal.hide();
    };
}

// Function to delete a staff item
function deleteItem(itemId) {
    // Find the index of the item to be deleted
    const itemIndex = staffList.findIndex((item) => item.id === itemId);

    // Remove the item from the staff list
    staffList.splice(itemIndex, 1);

    // Close the confirmation modal after deletion
    const confirmationModal = new bootstrap.Modal(document.getElementById("confirmationModal"));
    confirmationModal.hide();

    // Render the updated staff list
    renderStaffList();
}

// Function to sort staff list by date added in descending order
function sortByDateAdded() {
    staffList.sort((a, b) => b.id - a.id);
    renderStaffList();
}

// Function to sort staff list by date lost in descending order
function sortByDateLost() {
    staffList.sort((a, b) => new Date(b.dateLost) - new Date(a.dateLost));
    renderStaffList();
}

renderStaffList();

// Event listener for "Add Request" button click
document.getElementById('addRequestBtn').addEventListener('click', function () {
    document.getElementById('itemName').value = '';
    document.getElementById('category').value = '';
    document.getElementById('lastLocation').value = '';
    document.getElementById('dateLost').value = '';
    document.getElementById('itemDescription').value = '';
    document.getElementById('image').value = '';

    // Show the "Add Request" modal
    const addRequestModal = new bootstrap.Modal(document.getElementById("addRequestModal"));

    // Ensure the modal is not already shown before showing it again
    if (!addRequestModal._isShown) {
        addRequestModal.show();
    }

    // Add event listeners for handling "Enter" key navigation
    document.getElementById('itemName').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('category').focus();
        }
    });

    document.getElementById('category').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('lastLocation').focus();
        }
    });

    document.getElementById('lastLocation').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('dateLost').focus();
        }
    });

    document.getElementById('dateLost').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('itemDescription').focus();
        }
    });
});

// Event listener for "Submit Request" button click
document.getElementById('submitRequestBtn').addEventListener('click', function () {
    // Retrieve input values
    var itemName = document.getElementById('itemName').value.trim();
    var category = document.getElementById('category').value.trim();
    var lastLocation = document.getElementById('lastLocation').value.trim();
    var dateLost = document.getElementById('dateLost').value.trim();
    var itemDescription = document.getElementById('itemDescription').value.trim();
    var imageInput = document.getElementById('image');

    // Check if required fields are filled
    if (itemName && category && lastLocation && dateLost && itemDescription) {
        var image = '';
        if (imageInput.files.length > 0) {
            var selectedImage = imageInput.files[0];
            image = URL.createObjectURL(selectedImage);
        }

        addStaffItem(itemName, category, lastLocation, dateLost, itemDescription, image);

    
        const addRequestModal = new bootstrap.Modal(document.getElementById("addRequestModal"));
        addRequestModal.hide();
    } else {    
        alert('Please fill in all required fields.');
    }
});


document.getElementById('requestsContainer').addEventListener('click', function (event) {
    const target = event.target;

    const action = target.getAttribute('data-action');
    const itemId = target.getAttribute('data-id');

    if (action && itemId) {

        if (action === 'viewDetails') {
            viewDetails(parseInt(itemId, 10));
        } else if (action === 'editItem') {
            editItem(parseInt(itemId, 10));
        } else if (action === 'confirmDelete') {
            confirmDelete(parseInt(itemId, 10));
        } else if (action === 'textStudent') {
            console.log('Text Student button clicked for item ID:', itemId);
        }
    }
});

document.getElementById('sortByDateAddedBtn').addEventListener('click', function () {
    sortByDateAdded();
});

document.getElementById('sortByDateLostBtn').addEventListener('click', function () {
    sortByDateLost();
});
document.getElementById('searchBtn').addEventListener('click', function () {
    performSearch();
});

document.getElementById('searchInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Function to perform search
function performSearch() {
    searchItems(document.getElementById('searchInput').value.trim().toLowerCase());
}

// Function to search for items
function searchItems(searchTerm) {
    if (!searchTerm) {
        renderStaffList();
        return;
    }

    const filteredItems = staffList.filter(item =>
        item.category.toLowerCase().includes(searchTerm) ||
        item.itemName.toLowerCase().includes(searchTerm)
    );

    renderFilteredItems(filteredItems);
}

function renderFilteredItems(filteredItems) {
    const staffContainer = document.getElementById("requestsContainer");
    const staffListElement = document.getElementById("requestList");

    // Clear previous list
    staffListElement.innerHTML = "";

    // Render each filtered item
    filteredItems.forEach((staffItem) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item custom-list-item";

        const formattedDateAdded = new Date(staffItem.dateAdded).toLocaleDateString('en-US');

        listItem.innerHTML = `
            <div class="custom-list-item-content">
                <h5 class="mb-1">Item Name: ${staffItem.itemName}, Date Added: ${formattedDateAdded}</h5>
                <p class="mb-1">Category: ${staffItem.category}</p>
            </div>
            <div class="custom-list-item-buttons">
                <button class="btn btn-primary btn-sm me-2" data-action="viewDetails" data-id="${staffItem.id}">View Details</button>
                <button class="btn btn-warning btn-sm me-2" data-action="editItem" data-id="${staffItem.id}">Edit</button>
                <button class="btn btn-danger btn-sm" data-action="confirmDelete" data-id="${staffItem.id}">Delete</button>
                <button class="btn btn-info btn-dark btn-sm" data-action="textStudent" data-id="${staffItem.id}">Text Student</button>
            </div>
        `;

        staffListElement.appendChild(listItem);
    });

    staffContainer.appendChild(staffListElement);
}
