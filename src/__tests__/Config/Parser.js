const ConfigParser = require('../../service/Config/Parser');
const ConfigEditor = require('../../service/Config/FileHandler');

const TEST_PATH = `${__dirname}/fs`;
const TEST_FILES = {
  SAMPLE: `${TEST_PATH}/sample.config`,
};

test('ConfigParser - getting Config Sectors', () => {
  const editor = new ConfigEditor(TEST_FILES.SAMPLE);
  expect(ConfigParser.getSections(editor.getConfigContent())).toEqual([
    [
      {
        type: 'comment',
        value: '# SSH Config',
      },
    ],
    [
      {
        type: 'keyword',
        keyword: 'host',
        value: 'github.com',
      },
      {
        type: 'keyword',
        keyword: 'user',
        value: 'git',
      },
      {
        type: 'keyword',
        keyword: 'port',
        value: '22',
      },
    ],
    [
      {
        type: 'keyword',
        keyword: 'host',
        value: 'example.com',
      },
      {
        type: 'keyword',
        keyword: 'hostname',
        value: 'example.com',
      },
      {
        type: 'comment',
        value: '# Example Comment',
      },
      {
        type: 'keyword',
        keyword: 'user',
        value: 'root',
      },
      {
        type: 'keyword',
        keyword: 'port',
        value: '22100',
      },
    ],
  ]);
});

test('Configparser - parsing a single line', () => {
  expect(ConfigParser.parseLine('User =root')).toEqual({ keyword: 'user', value: 'root' });
  expect(ConfigParser.parseLine('Port  =    22112')).toEqual({ keyword: 'port', value: '22112' });
  expect(ConfigParser.parseLine('Port=    22112')).toEqual({ keyword: 'port', value: '22112' });
  expect(ConfigParser.parseLine('hOsTnAmE example.com')).toEqual({ keyword: 'hostname', value: 'example.com' });
  // Checks if double quotes are also parsed correctly for example Item="\"ABC"
  expect(ConfigParser.parseLine('Item="\\"ABC"')).toEqual({ keyword: 'item', value: '"ABC' });
  expect(ConfigParser.parseLine('Item')).toBe(false);
});

test('Configparser - parsing keyword values, especially escaped ones', () => {
  expect(ConfigParser.parseKeywordValue('root')).toEqual('root');
  expect(ConfigParser.parseKeywordValue('test maier')).toBe(false);
  expect(ConfigParser.parseKeywordValue('"\\"ABC"')).toEqual('"ABC');
  expect(ConfigParser.parseKeywordValue('ro"ot')).toBe(false);
});
