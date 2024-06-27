function generateOrderId() {
    // Get the current date and time
    const date = new Date();

    // Format the date as YYYYMMDD
    const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;

    // Format the time as HHMM
    const timePart = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;

    // Generate a random sequence number between 100 and 999
    const sequenceNumber = Math.floor(Math.random() * 900) + 100;

    // Combine the date part, time part and the sequence number to get the order ID
    const orderId = `${datePart}${timePart}${sequenceNumber}`;

    return orderId;
}

console.log(generateOrderId()); // Outputs something like "202211122316002"