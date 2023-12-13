var addRequestModal, editItemModal;  

document.addEventListener("DOMContentLoaded", function () {
    addRequestModal = new bootstrap.Modal(document.getElementById('addRequestModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    var requestList = document.getElementById('requestList');
    var sortByDateLost = document.getElementById('sortByDateLost');
    var sortByDateFound = document.getElementById('sortByDateFound');

    document.getElementById('addRequestBtn').addEventListener('click', function () {
        addRequestModal.show();
    });

    document.getElementById('submitRequestBtn').addEventListener('click', function () {
        var itemName = document.getElementById('itemName').value.trim();
        var category = document.getElementById('category').value.trim();
        var lastLocation = document.getElementById('lastLocation').value.trim();
        var dateLost = document.getElementById('dateLost').value.trim();
        var itemDescription = document.getElementById('itemDescription').value.trim();
        var imageInput = document.getElementById('image');

        if (itemName && category && lastLocation && dateLost && itemDescription) {
            var image = imageInput.files.length > 0 ? imageInput.files[0] : null;
            var imageUrl = image ? URL.createObjectURL(image) : null;

            var currentDate = new Date();
            var dateTimeAdded = currentDate.toLocaleString();

            var newItem = document.createElement("li");
            newItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");
            newItem.innerHTML = `
                <div class="d-flex align-items-start">
                    ${imageUrl ? `<img src="${imageUrl}" alt="Uploaded Image" style="max-width: 200px; margin-right: 10px;">` : ''}
                    <div>
                        <strong>Item Name:</strong> ${itemName}<br>
                        <strong>Category:</strong> ${category}<br>
                        <strong>Date Added:</strong> ${dateTimeAdded}<br>
                    </div>
                </div>
                <div class="text-end">
                    <button class="btn btn-secondary mt-2 text-student-btn" data-bs-dismiss="modal" id="textStudentBtn">
                        Text Student
                    </button>
                    <button class="btn btn-primary mt-2 view-details-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#viewDetailsModal"
                            data-item-name="${itemName}"
                            data-category="${category}"
                            data-date-lost="${dateLost}"
                            data-item-description="${itemDescription}"
                            data-last-location="${lastLocation}">
                        View Details
                    </button>
                    <button class="btn btn-warning mt-2 edit-item-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#editItemModal"
                    data-item-name="${itemName}"
                    data-category="${category}"
                    data-last-location="${lastLocation}"
                    data-date-lost="${dateLost}"
                    data-item-description="${itemDescription}">
                Edit
            </button>
            `;

            newItem.dateLost = new Date(dateLost);
            newItem.dateFound = currentDate;
            newItem.dateTimeAdded = currentDate;

            requestList.appendChild(newItem);

            document.getElementById('itemName').value = '';
            document.getElementById('category').value = '';
            document.getElementById('lastLocation').value = '';
            document.getElementById('dateLost').value = '';
            document.getElementById('itemDescription').value = '';
            document.getElementById('image').value = '';

            addRequestModal.hide();

            triggerEnterKeyPress('category');
        } else {
            alert("Please fill in all required fields.");
        }
    });

    sortByDateLost.addEventListener('click', function () {
        sortItems('dateLost');
    });

    sortByDateFound.addEventListener('click', function () {
        sortItems('dateTimeAdded');
    });

    document.getElementById('itemName').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'category');
    });

    document.getElementById('category').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'lastLocation');
    });

    document.getElementById('lastLocation').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'dateLost');
    });

    document.getElementById('dateLost').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'itemDescription');
    });

    document.getElementById('itemDescription').addEventListener('keydown', function (event) {
        handleEnterKeyPress(event, 'image');
    });

    requestList.addEventListener('click', function (event) {
        if (event.target.classList.contains('view-details-btn')) {
            var dateLost = event.target.dataset.dateLost;
            var itemDescription = event.target.dataset.itemDescription;
            var lastLocation = event.target.dataset.lastLocation;

            console.log('Last Location:', lastLocation);
            console.log('Date Lost:', dateLost);
            console.log('Item Description:', itemDescription);

            document.getElementById('viewDetailsLastLocation').textContent = `Last Location: ${lastLocation}`;
            document.getElementById('viewDetailsDateLost').textContent = `Date Lost: ${dateLost}`;
            document.getElementById('viewDetailsItemDescription').textContent = `Item Description: ${itemDescription}`;

            $('#viewDetailsModal').modal('show');
        }

        if (event.target.classList.contains('edit-item-btn')) {
            var itemName = event.target.dataset.itemName;
            var category = event.target.dataset.category;
            var lastLocation = event.target.dataset.lastLocation;
            var dateLost = event.target.dataset.dateLost;
            var itemDescription = event.target.dataset.itemDescription;


            document.getElementById('editItemName').value = itemName;
            document.getElementById('editItemCategory').value = category;
            document.getElementById('editItemLastLocation').value = lastLocation;
            document.getElementById('editItemDateLost').value = dateLost;
            document.getElementById('editItemDescription').value = itemDescription;

            editItemModal.show();
        }
    });

    document.getElementById('saveChangesBtn').addEventListener('click', function () {
        
        var editedItemName = document.getElementById('editItemName').value.trim();
        var editedItemCategory = document.getElementById('editItemCategory').value.trim();
        var editedItemLastLocation = document.getElementById('editItemLastLocation').value.trim();
        var editedItemDateLost = document.getElementById('editItemDateLost').value.trim();
        var editedItemDescription = document.getElementById('editItemDescription').value.trim();
    

        console.log("Save Changes button clicked!");
        console.log("Edited Item Name:", editedItemName);
        console.log("Edited Item Category:", editedItemCategory);

        var selectedItem = document.querySelector('.edit-item-btn:focus').closest('li');
        console.log("Selected Item:", selectedItem);
    
      
        selectedItem.querySelector('strong:nth-child(1)').textContent = `Item Name: ${editedItemName}`;
        selectedItem.querySelector('strong:nth-child(2)').textContent = `Category: ${editedItemCategory}`;
    
        
        selectedItem.dataset.itemName = editedItemName;
        selectedItem.dataset.category = editedItemCategory;
        selectedItem.dataset.lastLocation = editedItemLastLocation;
        selectedItem.dataset.dateLost = editedItemDateLost;
        selectedItem.dataset.itemDescription = editedItemDescription;
    
        editItemModal.hide();
    });

    function handleEnterKeyPress(event, nextInputId) {
        if (event.key === 'Enter') {
            event.preventDefault();
            triggerEnterKeyPress(nextInputId);
        }
    }

    function triggerEnterKeyPress(nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    }

    function sortItems(sortCriterion) {
        var items = Array.from(requestList.children);

        items.sort(function (a, b) {
            var dateA = a[sortCriterion];
            var dateB = b[sortCriterion];

            return dateB - dateA;
        });

        items.forEach(function (item) {
            requestList.removeChild(item);
        });

        items.forEach(function (item) {
            requestList.appendChild(item);
        });
    }
});
