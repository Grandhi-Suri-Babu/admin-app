/**
 * Transform form data to API payload format
 * Converts field names and formats to match the expected API structure
 */

/**
 * Format date from YYYY-MM-DD to DD-MM-YYYY HH:MM:SS
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {string} Date in DD-MM-YYYY 00:00:00 format
 */
const formatDateForApi = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year} 00:00:00`;
};

/**
 * Convert Yes/No string to boolean
 * @param {string} value - 'Yes' or 'No'
 * @returns {boolean|undefined}
 */
const yesNoToBoolean = (value) => {
  if (value === 'Yes') return true;
  if (value === 'No') return false;
  return undefined;
};

/**
 * Transform news record to API format
 * @param {Object} record - News record from form
 * @returns {Object} Transformed news record for API
 */
const transformNewsRecord = (record) => {
  const transformed = {};
  
  if (record.newsTitle) transformed.newstitle = record.newsTitle;
  if (record.newsType) transformed.newstype = record.newsType;
  if (record.newsThumbnailUrl) transformed.newsthumbnailurl = record.newsThumbnailUrl;
  if (record.newsUrl) transformed.newsurl = record.newsUrl;
  if (record.readingTime) transformed.readingtimeinminutes = parseInt(record.readingTime, 10);
  if (record.newsIsPremium) transformed.newsispremium = yesNoToBoolean(record.newsIsPremium);
  if (record.pushNotification) transformed.pushnotificationenabled = yesNoToBoolean(record.pushNotification);
  if (record.pushNotificationText) transformed.pushnotificationtext = record.pushNotificationText;
  
  return transformed;
};

/**
 * Transform audio record to API format (API uses 'radio')
 * @param {Object} record - Audio record from form
 * @returns {Object} Transformed radio record for API
 */
const transformAudioRecord = (record) => {
  const transformed = {};
  
  if (record.audioPodcastName) transformed.audiopodcastname = record.audioPodcastName;
  if (record.audioType) transformed.audiopodcasttype = record.audioType;
  if (record.audioUrl) transformed.audiourl = record.audioUrl;
  if (record.audioThumbnailUrl) transformed.audiothumbnailurl = record.audioThumbnailUrl;
  if (record.audioDuration) transformed.audioduration = parseInt(record.audioDuration, 10);
  if (record.showName) transformed.showname = record.showName;
  if (record.hostName) transformed.hostname = record.hostName;
  if (record.scheduleBroadcastDate) transformed.schedulebroadcasttime = formatDateForApi(record.scheduleBroadcastDate);
  if (record.isLive) transformed.islive = yesNoToBoolean(record.isLive);
  
  return transformed;
};

/**
 * Transform event record to API format
 * @param {Object} record - Event record from form
 * @returns {Object} Transformed event record for API
 */
const transformEventRecord = (record) => {
  const transformed = {};
  
  if (record.eventName) transformed.eventname = record.eventName;
  if (record.eventStartDate) transformed.eventstartdate = formatDateForApi(record.eventStartDate);
  if (record.eventEndDate) transformed.eventenddate = formatDateForApi(record.eventEndDate);
  if (record.eventLocation) transformed.eventlocation = record.eventLocation;
  if (record.eventVenue) transformed.eventvenue = record.eventVenue;
  if (record.eventType) transformed.eventtype = record.eventType;
  if (record.registrationUrl) transformed.registrationurl = record.registrationUrl;
  if (record.registrationPdfUrl) transformed.registrationpdf = record.registrationPdfUrl;
  if (record.ticketPrice) transformed.ticketprice = parseFloat(record.ticketPrice);
  if (record.maxAttendees) transformed.maxattendees = parseInt(record.maxAttendees, 10);
  
  return transformed;
};

/**
 * Transform chat record to API format
 * @param {Object} record - Chat record from form
 * @returns {Object} Transformed chat record for API
 */
const transformChatRecord = (record) => {
  const transformed = {};
  
  if (record.discussionTopic) transformed.discussiontopic = record.discussionTopic;
  if (record.allowedSubscription) transformed.chatopentype = record.allowedSubscription;
  if (record.moderationLevel) transformed.moderationlevel = record.moderationLevel;
  
  return transformed;
};

/**
 * Transform complete form data to API payload format
 * @param {Object} commonData - Common form fields
 * @param {Object} records - Section records { news, audio, events, chat }
 * @returns {Object} API-ready payload
 */
export const transformFormToPayload = (commonData, records) => {
  const payload = {
    channel: commonData.channel || '',
    description: commonData.description || '',
    tags: commonData.tags || '',
    language: commonData.language || '',
    status: commonData.status || '',
    publisheddate: formatDateForApi(commonData.publishDate),
    contentexpirydate: formatDateForApi(commonData.contentExpiry),
    news: (records.news || []).map(transformNewsRecord),
    radio: (records.audio || []).map(transformAudioRecord), // API uses 'radio' not 'audio'
    events: (records.events || []).map(transformEventRecord),
    chat: (records.chat || []).map(transformChatRecord)
  };
  
  return payload;
};

