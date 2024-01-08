let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');

openShopping.addEventListener('click', ()=>{
    body.classList.add('active');
})
closeShopping.addEventListener('click', ()=>{
    body.classList.remove('active');
})


    let listCards = [];

    function initApp() {
        fetch('productdetails.json')
            .then(response => response.json())
            .then(products => {
                products.forEach((value, key) => {
                    let newDiv = document.createElement('div');
                    newDiv.classList.add('item');
                    newDiv.innerHTML = `
                        <img src="image/${value.image}">
                        <div class="title">${value.brand}</div>
                        <div class="price">${value.price.toLocaleString()}</div><br>
                        <button onclick="openCartPopup()">
                        ADD TO CART</button>`;

                    list.appendChild(newDiv);
                });
            })
            .catch(error => console.error('Error fetching product.json:', error));
    }

initApp();
function addToCard(key){
    if(listCards[key] == null){
        // copy product form list to list card
        listCards[key] = JSON.parse(JSON.stringify(products[key]));
        listCards[key].quantity = 1;
        //filterProduct(products[productIndex]);
    }
    reloadCard();
}


















fetch('product.json')
  .then(response => response.json())
  .then(data => {
    products = data;
  });

// Debouncing function to delay the execution of the filtering function
function debounce(func, delay) {
  let timeoutId;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}

// Function to apply filters
function applyFilters() {
  const regionFilter = document.getElementById('regionFilter').value;
  const esimFilter = document.getElementById('esimFilter').value;
  const formFactorFilter = document.getElementById('formFactorFilter').value;

  // Filter products based on the selected filters
  const filteredProducts = products.filter(product => {
    return (
      (regionFilter === '' || product.regionOfTesting === regionFilter) &&
      (esimFilter === '' || product.eSIMCompatibility === esimFilter) &&
      (formFactorFilter === '' || product.formFactors === formFactorFilter)
    );
  });

  // Display the results below the modal
  displayFilteredResults(filteredProducts);
}
function displayFilteredResults(filteredProducts) {
  const resultContainer = document.getElementById('filterResults');
  //const detailsContainer = document.getElementById('productDetails'); // Add this line


  // Clear previous results
  resultContainer.innerHTML = '';
 // detailsContainer.innerHTML = '';
  if (filteredProducts.length === 0) {
    resultContainer.innerHTML = '<p>No matching products found.</p>';
  } else {
    const table = document.createElement('table');
    table.classList.add('result-table');

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const columnNames = ['Name', 'Region', 'eSIM Compatibility', 'Form Factor', 'Quantity'];
    columnNames.forEach(columnName => {
      const th = document.createElement('th');
      th.textContent = columnName;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');
    filteredProducts.forEach(product => {
      const row = document.createElement('tr');

      // Display only specific columns
      const columns = ['name', 'regionOfTesting', 'eSIMCompatibility', 'formFactors', 'quantity'];
      columns.forEach(column => {
        const td = document.createElement('td');

        if (column === 'quantity') {
          // Create button based on status
          const button = document.createElement('button');
          button.textContent = product.status === 1 ? 'Pre Order' : 'Add Variant';
          button.classList.add(product.status === 1 ? 'pre-order' : 'add-variant');
          button.addEventListener('click', () => {
            TOGGLE(product, button);
            showProductDetails(product, resultContainer);
          });
          const quantityInput = document.createElement('input');
          
          quantityInput.type = 'number';
          quantityInput.value = product[column];
        //  quantityInput.addEventListener('input', () => updateQuantity(product.id, quantityInput.value));
          
          td.appendChild(button);
        } else {
          td.textContent = product[column];
        }

        row.appendChild(td);
      });

      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    resultContainer.appendChild(table);
  }
}
function TOGGLE(product, button) {
  if (product.status === 0) {
    // Toggle between button and quantity input
    const quantityInput = createQuantityInput(product);
    button.parentNode.replaceChild(quantityInput, button);
  }
}
function createQuantityInput() {
  // Create quantity input with + and - buttons
  const quantityInput = document.createElement('div');
  quantityInput.classList.add('quantity-input');
  let defaultQuantity = 0;

  quantityInput.innerHTML = `<button class="quantity-button" onclick="decreaseQuantity()">-</button><span>${defaultQuantity}</span><button class="quantity-button" onclick="increaseQuantity()">+</button>`;

  return quantityInput;
}

function increaseQuantity() {
  const quantitySpan = document.querySelector('.quantity-input span');
  if (quantitySpan) {
    let defaultQuantity = parseInt(quantitySpan.textContent, 10) || 0;
    if (defaultQuantity < 10) {
      defaultQuantity += 5;
      quantitySpan.textContent = defaultQuantity;
     return defaultQuantity;
    }

    if (defaultQuantity === 10) {
      disablePlusButton();
    }
  }
  
}

function decreaseQuantity() {
  const quantitySpan = document.querySelector('.quantity-input span');
  if (quantitySpan) {
    let defaultQuantity = parseInt(quantitySpan.textContent, 10) || 0;
    if (defaultQuantity > 0) {
      defaultQuantity -= 5;
      quantitySpan.textContent = Math.max(defaultQuantity, 0);
      return decreaseQuantity;
     
    }

    if (defaultQuantity === 0) {
      replaceWithAddVariantButton();
    } else {
      enablePlusButton();
    }
  }

}

function replaceWithAddVariantButton() {
  const quantityInput = document.querySelector('.quantity-input');
  if (quantityInput) {
    quantityInput.innerHTML = `<button class="add-variant" onclick="toggleQuantityInput()">Add Variant</button>`;
  }
}

function getProductDetails(productId) {
  // Assuming products is the array containing product details from product.json
  const product = product.find(p => p.id === productId);
  return product || {}; // Return an empty object if the product is not found
}

function toggleQuantityInput() {
  const productDetailsContainer = document.getElementById('productDetails');
  const actionButtonsContainer = document.getElementById('actionButtons');
  const quantityInput = document.querySelector('.quantity-input');
  if (quantityInput && productDetailsContainer) {
    quantityInput.innerHTML = `<button class="quantity-button" onclick="decreaseQuantity()">-</button><span>0</span><button class="quantity-button" onclick="increaseQuantity()">+</button>`;
    const productToDisplay = filteredProducts[0];

    // Create a table with product details and append it below the filter details
    displayProductDetails(productToDisplay, productDetailsContainer);;

  }
}

function disablePlusButton() {
  const plusButton = document.querySelector('.quantity-input button.quantity-button:last-child');
  if (plusButton) {
    plusButton.setAttribute('disabled', true);
  }
}

function enablePlusButton() {
  const plusButton = document.querySelector('.quantity-input button.quantity-button:last-child');
  if (plusButton) {
    plusButton.removeAttribute('disabled');
  }
}

// Create a container for the product details and buttons
const productContainer = document.createElement('div');
productContainer.classList.add('product-container');

// Create a container for the buttons at the bottom right
const buttonsContainer = document.createElement('div');
buttonsContainer.classList.add('buttons-container');
productContainer.appendChild(buttonsContainer);

// Append the product container to the result container
resultContainer.appendChild(productContainer);



function showProductDetails(product, resultContainer) {
  const detailsTableId = `productDetailsTable_${product.id}`;
  const existingDetailsTable = document.getElementById(detailsTableId);

  if (existingDetailsTable) {
    // If details for this product are already displayed, update the quantity
    const quantityCell = existingDetailsTable.querySelector(`td[data-column="quantity"]`);
    if (quantityCell) {
      quantityCell.textContent = product.quantity;
    }
  } else {
    // Create a table to display product details
    const detailsTable = document.createElement('table');
    detailsTable.classList.add('result-table', 'product-details-table');
    detailsTable.id = detailsTableId;

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const columnNames = ['Name', 'Region', 'eSIM Compatibility', 'Form Factor', 'Quantity'];
    columnNames.forEach(columnName => {
      const th = document.createElement('th');
      th.textContent = columnName;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    detailsTable.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');
    const row = document.createElement('tr');
    row.id = `productDetailsRow_${product.id}`;

    // Display only specific columns
    const columnsToDisplay = ['name', 'regionOfTesting', 'eSIMCompatibility', 'formFactors', 'quantity'];
columnsToDisplay.forEach(column => {
  const td = document.createElement('td');
  td.setAttribute('data-column', column); // Add a data attribute for identifying columns

  if (column === 'quantity') {
    // Assuming there is a filter details quantity element with a class 'filterDetailsQuantity'
    const filterDetailsQuantityContainer = document.querySelector('.filterDetailsQuantity');
    if (filterDetailsQuantityContainer) {
      // Display quantity without an input box
      td.textContent = filterDetailsQuantityContainer.textContent;

      // Update the product details quantity dynamically when the filter details quantity changes
      observeFilterQuantityChanges(td);
    }
  } else {
    td.textContent = product[column];
  }

      row.appendChild(td);
    });

    tbody.appendChild(row);
    detailsTable.appendChild(tbody);

    // Append the details table to the result container
    resultContainer.appendChild(detailsTable);
    const buttonsContainer = document.createElement('div');
buttonsContainer.classList.add('buttons-container');
buttonsContainer.style.position = 'absolute';
buttonsContainer.style.bottom = '2px';
buttonsContainer.style.right = '45px';
buttonsContainer.style.margin = '4px'; // Adjust as needed for spacing

const cancelButton = document.createElement('button');
cancelButton.textContent = 'Cancel';
cancelButton.addEventListener('click', function () {
  // Remove the details table and buttons when cancel button is clicked
  resultContainer.removeChild(detailsTable);
  resultContainer.removeChild(buttonsContainer);
});

const addToCartButton = document.createElement('button');
addToCartButton.textContent = 'Add to Cart';
addToCartButton.addEventListener('click', function () {
  // Implement your logic for adding the product to the cart
  console.log('Product added to cart:', product);
});

buttonsContainer.appendChild(cancelButton);
buttonsContainer.appendChild(addToCartButton);

// Append the buttons container to the result container
resultContainer.appendChild(buttonsContainer);
  }
}


  // You may also want to update the quantity in your data model or perform other actions.


// JavaScript to handle modal/popup functionality

function openCartPopup() {
  document.getElementById("cartModal").style.display = "block";
}

function closeCartPopup() {
  document.getElementById("cartModal").style.display = "none";
}



























    function reloadCard() {
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    listCards.forEach((value, key) => {
      totalPrice = totalPrice + value.price;
      count = count + value.quantity;
      if (value != null) {
        let newDiv = document.createElement('li');
        newDiv.innerHTML = `
          <div>
            <img src="image/${value.image}"/>
            <h3>Name</h3>
            <div>${value.name}</div>
          </div>
          <div>
            <h3>Price</h3>
            <div>${value.price.toLocaleString()}</div>
          </div>
          <div>
            <h3>Quantity</h3>
            <div>
              <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
              <div class="count">${value.quantity}</div>
              <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
            </div>
          </div>`;
        listCard.appendChild(newDiv);
      }
    });
    total.innerText = totalPrice.toLocaleString();
    quantity.innerText = count;
  }

