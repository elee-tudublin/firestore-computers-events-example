/*
  Functions used to work with Event related data
*/

// Get all events as a list (array) of Event Objects
// Also replace the Computer id with name in each event
async function getAllEvents() {
  // First get all documents from the collection named events
  const eventDocs = await getAllDocs('events');

  // https://stackoverflow.com/questions/40140149/use-async-await-with-array-map
  // Use Array.map to iterate through the eventDocs
  let eventsArray = eventDocs.map(async doc => {
    // The computer associated with this event doc
    let computer;
    // Get data from the current event doc
    const event = await doc.data();
    // Show the computer name instead of id for each event
    // We need to get the computer associated with this event (if it exists)
    // To find its name...
    if (event.computer) {
      // Get the document for the associated computer
      let comp = await event.computer.get();
      // Extract the data
      let data = comp.data();
      // Create a new computer object
      computer = new Computer(comp.id, data.name, data.description, data.location);
    }
    // return a new object for this event (it will be added to the eventsArray)
    return new Event(doc.id,
      event.type,
      event.level,
      event.timeStamp,
      // the computer (using this to replace the id value)
      // the computer object includes everything but could use computer.name 
      computer,
      event.service,
      event.user,
      event.description
    );
  });

  // await Promise.all to make sure all async calls from array map have completed
  // then return eventsArray
  return await Promise.all(eventsArray);
}

// Get all events for a computer by id
async function getEventsByComputerId(compId) {
  // This computer is common to all the events here
  const computer = await getComputerById(compId);
  // To store the list of event Objects
  let eventsArray;

  try {
    // Get a reference to the computer
    computerDocRef = await getDocRef('computers', compId);
    // Get all events with matching computer id
    let snapshot = await database.collection('events')
      .where('computer', '==', computerDocRef)
      .get();

    eventsArray = snapshot.docs.map(async doc => {
      const event = await doc.data();
      // return a new object for this event (it will be added to the eventsArray)
      return new Event(doc.id,
        event.type,
        event.level,
        event.timeStamp,
        computer,
        event.service,
        event.user,
        event.description
      );
    });
  } catch (err) {
    // catch errors
    console.log('firestore error getting events by id: ', err);
  }

  // await Promise.all to make sure all async calls from array map have completed
  // then return eventsArray
  return await Promise.all(eventsArray);
}