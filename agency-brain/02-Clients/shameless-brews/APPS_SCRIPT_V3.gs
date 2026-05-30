// SHAMELESS BREWS — Apps Script V3
// STANDALONE script — uses openById NOT getActiveSpreadsheet
const SHEET_ID = "1VW9hDY6XIfZJ1VqSRoojUN1EWz2WvBsr3RgSqK-LVDQ";
const NOTIFY_EMAIL = "shamelessbidetsceo@gmail.com";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const type = data.type || "reservation";
    if (type === "order")      return handleOrder(data);
    if (type === "subscriber") return handleSubscriber(data);
    return handleReservation(data);
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function doGet(e) {
  return jsonResponse({ ok: true, service: "Shameless Brews API v3" });
}

function handleOrder(data) {
  const sheet = getOrCreateSheet("Orders", [
    "Timestamp","Name","Email","Phone","Address","Amount","Tier","Product","Stripe Session ID"
  ]);
  sheet.appendRow([
    new Date().toISOString(),
    data.name    || "",
    data.email   || "",
    data.phone   || "",
    data.address || "",
    data.amount  || 0,
    data.tier    || "",
    data.product || "",
    data.stripe_session_id || ""
  ]);
  GmailApp.sendEmail(NOTIFY_EMAIL,
    "New Stripe Order — Shameless Brews",
    "Name: "    + (data.name    || "—") + "\n" +
    "Email: "   + (data.email   || "—") + "\n" +
    "Phone: "   + (data.phone   || "—") + "\n" +
    "Product: " + (data.product || "—") + "\n" +
    "Amount: $" + (data.amount  || "0") + "\n" +
    "Address: " + (data.address || "—") + "\n" +
    "Stripe: "  + (data.stripe_session_id || "—")
  );
  if (data.email) {
    GmailApp.sendEmail(data.email,
      "Your Shameless Brews order is confirmed! 🍊",
      "Hi " + (data.name ? data.name.split(" ")[0] : "there") + ",\n\n" +
      "Your order is confirmed!\n" +
      "Product: " + (data.product || "") + "\n" +
      "Amount: $" + (data.amount  || "") + "\n\n" +
      "We will reach out with shipping updates.\n\n" +
      "Stay fresh,\nShameless Brews Team",
      { replyTo: NOTIFY_EMAIL, name: "Shameless Brews" }
    );
  }
  return jsonResponse({ ok: true, message: "Order logged" });
}

function handleReservation(data) {
  const sheet = getOrCreateSheet("Reservations", [
    "Timestamp","Name","Email","Phone","Quantity","Tier","Notes"
  ]);
  sheet.appendRow([
    new Date().toISOString(),
    data.name     || "",
    data.email    || "",
    data.phone    || "",
    data.quantity || "1",
    data.tier     || "",
    data.notes    || ""
  ]);
  GmailApp.sendEmail(NOTIFY_EMAIL,
    "New Pickup Reservation — Shameless Brews",
    "Name: "  + (data.name  || "—") + "\n" +
    "Email: " + (data.email || "—") + "\n" +
    "Phone: " + (data.phone || "—") + "\n" +
    "Tier: "  + (data.tier  || "—")
  );
  if (data.email) {
    GmailApp.sendEmail(data.email,
      "Your Shameless Brews pickup is reserved! 🍊",
      "Hi " + (data.name ? data.name.split(" ")[0] : "there") + ",\n\n" +
      "Your pickup is confirmed! We will reach out to confirm your pickup time.\n\n" +
      "Stay fresh,\nShameless Brews Team",
      { replyTo: NOTIFY_EMAIL, name: "Shameless Brews" }
    );
  }
  return jsonResponse({ ok: true, message: "Reservation received" });
}

function handleSubscriber(data) {
  const sheet = getOrCreateSheet("Subscribers", [
    "Timestamp","Email","Name","Source"
  ]);
  const emails = sheet.getRange(2, 2, Math.max(sheet.getLastRow()-1, 1), 1).getValues().flat();
  if (emails.includes(data.email)) return jsonResponse({ ok: true, message: "Already subscribed" });
  sheet.appendRow([new Date().toISOString(), data.email||"", data.name||"", data.source||"lead-magnet"]);
  return jsonResponse({ ok: true, message: "Subscribed" });
}

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    const r = sheet.getRange(1, 1, 1, headers.length);
    r.setBackground("#16a34a");
    r.setFontColor("#ffffff");
    r.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
