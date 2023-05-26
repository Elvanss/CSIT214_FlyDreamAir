// Function to calculate points based on distance
function calculatePoints(fromLocation, toLocation) {
  const distanceMap = {
    Sydney: {
      Sydney: 0,
      Melbourne: 876,
      Brisbane: 732,
      Perth: 3936,
    },
    Melbourne: {
      Sydney: 876,
      Melbourne: 0,
      Brisbane: 1658,
      Perth: 2737,
    },
    Brisbane: {
      Sydney: 732,
      Melbourne: 1658,
      Brisbane: 0,
      Perth: 4338,
    },
    Perth: {
      Sydney: 3936,
      Melbourne: 2737,
      Brisbane: 4338,
      Perth: 0,
    },
  };

  const distance = distanceMap[fromLocation][toLocation];
  const pointsPerKilometer = 10;
  const points = distance * pointsPerKilometer;

  return points;
}

// Function to handle the earn form submission
async function handleEarnFormSubmit(event) {
  event.preventDefault();

  const flightNumber = document.getElementById("flightNumber").value;
  const departureDate = document.getElementById("departureDate").value;
  const fromLocation = document.getElementById("fromLocation").value;
  const toLocation = document.getElementById("toLocation").value;

  const points = calculatePoints(fromLocation, toLocation);

  try {
    await addPoints(points);
    const updatedPoints = await getPoints();
    updateNavPoints(updatedPoints);

    const resultContainer = document.getElementById("result");
    const pointsElement = document.getElementById("earnedPoints");
    pointsElement.textContent = points;
    resultContainer.style.display = "block";
  } catch (error) {
    console.error(error);
  }
}

// Function to update the points in the navigation bar
function updateNavPoints(points) {
  const navPointsElement = document.getElementById("navPoints");
  navPointsElement.textContent = points;
}

// Attach event listener to the earn form
document.addEventListener("DOMContentLoaded", function() {
  const earnForm = document.getElementById("flightForm");
  earnForm.addEventListener("submit", handleEarnFormSubmit);

  // Update points in the navigation bar when the page loads
  getPoints()
    .then((points) => {
      updateNavPoints(points);
    })
    .catch((error) => {
      console.error(error);
    });
});
