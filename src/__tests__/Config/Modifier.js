/* eslint-disable no-console */
const ConfigModifier = require('../../service/Config/Modifier');
const ConfigEditor = require('../../service/Config/FileHandler');
const ConfigParser = require('../../service/Config/Parser');

const TEST_PATH = `${__dirname}/fs`;
const TEST_FILES = {
  SAMPLE: `${TEST_PATH}/sample.config`,
};

test('ConfigModifier - Generate Config', () => {
  const editor = new ConfigEditor(TEST_FILES.SAMPLE);
  const config = ConfigParser.getSections(editor.getConfigContent());
  console.log(ConfigModifier.transpileConfigToFile(config));
});
