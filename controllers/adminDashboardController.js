const db = require("../config/db"); // Assuming this is your database connection file

// Controller function to fetch counts
exports.getCounts = async (req, res) => {
  try {
    // Querying counts from all tables
    const [users] = await db.execute("SELECT COUNT(*) AS count FROM users");
    const [faultCodes] = await db.execute(
      "SELECT COUNT(*) AS count FROM fault_codes"
    );
    const [chatScreenMessages] = await db.execute(
      "SELECT COUNT(*) AS count FROM chat_screen_message"
    );
    const [contactMessages] = await db.execute(
      "SELECT COUNT(*) AS count FROM contact_messages"
    );

    // Structuring the response
    const data = {
      users: users[0].count,
      fault_codes: faultCodes[0].count,
      chat_screen_messages: chatScreenMessages[0].count,
      contact_messages: contactMessages[0].count,
    };

    res.status(200).json({
      success: true,
      message: "Counts fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching counts",
    });
  }
};
