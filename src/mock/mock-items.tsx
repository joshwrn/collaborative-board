import { Item } from '@/state/items'
import { nanoid } from 'nanoid'

export const MOCK_ITEMS: Item[] = [
  {
    id: nanoid(),
    from: 'bill gates',
    to: 'SELF',
    address: 'bill.gates@microsoft.com',
    subject: 'New Windows',
    body: [
      {
        src: 'https://codesandbox.io/embed/sbf2i?view=preview&module=%2Fsrc%2FEffects.js&hidenavigation=1',
        sandbox:
          'allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts',
        allow:
          'accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking',
        title: 'Sparks and effects',
      },
    ],
  },
  {
    id: nanoid(),
    from: 'sender@companyA.com',
    to: 'Recipient Receiver',
    address: 'recipient@companyB.com',
    subject: 'Weekly Project Status Update',
    body: [
      "Hi Team, Attached is the status report for this week's project milestones. Let me know if you need any further details. Regards, Sender",
    ],
  },
  {
    id: nanoid(),
    from: 'ceo@yourcompany.com',
    to: 'All Staff Members',
    address: 'allstaff@yourcompany.com',
    subject: 'Exciting News: Company Expansion!',
    body: [
      "Dear Team, I am thrilled to announce our plans for expanding into new markets. Your dedication has made this possible. Let's continue to grow together! Best, CEO",
    ],
  },
  {
    id: nanoid(),
    from: 'noreply@bankinginstitution.com',
    to: 'Account Holder',
    address: 'account_holder@email.com',
    subject: 'Important: Account Security Update',
    body: [
      'Dear Customer, We are upgrading our security systems. Click the link below to update your account information for a seamless banking experience. Thank you, Banking Institution',
    ],
  },
  {
    id: nanoid(),
    from: 'service@subscriptionprovider.com',
    to: 'User One Two Three',
    address: 'user123@email.com',
    subject: 'Renewal Reminder: Premium Subscription',
    body: [
      "Hi User, Your premium subscription is expiring soon. Don't miss out on uninterrupted service! Renew now and enjoy our exclusive features. Regards, Subscription Provider",
    ],
  },
  {
    id: nanoid(),
    from: 'info@conferenceorganizer.com',
    to: 'Attendee Name',
    address: 'attendee@email.com',
    subject: 'Last Chance: Register for the Conference!',
    body: [
      'Hello Attendee, This is your final chance to register for our upcoming conference. Join industry experts for insightful sessions. Register now before seats fill up! Best regards, Conference Organizer',
    ],
  },
  {
    id: nanoid(),
    from: 'updates@socialmedia.com',
    to: 'User Four Five Six',
    address: 'user456@email.com',
    subject: 'Your Recent Activity Summary',
    body: [
      "Hi User, Here's a summary of your recent activity on our platform. Keep engaging with your connections! Cheers, Social Media Updates",
    ],
  },
  {
    id: nanoid(),
    from: 'support@softwarecompany.com',
    to: 'Valued Customer',
    address: 'customer@email.com',
    subject: 'Issue Resolution: Ticket #12345',
    body: [
      'Dear Customer, We have successfully resolved the issue you reported (Ticket #12345). Let us know if you need further assistance. Regards, Software Company Support',
    ],
  },
  {
    id: nanoid(),
    from: 'marketing@ecommercestore.com',
    to: 'Loyal Customer Name',
    address: 'loyalcustomer@email.com',
    subject: 'Exclusive Offer: Limited Time!',
    body: [
      'Hello Loyal Customer, You are exclusively invited to our flash sale event. Grab your favorite items at discounted prices! Happy shopping! Regards, E-commerce Store Marketing',
    ],
  },
  {
    id: nanoid(),
    from: 'notifications@travelagency.com',
    to: 'Traveler Person',
    address: 'traveler@email.com',
    subject: 'Your Travel Itinerary: Trip to Paradise',
    body: [
      'Dear Traveler, Your itinerary for the upcoming trip has been finalized. Check the details attached and get ready for an unforgettable experience! Best regards, Travel Agency Notifications',
    ],
  },
  {
    id: nanoid(),
    from: 'updates@weatherforecast.com',
    to: 'Weather Subscriber',
    address: 'weathersubscriber@email.com',
    subject: 'Weekly Weather Forecast: Plan Ahead!',
    body: [
      "Hi Subscriber, Here's your weekly weather forecast. Stay informed and plan your week accordingly. Have a great day! Warm regards, Weather Forecast Updates",
    ],
  },
]
