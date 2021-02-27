const fs = require('fs');
const ConfigEditor = require('../../service/Config/FileHandler');

const TEST_PATH = `${__dirname}/fs`;
const TEST_FILES = {
  READABLE: `${TEST_PATH}/readable.config`,
  GENERATED: `${TEST_PATH}/generated.config`,
  WRITEABLE: `${TEST_PATH}/writeable.config`,
};

test('ConfigEditor - Read Config', () => {
  const instance = new ConfigEditor(TEST_FILES.READABLE);
  expect(instance.getConfigContent()).toBe('Hello World');
});

test('ConfigEditor - Create Config', () => {
  const instance = new ConfigEditor(TEST_FILES.GENERATED);
  instance.getConfigContent();
  expect(fs.existsSync(TEST_FILES.GENERATED)).toBe(true);
  fs.rmSync(TEST_FILES.GENERATED);
});

test('ConfigEditor - Write Config', () => {
  const message = `Hello World ${Math.floor(Math.random() * 10)}`;
  const writeInstance = new ConfigEditor(TEST_FILES.WRITEABLE);
  writeInstance.writeConfigContent(message);
  expect(writeInstance.getConfigContent()).toBe(message);
});
