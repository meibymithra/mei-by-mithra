# Cal.com MCP Setup & Configuration

## Overview
The Cal.com MCP server is now properly configured in VS Code and connected via your API key. Event types and booking URLs have been discovered from your Cal.com account.

## What Was Done

### 1. MCP Configuration (`.vscode/mcp.json`)
Updated the MCP config to use the official Cal.com MCP server format:
- **Top-level key**: Changed from `servers` to `mcpServers`
- **Cal.com entry**: Uses `npx @calcom/cal-mcp@latest --all-tools`
- **API Key**: Stored in environment variable `CAL_API_KEY`
- **All tools enabled**: Added `--all-tools` flag for full Cal.com API tool access

### 2. Discovery Script (`scripts/cal-discover.mjs`)
Created a utility script that:
- Fetches your Cal.com user profile
- Queries all event types from your account
- Generates proper booking URLs for each event type
- Outputs recommended environment variable values

### 3. Environment Variables (`.env.local`)
Updated booking URLs based on discovered event types:

```env
CAL_BOOKING_URL="https://cal.com/mithra-krishnamoorthy/session"
NEXT_PUBLIC_CAL_BOOKING_URL="https://cal.com/mithra-krishnamoorthy/session"
CAL_WEBHOOK_SECRET="meibymithra"
```

**Key Notes:**
- Using the "session" event type (60 min) as the main booking endpoint
- These are actual Cal.com scheduling pages, NOT webhook URLs
- Both booking URLs are set to the same value (the primary one used)

## Available Event Types

Your Cal.com account has 4 event types:

| # | Title | Slug | Duration | Booking URL |
|---|-------|------|----------|------------|
| 1 | 30 min meeting | `30min` | 30 min | https://cal.com/mithra-krishnamoorthy/30min |
| 2 | 15 min meeting | `15min` | 15 min | https://cal.com/mithra-krishnamoorthy/15min |
| 3 | Secret meeting | `secret` | 15 min | https://cal.com/mithra-krishnamoorthy/secret |
| 4 | Session | `session` | 60 min | https://cal.com/mithra-krishnamoorthy/session |

You can change `CAL_BOOKING_URL` and `NEXT_PUBLIC_CAL_BOOKING_URL` to any of these if you prefer a different event type.

## How to Use the MCP

### In VS Code (Claude Desktop or Cursor)
1. Open Command Palette: `Ctrl+Shift+P`
2. Search for `MCP` commands
3. Select "MCP: Open server" or similar
4. Choose `calcom` from the list
5. The MCP will now be active in the chat

### Available Cal.com Tools (via MCP)
By default:
- `getBooking` - fetch booking details
- `getBookings` - list all bookings
- `createBooking` - create a new booking
- `rescheduleBooking` - reschedule an existing booking
- `cancelBooking` - cancel a booking
- `getEventTypes` - list event types
- `getEventTypeById` - get specific event type details
- `updateEventType` - modify event type settings
- `deleteEventType` - remove an event type

Plus many more with `--all-tools` enabled.

## Testing the Setup

Run the discovery script anytime to verify your setup:
```bash
node scripts/cal-discover.mjs
```

This will show:
- Your Cal.com profile info
- All event types and their booking URLs
- Recommended environment variable values

## API Key Security

⚠️ **Important**: Your Cal.com API key (`cal_live_5fe62070ea5fe84e1dcc0edde8c7b4b9`) is:
- Stored in `.vscode/mcp.json` for local development
- Stored in `.env.local` (NOT committed to git)
- Must be rotated if ever exposed publicly

Never share or commit these keys to version control.

## Next Steps

1. Test the booking page at: https://cal.com/mithra-krishnamoorthy/session
2. Verify the `/book` page now renders the Cal.com iframe correctly
3. Test a full booking flow to ensure webhooks are properly configured
4. Use the MCP to query or modify event types as needed

## Troubleshooting

**MCP not connecting?**
- Verify `.vscode/mcp.json` has valid JSON
- Check `CAL_API_KEY` environment variable is set
- Restart VS Code

**Booking page showing error?**
- Verify `CAL_BOOKING_URL` points to a valid Cal.com booking page (not a webhook)
- Check that the URL format matches: `https://cal.com/{username}/{event-slug}`
- Test the URL directly in a browser

**Webhooks not firing?**
- Verify `CAL_WEBHOOK_SECRET` matches your Cal.com webhook settings
- Check `/api/webhooks/calendly` route is accessible
- Review webhook logs in Cal.com admin dashboard
