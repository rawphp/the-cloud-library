import * as fs from 'fs-extra';
import * as Path from 'path';
import { DropboxIntegration } from '../../../src/integrations/dropbox/DropboxIntegration';
import * as bodybuildingListResponseJson from '../../fixtures/bodybuilding-list-response.json';
import * as listRootResponseJson from '../../fixtures/list-root-response.json';

describe('dropbox integration', () => {
  let integration;

  beforeEach(() => {
    integration = new DropboxIntegration({});
  });

  afterEach(async () => {
    await fs.remove(Path.resolve(process.cwd(), 'upper_lower4day.pdf'));
  });

  it('is an object', () => {
    expect(typeof integration).toEqual('object');
  });

  it('has the correct id', () => {
    expect(integration.id).toEqual('dropbox');
  });

  it('has the correct name', () => {
    expect(integration.name).toEqual('Dropbox');
  });

  it('has connected property', () => {
    expect(integration.connected).toEqual(false);
  });

  describe('handler has methods', () => {
    describe('connect', () => {
      it('has connect method', () => {
        expect(typeof integration.connect).toEqual('function');
      });

      describe('disconnect', () => {
        it('has disconnect method', () => {
          expect(typeof integration.disconnect).toEqual('function');
        });

        it('disconnects from dropbox successfully', async () => {
          await integration.connect();
          await integration.disconnect();

          expect(integration.connected).toEqual(false);
          expect(integration.dropbox).toBe(undefined);
        });
      });

      it('connects to AWS dropbox successfully', async () => {
        await integration.connect();

        expect(integration.connected).toEqual(true);
      });

      it('has dropbox', async () => {
        await integration.connect();

        expect(integration.dropbox).toBeTruthy();
      });
    });

    describe('list', () => {
      it('has list method', () => {
        expect(typeof integration.list).toEqual('function');
      });

      it('lists files in root directory successfully', async () => {
        const path = '';
        const expected = ['Acupressure/',
          'Trips/',
          'Keys & Licenses/',
          'DEV-SETTINGS/',
          'Apps/',
          'DA-MP/',
          'Contracts/',
          'Bodybuilding/',
          'Receipts/',
          'Buddhism/',
          'Documents/',
          'Applications/',
          'Visa/',
          'Audiobooks/',
          'Fld Acad Career.pdf',
          'Citrus Alarm Clock Playlist.m3u',
          'Sedona Method Workbook.pdf',
          'Shackles G. - Mobile Development with C# - 2012.pdf',
          'The Sedona Method.pdf',
          'Ranking.cs',
          'RMIT Defer Receipt.pdf',
          'VRPIN_00122_VicRider_Handbook_0213_Part1_WEB.pdf',
          'VRPIN_00122_VicRider_Handbook_0213_Part2_WEB.pdf',
          'ColorPix.exe',
          'Codeship_Efficiency_in_Development_Workflows.pdf',
          'The Lean Startup - How Today\'s Entrepreneurs Use Continuous Innovation To Create Radically Successful Businesses.mobi',
          'The Lean Startup  - Eric Ries [Qwerty80].pdf',
          'Twig.pdf',
          'ZendFramework-2.3.3-manual-en.pdf',
          'Xamarin.pdf',
          'Practical Programming for Strength Training.pdf',
          'Starting Strength 3rd Edition.pdf',
          'FitNotes_Backup.fitnotes',
          'BodyFat Chart-.jpg',
          'practicalprogramming.pdf',
          'Macro Spreadsheet.xlsx',
          'PROP RUN.html',
          'Alarms.xml',
          'Slow Cooker.pdf',
          'The Illustrated Easyway to Stop Smoking A Smoker\'s Guide to Just How Easy It Is to Quit-Mantesh.pdf',
          'WebbotsSpidersScreenScraper_Libraries_REV2_0.zip',
          '20160115_123140.jpg',
          '20160123_115749.jpg',
          '20160123_115823.jpg',
          '20160123_115933.jpg',
          '20160123_120032.jpg',
          'TesterAccountSettings',
          'Screenshot_2016-02-02-11-32-01.png',
          'Citrus Alarm Clock Playlist(BOOK).m3u',
          'DualBoot.txt',
          '1462935850951.jpg',
          'PaymentSummary.pdf',
          'Car Rego.jpeg',
          'car-rego-payment-receipt.pdf',
          'health survey results.pdf',
          'Binary Predictions 80%',
          'Regression Predictions 2017-08-05',
          'Meetings',
          'Regression Predictions 2017-09-16 v2',
          'Regression Predictions 2017-09-16',
          'SEW - indiehackers_edited.mp3',
        ];

        await integration.connect();

        integration.dropbox.filesListFolder = jest.fn().mockResolvedValueOnce(listRootResponseJson);

        const files = await integration.list(path);

        expect(Array.isArray(files)).toBeTruthy();
        expect(files).toEqual(expected);
      });

      it('lists files in root directory successfully', async () => {
        const path = '/Bodybuilding/';
        const expected = [
          '/Bodybuilding/OTS/',
          '/Bodybuilding/MFL/',
          '/Bodybuilding/Bigger Leaner Stronger/',
          '/Bodybuilding/IF/',
          '/Bodybuilding/Kinobody/',
          '/Bodybuilding/Anabolics/',
          '/Bodybuilding/Arnold Schwarzenegger/',
          '/Bodybuilding/ID/',
          '/Bodybuilding/Thinking Big 1.pdf',
          '/Bodybuilding/Thinking Big 2.pdf',
          '/Bodybuilding/Jim Wendler [5-3-1] Training System for Raw Strength (2nd Edition).pdf',
          '/Bodybuilding/beach-ripped-your-guide-to-cutting.pdf',
          '/Bodybuilding/The Kinobody Blueprint.pdf',
          '/Bodybuilding/Warrior Shredding Program Link.txt',
          '/Bodybuilding/Legend and Myth.pdf',
          '/Bodybuilding/Unleashing the Wild Physique - Vince Gironda.pdf',
          '/Bodybuilding/Bulgarian Manual.pdf',
          '/Bodybuilding/Morning Ritual And Bonus Stacks.pdf',
          '/Bodybuilding/FitNotes_Backup_2016_01_26_08_44_36.fitnotes',
          '/Bodybuilding/upper_lower4day.pdf',
          '/Bodybuilding/20181202_132751.jpg',
          '/Bodybuilding/20181202_132729.jpg',
        ];

        await integration.connect();

        integration.dropbox.filesListFolder = jest.fn().mockResolvedValueOnce(bodybuildingListResponseJson);

        const files = await integration.list(path);

        expect(files).toEqual(expected);
      });

      it('throws error if path does not exist', async () => {
        const path = '/Bodybuilding/20181202_132755555.jpg';
        const expectedError = {
          error: {
            error_summary: 'path/not_found/.',
            error: {
              '.tag': 'path',
              'path': {
                '.tag': 'not_found',
              },
            },
          },
          response: {
            size: 0,
            timeout: 0,
          },
          status: 409,
        };

        await integration.connect();

        integration.dropbox.filesListFolder = jest.fn().mockRejectedValueOnce(expectedError);

        let result;

        try {
          result = await integration.list(path);
        } catch (error) {
          result = error;
        }

        expect(result).toEqual(expectedError);
      });
    });

    describe('get', () => {
      it('has get method', () => {
        expect(typeof integration.get).toEqual('function');
      });

      it('successfully downloads a file from Dropbox', async () => {
        const path = '/Bodybuilding/upper_lower4day.pdf';
        const downloadPath = Path.join(process.cwd(), 'upper_lower4day.pdf');

        await integration.connect();

        integration.dropbox.filesDownload = jest.fn().mockResolvedValueOnce({ fileBinary: 'file data' });

        const data = await integration.get(path, { downloadPath });

        expect(fs.existsSync(downloadPath)).toEqual(true);
        expect(data).toBeTruthy();
      });
    });

    describe('put', () => {
      it('has put method', () => {
        expect(typeof integration.put).toEqual('function');
      });

      // it('uploads a small file successfully', async () => {
      //   const file = Path.join(__dirname, 'fixtures', 'upper_lower4day.pdf');
      //   const toPath = '/test125.pdf';

      //   await integration.connect();

      //   const result = await integration.put(toPath, { data: fs.readFileSync(file) });

      // });
    });

    describe('remove', () => {
      it('has remove method', () => {
        expect(typeof integration.remove).toEqual('function');
      });
    });
  });
});
