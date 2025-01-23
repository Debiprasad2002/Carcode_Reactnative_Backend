const axios = require("axios"); // Import Axios for API requests

// Fetch Full HPI Check Data
exports.getFullHPICheck = async (req, res) => {
  const { registrationNumber } = req.query; // Get registration number from query params

  if (!registrationNumber) {
    return res.status(400).json({ message: "Registration number is required" });
  }

  const apiKey = "a132e5405ec6de964a3530472f6761a8";
  const apiUrl = `https://api.checkcardetails.co.uk/vehicledata/carhistorycheck?apikey=${apiKey}&vrm=${registrationNumber}`;

  try {
    // Make API request
    const response = await axios.get(apiUrl);

    // Check if the response has data
    if (response.data) {
      res.status(200).json({
        success: true,
        message: "Full HPI check completed successfully",
        data: response.data
      });
    } else {
      res.status(404).json({ message: "No data found for the given registration number" });
    }
  } catch (error) {
    console.error("Error fetching HPI data:", error.message);
    res.status(500).json({ message: "Failed to fetch HPI data" });
  }
};



