const axios = require("axios"); // Import Axios for making API requests

// Fetch MOT history from API
exports.getMOTHistory = async (req, res) => {
  const { registrationNumber } = req.query; // Get the registration number from query parameters

  if (!registrationNumber) {
    return res.status(400).json({ message: "Registration number is required" });
  }

  const apiKey = "a132e5405ec6de964a3530472f6761a8"; // API key
  const apiUrl = `https://api.checkcardetails.co.uk/vehicledata/mot?apikey=${apiKey}&vrm=${registrationNumber}`;

  try {
    // Make API request
    const response = await axios.get(apiUrl);

    // Check if the response contains data
    if (response.data) {
      res.status(200).json({
        success: true,
        message: "MOT history fetched successfully",
        data: response.data,
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: "No MOT history found for the given registration number" 
      });
    }
  } catch (error) {
    console.error("Error fetching MOT history:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch MOT history" 
    });
  }
};
