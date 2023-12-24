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

        // Update the listItem.innerHTML in renderStaffList
        listItem.innerHTML = `
    <div class="custom-list-item-content">
        <h5 class="mb-1">Item Name: ${staffItem.itemName}, Date Added: ${formattedDateAdded}</h5>
        <p class="mb-1">Category: ${staffItem.category}</p>
    </div>
    <div class="custom-list-item-buttons">
        <button class="btn btn-primary btn-sm me-2" data-action="viewDetails" data-id="${staffItem.id}">View Details</button>
        <button class="btn btn-warning btn-sm me-2" data-action="editItem" data-id="${staffItem.id}">Edit</button>
        <button class="btn btn-info btn-dark btn-sm" data-action="textStudent" data-id="${staffItem.id}">Text Student</button>
        <button class="btn btn-secondary btn-sm" data-action="status" data-id="${staffItem.id}">Status</button>
    </div>
`;



        staffListElement.appendChild(listItem);
    });

    staffContainer.appendChild(staffListElement);
}

function addStaffItem(itemName, category, lastLocation, dateLost, itemDescription, image) {
    const currentDate = new Date(); // Get the current date and time
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format it as YYYY-MM-DD

    const newItem = {
        id: staffList.length + 1,
        itemName: itemName,
        category: category, // Use the category from the dropdown
        lastLocation: lastLocation,
        dateLost: dateLost,
        itemDescription: itemDescription,
        image: image,
        dateAdded: currentDate,
    };

    staffList.push(newItem);

    // Render the updated staff list
    renderStaffList();

    // Hide the modal by setting its display property to 'none'
    const addRequestModalElement = document.getElementById("addRequestModal");
    addRequestModalElement.style.display = 'none';

    // Remove the modal backdrop if it exists
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
        modalBackdrop.parentNode.removeChild(modalBackdrop);
    }
}


// Function to view details of a staff item
function viewDetails(itemId) {
    const selectedItem = staffList.find((item) => item.id === itemId);

    // Update the modal content with details
    document.getElementById("viewDetailsStudentID").innerText = `User ID: `;
    document.getElementById("viewDetailsItemID").innerText = `Item ID:`;
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

function editItem(itemId) {
    const selectedItem = staffList.find((item) => item.id === itemId);

    // Update the modal inputs with existing details
    document.getElementById("editItemName").value = selectedItem.itemName;
    document.getElementById("editItemCategory").value = selectedItem.category;
    document.getElementById("editLastLocation").value = selectedItem.lastLocation;
    document.getElementById("editItemDateLost").value = selectedItem.dateLost;
    document.getElementById("editItemDescription").value = selectedItem.itemDescription;

    // Initialize the edit modal
    const editItemModal = new bootstrap.Modal(document.getElementById("editItemModal"));

    // Show the edit modal
    editItemModal.show();

    // Save changes on button click
    const saveChangesBtn = document.getElementById("saveChangesBtn");
    saveChangesBtn.addEventListener('click', () => saveChanges(itemId, editItemModal));

    // Show confirmation modal on "Delete Item" button click
    const deleteItemBtn = document.getElementById("deleteItemBtn");
    deleteItemBtn.addEventListener('click', () => confirmDelete(itemId, editItemModal));
}

// Function to save changes after editing
function saveChanges(itemId, modalInstance) {
    const selectedItemIndex = staffList.findIndex((item) => item.id === itemId);

    // Update item details with edited values
    staffList[selectedItemIndex].itemName = document.getElementById("editItemName").value;
    staffList[selectedItemIndex].category = document.getElementById("editItemCategory").value; // Use the category from the dropdown
    staffList[selectedItemIndex].lastLocation = document.getElementById("editLastLocation").value;
    staffList[selectedItemIndex].dateLost = document.getElementById("editItemDateLost").value;
    staffList[selectedItemIndex].itemDescription = document.getElementById("editItemDescription").value;

    // Close the modal after saving changes
    modalInstance.hide();

    // Remove the modal backdrop
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
        modalBackdrop.parentNode.removeChild(modalBackdrop);
    }

    // Render the updated staff list
    renderStaffList();
}

// Function to confirm delete before actually deleting
function confirmDelete(itemId, editItemModal) {
    const confirmationModal = new bootstrap.Modal(document.getElementById("confirmationDeleteItemModal"));

    // Show the confirmation modal
    confirmationModal.show();

    // Handle delete confirmation
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    confirmDeleteBtn.onclick = function () {
        // Call the deleteItem function
        deleteItem(itemId);

        // Hide the edit modal after deletion
        editItemModal.hide();

        // Hide the confirmation modal after deletion
        confirmationModal.hide();
    };
}

// Function to delete a staff item
function deleteItem(itemId) {
    // Find the index of the item to be deleted
    const itemIndex = staffList.findIndex((item) => item.id === itemId);

    // Remove the item from the staff list
    staffList.splice(itemIndex, 1);

    // Render the updated staff list
    renderStaffList();

    // Remove the modal backdrop
    removeModalBackdrop();
}

// Function to remove the modal backdrop
function removeModalBackdrop() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach(backdrop => {
        backdrop.parentNode.removeChild(backdrop);
    });

    // Ensure the body doesn't have the modal-open class, which may be causing the overlay
    document.body.classList.remove('modal-open');
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

        // Close the "Add Request" modal after adding a new staff item
        const addRequestModal = new bootstrap.Modal(document.getElementById("addRequestModal"));
        addRequestModal.hide();

        // Remove the modal backdrop manually
        const modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) {
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        }
    } else {
        alert('Please fill in all required fields.');
    }
});

// Update the event listener in requestsContainer to handle the "Status" button and modal
document.getElementById('requestsContainer').addEventListener('click', function (event) {
    const target = event.target;

    const action = target.getAttribute('data-action');
    const itemId = target.getAttribute('data-id');

    if (action && itemId) {
        if (action === 'viewDetails') {
            viewDetails(parseInt(itemId, 10));
        } else if (action === 'editItem') {
            editItem(parseInt(itemId, 10));
        } else if (action === 'textStudent') {
            console.log('Text Student button clicked for item ID:', itemId);
        } else if (action === 'status') {
            // Show the status modal
            const statusModal = new bootstrap.Modal(document.getElementById("statusModal"));
            statusModal.show();

            // Handle status selection
            const statusButtons = document.querySelectorAll('#statusModal button[data-status]');
            statusButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const selectedStatus = this.getAttribute('data-status');
                    console.log(`Status selected for item ID ${itemId}: ${selectedStatus}`);

                    // Handle dynamic content based on status
                    const foundOptions = document.getElementById('foundOptions');
                    const returnedOptions = document.getElementById('returnedOptions');

                    if (selectedStatus === 'Found') {
                        foundOptions.style.display = 'block';
                        returnedOptions.style.display = 'none'; // Hide "Returned" options initially
                    } else {
                        foundOptions.style.display = 'none';
                        returnedOptions.style.display = 'none';
                    }
                });
            });

            // Handle "Returned" and "Not Returned" options
            const statusOptionButtons = document.querySelectorAll('#statusModal button[data-status-option]');
            statusOptionButtons.forEach(optionButton => {
                optionButton.addEventListener('click', function () {
                    const selectedStatusOption = this.getAttribute('data-status-option');
                    console.log(`Status Option selected for item ID ${itemId}: ${selectedStatusOption}`);

                    // Handle dynamic content based on status option
                    const returnedOptions = document.getElementById('returnedOptions');
                    if (selectedStatusOption === 'Returned') {
                        returnedOptions.style.display = 'block';
                    } else {
                        returnedOptions.style.display = 'none';
                    }
                });
            });

            // Handle the "Confirm" button click
            const confirmStatusBtn = document.getElementById('confirmStatusBtn');
            confirmStatusBtn.addEventListener('click', function () {
                // Get the selected status
                const selectedStatusButton = document.querySelector('#statusModal button[data-status][aria-pressed="true"]');
                const selectedStatus = selectedStatusButton ? selectedStatusButton.getAttribute('data-status') : null;

                // Get additional options for "Found" status
                const locationFound = document.getElementById('locationFound').value;
                const dateReturned = document.getElementById('dateReturned').value;

                // Check if both date found and location found are required
                const requiresDateFoundAndLocation = selectedStatus === 'Found';

                if (requiresDateFoundAndLocation && (!locationFound || !dateReturned)) {
                    // Display an alert if both date found and location found are required but not filled
                    alert('Please fill in both Date Found and Location Found.');
                } else {
                    // Continue with processing or updating your data structure

                    // Display a confirmation (you can customize this part based on your needs)
                    alert(`Status: ${selectedStatus}, Location Found: ${locationFound}, Date Returned: ${dateReturned}`);

                    // Close the modal
                    statusModal.hide();
                }
            });

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

    // Render each staff item
    filteredItems.forEach((staffItem) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item custom-list-item";

        // Format the date as "MM/DD/YYYY"
        const formattedDateAdded = new Date(staffItem.dateAdded).toLocaleDateString('en-US');

        // Update the listItem.innerHTML in renderStaffList
        listItem.innerHTML = `
    <div class="custom-list-item-content">
        <h5 class="mb-1">Item Name: ${staffItem.itemName}, Date Added: ${formattedDateAdded}</h5>
        <p class="mb-1">Category: ${staffItem.category}</p>
    </div>
    <div class="custom-list-item-buttons">
        <button class="btn btn-primary btn-sm me-2" data-action="viewDetails" data-id="${staffItem.id}">View Details</button>
        <button class="btn btn-warning btn-sm me-2" data-action="editItem" data-id="${staffItem.id}">Edit</button>
        <button class="btn btn-info btn-dark btn-sm" data-action="textStudent" data-id="${staffItem.id}">Text Student</button>
        <button class="btn btn-secondary btn-sm" data-action="status" data-id="${staffItem.id}">Status</button>
    </div>
`;



        staffListElement.appendChild(listItem);
    });

    staffContainer.appendChild(staffListElement);
}

var darkmode = document.getElementById("darkModeBtn");
darkmode.onclick = function () {
    document.body.classList.toggle("dark-theme")
}
