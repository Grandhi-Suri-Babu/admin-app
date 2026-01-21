/**
 * Form Field Definitions
 * Each field has: name, label, type, required, section, options (for select fields)
 */

import {
  channels,
  languages,
  statuses,
  yesNoOptions,
  subscriptionOptions,
  moderationLevels,
  eventTypes,
  newsTypes,
  audioTypes
} from './refData';

// Common fields - always visible
export const commonFields = [
  {
    name: 'channel',
    label: 'Channel',
    type: 'select',
    required: true,
    options: channels
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: true
  },
  {
    name: 'tags',
    label: 'Tags',
    type: 'text',
    required: true,
    placeholder: 'Comma separated tags'
  },
  {
    name: 'language',
    label: 'Language',
    type: 'select',
    required: true,
    options: languages
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: statuses
  },
  {
    name: 'publishDate',
    label: 'Publish Date',
    type: 'date',
    required: true
  },
  {
    name: 'contentExpiry',
    label: 'Content Expiry',
    type: 'date',
    required: false
  }
];

// News specific fields
export const newsFields = [
  {
    name: 'newsTitle',
    label: 'News Title',
    type: 'text',
    required: false
  },
  {
    name: 'newsType',
    label: 'News Type',
    type: 'select',
    required: false,
    options: newsTypes
  },
  {
    name: 'newsThumbnailUrl',
    label: 'Thumbnail Url',
    type: 'url',
    required: false,
    validateUrl: true
  },
  {
    name: 'newsUrl',
    label: 'Url',
    type: 'url',
    required: false,
    validateUrl: true
  },
  {
    name: 'newsIsPremium',
    label: 'Is Premium',
    type: 'select',
    required: false,
    options: yesNoOptions
  },
  {
    name: 'readingTime',
    label: 'Reading Time (minutes)',
    type: 'number',
    required: false,
    min: 0
  },
  {
    name: 'pushNotification',
    label: 'Push Notification',
    type: 'select',
    required: false,
    options: yesNoOptions
  },
  {
    name: 'pushNotificationText',
    label: 'Push Notification Text',
    type: 'text',
    required: false
  }
];

// Audio specific fields (renamed from Radio)
export const audioFields = [
  {
    name: 'audioPodcastName',
    label: 'Audio Podcast Name',
    type: 'text',
    required: false
  },
  {
    name: 'audioType',
    label: 'Audio Type',
    type: 'select',
    required: false,
    options: audioTypes
  },
  {
    name: 'audioThumbnailUrl',
    label: 'Thumbnail Url',
    type: 'url',
    required: false,
    validateUrl: true
  },
  {
    name: 'audioUrl',
    label: 'Audio URL',
    type: 'url',
    required: false,
    validateUrl: true
  },
  {
    name: 'audioDuration',
    label: 'Duration (minutes)',
    type: 'number',
    required: false,
    min: 0
  },
  {
    name: 'showName',
    label: 'Show Name',
    type: 'text',
    required: false
  },
  {
    name: 'hostName',
    label: 'Host Name',
    type: 'text',
    required: false
  },
  {
    name: 'scheduleBroadcastDate',
    label: 'Schedule Broadcast Date',
    type: 'date',
    required: false
  },
  {
    name: 'isLive',
    label: 'Is Live',
    type: 'select',
    required: false,
    options: yesNoOptions
  }
];

// Event specific fields
export const eventFields = [
  {
    name: 'eventName',
    label: 'Event Name',
    type: 'text',
    required: false
  },
  {
    name: 'eventStartDate',
    label: 'Event Start Date',
    type: 'date',
    required: false
  },
  {
    name: 'eventEndDate',
    label: 'Event End Date',
    type: 'date',
    required: false
  },
  {
    name: 'eventLocation',
    label: 'Event Location',
    type: 'text',
    required: false
  },
  {
    name: 'eventVenue',
    label: 'Event Venue',
    type: 'text',
    required: false
  },
  {
    name: 'registrationUrl',
    label: 'Registration URL',
    type: 'url',
    required: false,
    validateUrl: true
  },
  {
    name: 'registrationPdfUrl',
    label: 'Registration PDF URL',
    type: 'url',
    required: false,
    validateUrl: true
  },
  {
    name: 'eventType',
    label: 'Event Type',
    type: 'select',
    required: false,
    options: eventTypes
  },
  {
    name: 'ticketPrice',
    label: 'Ticket Price',
    type: 'number',
    required: false,
    min: 0
  },
  {
    name: 'maxAttendees',
    label: 'Max Attendees',
    type: 'number',
    required: false,
    min: 0
  }
];

// Chat fields - available for all content types
export const chatFields = [
  {
    name: 'discussionTopic',
    label: 'Discussion Topic',
    type: 'text',
    required: false
  },
  {
    name: 'allowedSubscription',
    label: 'Allowed Subscription',
    type: 'select',
    required: false,
    options: subscriptionOptions
  },
  {
    name: 'moderationLevel',
    label: 'Moderation Level',
    type: 'select',
    required: false,
    options: moderationLevels
  }
];

// Section configuration
export const sections = [
  {
    id: 'news',
    title: 'News Section',
    fields: newsFields
  },
  {
    id: 'audio',
    title: 'Audio Section',
    fields: audioFields
  },
  {
    id: 'events',
    title: 'Event Section',
    fields: eventFields
  },
  {
    id: 'chat',
    title: 'Chat Section',
    fields: chatFields
  }
];

// Get mandatory field names for validation
export const mandatoryFields = [
  'channel',
  'description',
  'tags',
  'language',
  'status',
  'publishDate'
];

// Get all URL fields that need validation
export const urlFieldNames = [
  'newsThumbnailUrl',
  'newsUrl',
  'audioThumbnailUrl',
  'audioUrl',
  'registrationUrl',
  'registrationPdfUrl'
];
