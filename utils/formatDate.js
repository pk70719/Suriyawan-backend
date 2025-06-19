const formatDate = (dateInput) => {
  try {
    if (!dateInput) return "N/A";

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short", // e.g., Jan, Feb
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("❌ Date formatting error:", error);
    return "Format Error";
  }
};

module.exports = formatDate;
