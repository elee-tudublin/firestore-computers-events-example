/*
  Functions used to update the index page view
*/

// page element where rows will be inserted 
const eventRows = document.getElementById('eventRows');
const computerList = document.getElementById('computerList');

// This function returns a Bootstrap alert class and icon based on event level
// alerts - https://getbootstrap.com/docs/5.0/components/alerts/
// icons - https://icons.getbootstrap.com/
function getAlertStyle(level) {
  // objects to store style settings for each level
  const error = {
    alert: 'alert-danger',
    icon: 'bi bi-bug-fill'
  };
  const information = {
    alert: 'alert-light',
    icon: 'bi bi-info-circle-fill'
  };

  // Use Switch to return style based on level
  switch (level) {
    case 'error':
      return error;
    case 'information':
      return information;
    default:
      return '';
  }
}

function displayEventList(events) {
  // Use the Array map method to iterate through the array of message documents
  // Each message will be formated as HTML table rows and added to the array
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // Finally the output array is inserted as the content into the <tbody id="productRows"> element.
  const tableRows = events.map(event => {
    // Get the styling object for this level - for use below
    const levelStyle = getAlertStyle(event.level);
    return `<tr class="alert ${levelStyle.alert}">
          <td><i class="${levelStyle.icon}"></i></td>
          <td>${event.type}</td>
          <td>${event.level}</td>
          <td>${event.timeStamp}</td>
          <td>${event.service}</td>
          <td>${event.computer.name}</td>
          <td>${event.user}</td>
          <td>${event.description}</td>
      </tr>`;
  });

  // Add rows to the table body
  eventRows.innerHTML = tableRows.join('');
}

function displayComputerList(computers) {
  // Returns an HTML link for each category in the array
  const compLinks = computers.map(comp => {
    // The link has an onclick handler which will call updateProductsView(id) pasing the category id as a parameter
    return `<a href="#" class="list-group-item list-group-item-action" onclick="updateEventsView('${comp.id}')">${comp.name}</a>`;
  });

  // use  unshift to add a 'Show all' link at the start of the array of compLinks
  compLinks.unshift(`<a href="#" class="list-group-item list-group-item-action" onclick="loadAndDisplayData()">Show all</a>`);

  // Set the innerHTML of the productRows element = the links contained in complinks
  computerList.innerHTML = compLinks.join('');
}

async function updateEventsView(compRef) {
  const events = await getEventsByComputerId(compRef);
  console.log(events);
  displayEventList(events);
}

// Get JSON array of events
// Async call
async function loadAndDisplayData() {
  // Load all computers and display
  // load all events and display 
  const computers = await getAllComputers(); //await getAllDocs(COMPUTER_COLLECTION);
  displayComputerList(computers);
  console.log('computers: ', computers);

  // load all events and display 
  const events = await getAllEvents();
  console.log('events:', events);
  displayEventList(events);
}


// Update page with AJAX call ever 5000ms
function doPoll() {
  loadAndDisplayData();
  setTimeout(doPoll, 5000);
}

// Load data
loadAndDisplayData();
//doPoll();