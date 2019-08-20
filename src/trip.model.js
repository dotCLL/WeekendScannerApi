// Trip Object
// {
//   price: price in aud,
//   departureFlight: {
//     carrier: airline,
//     departureDate: date american format,
//     departureTime: 24 hour time,
//     arrivalDate: date american format,
//     arrivalTime: 24 hour time
//   },
//   returnFlight: {
//     carrier: airline,
//     departureDate: date american format,
//     departureTime: 24 hour time,
//     arrivalDate: date american format,
//     arrivalTime: 24 hour time
//   }
// }
exports.buildTripObjects = function(itineraries, carriers, legs) {
  var trips = [];
  itineraries.forEach(itinerary => {
    var trip = {
      price: itinerary.PricingOptions[0].Price,
      departureFlight: null,
      returnFlight: null
    };
    var legCount = 0;
    for (let leg of legs) {
      if (leg.Id === itinerary.OutboundLegId) {
        trip.departureFlight = buildFlightDetailsObject(carriers, leg);
        legCount++;
      }
      if (leg.Id === itinerary.InboundLegId) {
        trip.returnFlight = buildFlightDetailsObject(carriers, leg)
        legCount++;
      }
      if (legCount === 2) { break; }
    }
    trips.push(trip);
  })
  return trips;
}

function buildFlightDetailsObject(carriers, leg) {
  var departTimeStringSplit = leg.Departure.split("T");
  var arrivalTimeStringSplit = leg.Arrival.split("T");
  return {
    carrier: getCarrierName(carriers, leg.Carriers[0]),
    departureDate: departTimeStringSplit[0],
    departureTime: departTimeStringSplit[1],
    arrivalDate: arrivalTimeStringSplit[0],
    arrivalTime: arrivalTimeStringSplit[1]
  }
}

function getCarrierName(carrierList, carrierID) {
  var filteredCarrierList = carrierList.filter(carrierObj => { return carrierObj.Id === carrierID });
  return filteredCarrierList[0].Name;
}
