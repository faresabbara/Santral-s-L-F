document.addEventListener("DOMContentLoaded", function () {
    var addRequestModal = new bootstrap.Modal(document.getElementById('addRequestModal'), {
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
                    <!-- "View Details" button -->
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
                </div>
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

            console.log("Item ID")
            console.log('Last Location:', lastLocation);
            console.log('Date Lost:', dateLost);
            console.log('Item Description:', itemDescription);

            document.getElementById('viewDetailsLastLocation').textContent = `Last Location: ${lastLocation}`;
            document.getElementById('viewDetailsDateLost').textContent = `Date Lost: ${dateLost}`;
            document.getElementById('viewDetailsItemDescription').textContent = `Item Description: ${itemDescription}`;

            $('#viewDetailsModal').modal('show');
        }

        
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

    function performSearch() {
        var searchInput = document.getElementById('searchInput').value.trim().toLowerCase();

        Array.from(requestList.children).forEach(function (item) {
            var itemNameElement = item.querySelector('strong:nth-child(1)');
            var categoryElement = item.querySelector('strong:nth-child(2)');

            if (itemNameElement && categoryElement) {
                var itemName = itemNameElement.textContent.trim().toLowerCase();
                var category = categoryElement.textContent.trim().toLowerCase();

                var isMatch = itemName.includes(searchInput) || category.includes(searchInput);
                item.style.display = isMatch ? 'flex' : 'none';
            }
        });


        users.forEach(user => {
            const isVisible =
                user.name.toLowerCase().includes(searchInput) ||
                user.email.toLowerCase().includes(searchInput);
            user.element.classList.toggle("hide", !isVisible);
        });
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