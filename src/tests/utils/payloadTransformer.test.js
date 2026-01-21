import { transformFormToPayload } from '../../utils/payloadTransformer';

describe('payloadTransformer', () => {
  describe('transformFormToPayload', () => {
    test('transforms common fields correctly', () => {
      const commonData = {
        channel: 'Politics',
        description: 'Test description',
        tags: 'tag1, tag2',
        language: 'Tamil',
        status: 'Published',
        publishDate: '2026-09-01',
        contentExpiry: '2027-09-01'
      };
      const records = { news: [], audio: [], events: [], chat: [] };

      const result = transformFormToPayload(commonData, records);

      expect(result.channel).toBe('Politics');
      expect(result.description).toBe('Test description');
      expect(result.tags).toBe('tag1, tag2');
      expect(result.language).toBe('Tamil');
      expect(result.status).toBe('Published');
      expect(result.publisheddate).toBe('01-09-2026 00:00:00');
      expect(result.contentexpirydate).toBe('01-09-2027 00:00:00');
    });

    test('transforms news records correctly', () => {
      const commonData = { channel: 'Test' };
      const records = {
        news: [{
          newsTitle: 'Breaking News',
          newsType: 'Breaking News',
          newsThumbnailUrl: 'https://example.com/thumb.jpg',
          newsUrl: 'https://example.com/news',
          readingTime: '10',
          newsIsPremium: 'Yes',
          pushNotification: 'No',
          pushNotificationText: 'Alert text'
        }],
        audio: [],
        events: [],
        chat: []
      };

      const result = transformFormToPayload(commonData, records);

      expect(result.news).toHaveLength(1);
      expect(result.news[0].newstitle).toBe('Breaking News');
      expect(result.news[0].newstype).toBe('Breaking News');
      expect(result.news[0].newsthumbnailurl).toBe('https://example.com/thumb.jpg');
      expect(result.news[0].newsurl).toBe('https://example.com/news');
      expect(result.news[0].readingtimeinminutes).toBe(10);
      expect(result.news[0].newsispremium).toBe(true);
      expect(result.news[0].pushnotificationenabled).toBe(false);
      expect(result.news[0].pushnotificationtext).toBe('Alert text');
    });

    test('transforms audio records to radio format', () => {
      const commonData = { channel: 'Test' };
      const records = {
        news: [],
        audio: [{
          audioPodcastName: 'Tech Talk',
          audioType: 'Interview',
          audioUrl: 'https://example.com/audio.mp3',
          audioThumbnailUrl: 'https://example.com/thumb.jpg',
          audioDuration: '30',
          showName: 'Morning Show',
          hostName: 'John Doe',
          scheduleBroadcastDate: '2026-02-01',
          isLive: 'Yes'
        }],
        events: [],
        chat: []
      };

      const result = transformFormToPayload(commonData, records);

      // API uses 'radio' not 'audio'
      expect(result.radio).toHaveLength(1);
      expect(result.radio[0].audiopodcastname).toBe('Tech Talk');
      expect(result.radio[0].audiopodcasttype).toBe('Interview');
      expect(result.radio[0].audiourl).toBe('https://example.com/audio.mp3');
      expect(result.radio[0].audiothumbnailurl).toBe('https://example.com/thumb.jpg');
      expect(result.radio[0].audioduration).toBe(30);
      expect(result.radio[0].showname).toBe('Morning Show');
      expect(result.radio[0].hostname).toBe('John Doe');
      expect(result.radio[0].schedulebroadcasttime).toBe('01-02-2026 00:00:00');
      expect(result.radio[0].islive).toBe(true);
    });

    test('transforms event records correctly', () => {
      const commonData = { channel: 'Test' };
      const records = {
        news: [],
        audio: [],
        events: [{
          eventName: 'Tech Conference',
          eventStartDate: '2026-02-01',
          eventEndDate: '2026-02-15',
          eventLocation: 'Singapore',
          eventVenue: 'Convention Center',
          eventType: 'Paid',
          registrationUrl: 'https://example.com/register',
          registrationPdfUrl: 'https://example.com/brochure.pdf',
          ticketPrice: '55.99',
          maxAttendees: '100'
        }],
        chat: []
      };

      const result = transformFormToPayload(commonData, records);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].eventname).toBe('Tech Conference');
      expect(result.events[0].eventstartdate).toBe('01-02-2026 00:00:00');
      expect(result.events[0].eventenddate).toBe('15-02-2026 00:00:00');
      expect(result.events[0].eventlocation).toBe('Singapore');
      expect(result.events[0].eventvenue).toBe('Convention Center');
      expect(result.events[0].eventtype).toBe('Paid');
      expect(result.events[0].registrationurl).toBe('https://example.com/register');
      expect(result.events[0].registrationpdf).toBe('https://example.com/brochure.pdf');
      expect(result.events[0].ticketprice).toBe(55.99);
      expect(result.events[0].maxattendees).toBe(100);
    });

    test('transforms chat records correctly', () => {
      const commonData = { channel: 'Test' };
      const records = {
        news: [],
        audio: [],
        events: [],
        chat: [{
          discussionTopic: 'Tech News',
          allowedSubscription: 'Premium',
          moderationLevel: 'Strict'
        }]
      };

      const result = transformFormToPayload(commonData, records);

      expect(result.chat).toHaveLength(1);
      expect(result.chat[0].discussiontopic).toBe('Tech News');
      expect(result.chat[0].chatopentype).toBe('Premium');
      expect(result.chat[0].moderationlevel).toBe('Strict');
    });

    test('handles empty records', () => {
      const commonData = { channel: 'Test' };
      const records = { news: [], audio: [], events: [], chat: [] };

      const result = transformFormToPayload(commonData, records);

      expect(result.news).toEqual([]);
      expect(result.radio).toEqual([]);
      expect(result.events).toEqual([]);
      expect(result.chat).toEqual([]);
    });

    test('handles missing optional fields', () => {
      const commonData = {
        channel: 'Test',
        description: 'Desc',
        tags: 'tag',
        language: 'English',
        status: 'Draft',
        publishDate: '2026-01-01'
        // contentExpiry is missing
      };
      const records = { news: [], audio: [], events: [], chat: [] };

      const result = transformFormToPayload(commonData, records);

      expect(result.publisheddate).toBe('01-01-2026 00:00:00');
      expect(result.contentexpirydate).toBe('');
    });

    test('handles multiple records per section', () => {
      const commonData = { channel: 'Test' };
      const records = {
        news: [
          { newsTitle: 'News 1' },
          { newsTitle: 'News 2' }
        ],
        audio: [],
        events: [],
        chat: []
      };

      const result = transformFormToPayload(commonData, records);

      expect(result.news).toHaveLength(2);
      expect(result.news[0].newstitle).toBe('News 1');
      expect(result.news[1].newstitle).toBe('News 2');
    });
  });
});

