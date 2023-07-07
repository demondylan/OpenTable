const { Reservation } = require("../db/models"); // Assuming you have imported the Reservation model

// Function to delete expired reservations
async function deleteExpiredReservations() {
  try {
    // Get the current time minus one hour
    const currentTimeMinusOneHour = new Date(Date.now() - 60 * 60 * 1000);

    // Find reservations that are past their time by one hour
    const expiredReservations = await Reservation.findAll({
      where: {
        date: {
          [Op.lt]: currentTimeMinusOneHour,
        },
      },
    });

    // Delete the expired reservations
    await Reservation.destroy({
      where: {
        date: {
          [Op.lt]: currentTimeMinusOneHour,
        },
      },
    });

    console.log(`Deleted ${expiredReservations.length} expired reservations.`);
  } catch (error) {
    console.error('Error cleaning up expired reservations:', error);
  }
}

// Run the cleanup function initially
deleteExpiredReservations();

// Schedule the cleanup function to run every hour
setInterval(deleteExpiredReservations, 60 * 60 * 1000);