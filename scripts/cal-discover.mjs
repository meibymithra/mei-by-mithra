#!/usr/bin/env node

/**
 * Cal.com Event Type Discovery Tool
 * Queries the Cal.com API to find event types and their booking URLs
 */

const API_KEY = process.env.CAL_API_KEY || "cal_live_5fe62070ea5fe84e1dcc0edde8c7b4b9";
const API_BASE = "https://api.cal.com/v2";

async function fetchCalApi(endpoint, method = "GET", body = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Cal.com API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error.message);
    return null;
  }
}

async function discoverBookingUrls() {
  console.log("🔍 Discovering Cal.com event types and booking URLs...\n");

  // Get current user info
  console.log("1️⃣  Fetching user profile...");
  const userRes = await fetchCalApi("/me");
  if (!userRes || !userRes.data) {
    console.error("❌ Could not fetch user profile. Check your API key.");
    return;
  }

  const user = userRes.data;
  console.log(`✅ User: ${user.name || user.email}`);
  console.log(`   Username: ${user.username}`);
  console.log(`   Email: ${user.email}\n`);

  // Get event types
  console.log("2️⃣  Fetching event types...");
  const eventTypesRes = await fetchCalApi("/event-types");
  if (!eventTypesRes || !eventTypesRes.data) {
    console.error("❌ Could not fetch event types.");
    return;
  }

  // Extract event types from response structure
  let eventTypes = [];
  const userUsername = user.username;
  
  if (eventTypesRes.data.eventTypeGroups && Array.isArray(eventTypesRes.data.eventTypeGroups)) {
    eventTypesRes.data.eventTypeGroups.forEach(group => {
      if (group.eventTypes && Array.isArray(group.eventTypes)) {
        eventTypes.push(...group.eventTypes);
      }
    });
  }

  if (!eventTypes || eventTypes.length === 0) {
    console.warn("⚠️  No event types found.");
    return;
  }

  console.log(`✅ Found ${eventTypes.length} event type(s)\n`);

  // List event types and generate booking URLs
  console.log("📅 Event Types and Booking URLs:");
  console.log("━".repeat(80));

  const bookingUrls = [];
  eventTypes.forEach((et, idx) => {
    const bookingUrl = `https://cal.com/${userUsername}/${et.slug}`;
    bookingUrls.push(bookingUrl);

    console.log(`\n${idx + 1}. ${et.title || et.slug}`);
    console.log(`   Slug: ${et.slug}`);
    console.log(`   Duration: ${et.length} min`);
    console.log(`   Booking URL: ${bookingUrl}`);
  });

  console.log("\n" + "━".repeat(80));
  console.log("\n🎯 Recommended Environment Variables:\n");
  console.log("# Use the first event type's booking URL (or choose any from above)");
  console.log(`CAL_BOOKING_URL="${bookingUrls[0]}"`);
  console.log(`NEXT_PUBLIC_CAL_BOOKING_URL="${bookingUrls[0]}"`);
  console.log("\n# Keep the webhook secret as-is for your setup:");
  console.log(`CAL_WEBHOOK_SECRET="meibymithra" # or update to your actual webhook secret\n`);

  return { user, eventTypes, bookingUrls };
}

// Run discovery
discoverBookingUrls().catch(console.error);
