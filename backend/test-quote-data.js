// Test script to check what data is being sent to the quotes endpoint
const testData = {
  destination: "Thailand",
  countryOfResidence: "Greece",
  startDate: "2024-08-01",
  endDate: "2024-08-15",
  tripType: "single",
  numberOfTravelers: 1,
  travelers: [
    {
      firstName: "Test",
      lastName: "User",
      age: "30",
      email: "test@example.com",
      phone: "+1234567890",
      vaxId: "",
      nationality: ""
    }
  ],
  selectedQuote: {
    id: "basic",
    name: "Regular Basic",
    type: "basic",
    price: 40
  },
  additionalPolicies: [],
  totalAmount: 40
};

console.log("Test data structure:");
console.log(JSON.stringify(testData, null, 2));

console.log("\nExtracted fields:");
const { destination, countryOfResidence, startDate, endDate, tripType, numberOfTravelers } = testData;
console.log("destination:", destination);
console.log("countryOfResidence:", countryOfResidence);
console.log("startDate:", startDate);
console.log("endDate:", endDate);
console.log("tripType:", tripType);
console.log("numberOfTravelers:", numberOfTravelers);
