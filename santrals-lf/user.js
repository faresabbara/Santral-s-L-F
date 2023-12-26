document.addEventListener("DOMContentLoaded", function () {
    var addRequestModal = new bootstrap.Modal(document.getElementById('addRequestModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    var viewDetailsModal = new bootstrap.Modal(document.getElementById('viewDetailsModal'), {
        backdrop: 'static',
        keyboard: false,
    });
        // Open the chat modal when the chat icon is clicked
        document.getElementById('openChatModal').addEventListener('click', function () {
            // Assuming you're using Bootstrap for modals
            var chatModal = new bootstrap.Modal(document.getElementById('chatModal'), {
                backdrop: 'static',
                keyboard: false,
            });
            chatModal.show();
        });

    var requestList = document.getElementById('requestList');
    var sortByDateLost = document.getElementById('sortByDateLost');
    var sortByDateFound = document.getElementById('sortByDateFound');

    var imageUrl;
    var originalItemList = Array.from(requestList.children);

    function renderRequestList(items) {
        requestList.innerHTML = "";
        items.forEach(item => {
            requestList.appendChild(item.cloneNode(true));
        });
    }

    document.getElementById('addRequestBtn').addEventListener('click', function () {
        addRequestModal.show();
    });

    document.getElementById('submitRequestBtn').addEventListener('click', function () {
        var itemName = document.getElementById('itemName').value.trim();
        var category = document.getElementById('category').value.trim();
        var lastLocation = document.getElementById('lastLocation').value;
        var dateLost = document.getElementById('dateLost').value.trim();
        var itemDescription = document.getElementById('itemDescription').value.trim();
        var imageInput = document.getElementById('image');

        if (itemName && category && lastLocation && dateLost && itemDescription) {
            var currentDate = new Date();
            var image = imageInput.files.length > 0 ? imageInput.files[0] : null;
            imageUrl = image ? URL.createObjectURL(image) : null;

            var newItem = document.createElement("li");
            newItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");
            newItem.innerHTML = `
                <div class="d-flex align-items-start">
                    <div>
                        <h5 class="mb-1">Item Name: ${itemName}, Date Added: ${currentDate.toLocaleDateString()}</h5>
                        <p class="mb-1" style="font-weight: normal;">Category: ${category}</p>
                    </div>
                </div>
                <div class="text-end">
                    <button class="btn btn-primary mt-2 view-details-btn listbtn" 
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

            originalItemList = Array.from(requestList.children);
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

    requestList.addEventListener('click', function (event) {
        if (event.target.classList.contains('view-details-btn')) {
            var dateLost = event.target.dataset.dateLost;
            var itemDescription = event.target.dataset.itemDescription;
            var lastLocation = event.target.dataset.lastLocation;

            console.log("Item ID");
            console.log('Last Location:', lastLocation);
            console.log('Date Lost:', dateLost);
            console.log('Item Description:', itemDescription);

            document.getElementById('viewDetailsLastLocation').textContent = `Last Location: ${lastLocation}`;
            document.getElementById('viewDetailsDateLost').textContent = `Date Lost: ${dateLost}`;
            document.getElementById('viewDetailsItemDescription').textContent = `Item Description: ${itemDescription}`;

            var imageView = document.getElementById('detailsImageContainer');
            imageView.innerHTML = imageUrl ? `<img src="${imageUrl}" alt="Item Image" class="img-fluid">` : '<p>No image available</p>';

            viewDetailsModal.show();

            originalItemList = Array.from(requestList.children);
        }
    });

    document.getElementById('searchBtn').addEventListener('click', function () {
        performSearch();
    });

    document.getElementById('searchInput').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        var searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

        if (!searchTerm) {
            renderRequestList(originalItemList);
        } else {
            var filteredItems = originalItemList.filter(item =>
                item.textContent.toLowerCase().includes(searchTerm)
            );
            renderRequestList(filteredItems);
        }

        document.getElementById('searchInput').value = '';
    }

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
document.addEventListener("DOMContentLoaded", function () {
    var darkmode = document.getElementById("darkModeBtn");
    if (darkmode) {
        darkmode.onclick = function() {
            document.body.classList.toggle("dark-theme");
        };
    }
});
