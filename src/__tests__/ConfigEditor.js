'use strict';

const fs = require("fs");
const ConfigEditor = require("../service/ConfigEditor");

const TEST_PATH = __dirname + "/fs";
const TEST_FILES = {
    READABLE: TEST_PATH + "/readable.config",
    GENERATED: TEST_PATH + "/generated.config",
    WRITEABLE: TEST_PATH + "/writeable.config"
};

test("ConfigEditor - Read Config", () => {
    const instance = new ConfigEditor(TEST_FILES.READABLE);
    expect(instance.getConfigContent()).toBe("Hello World");
});

test("ConfigEditor - Create Config", () => {
    new ConfigEditor(TEST_FILES.GENERATED);
    expect(fs.existsSync(TEST_FILES.GENERATED)).toBe(true);
    fs.rmSync(TEST_FILES.GENERATED);
});

test("ConfigEditor - Write Config", () => {
    const message = "Hello World " + Math.floor(Math.random() * 10);
    const write_instance = new ConfigEditor(TEST_FILES.WRITEABLE);
    write_instance.writeConfigContent(message);
    expect(write_instance.getConfigContent()).toBe(message);
});