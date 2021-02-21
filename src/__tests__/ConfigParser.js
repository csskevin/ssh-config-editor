const ConfigParser = require("../service/ConfigParser");
const ConfigEditor = require("../service/ConfigEditor");

const TEST_PATH = __dirname + "/fs";
const TEST_FILES = {
    SAMPLE: TEST_PATH + "/sample.config",
};

test("ConfigParser - getting Config Sectors", () => {
    const editor = new ConfigEditor(TEST_FILES.SAMPLE);
    const parser = new ConfigParser();
    parser.loadConfigContent(editor.getConfigContent());
    expect(parser.getSections()).toEqual([
        ['Host github.com', 'User git', 'Port 22'],
        ['HOst example.com', "Hostname example.com", 'User =root', 'Port 22100']
    ]);
})

test("Configparser - parsing a single line", () => {
    const parser = new ConfigParser();
    expect(parser.parseLine("User =root")).toEqual({user: "root"});
    expect(parser.parseLine("Port  =    22112")).toEqual({port: "22112"});
    expect(parser.parseLine("Port=    22112")).toEqual({port: "22112"});
    expect(parser.parseLine("hOsTnAmE example.com")).toEqual({hostname: "example.com"});
    // Checks if double quotes are also parsed correctly for example Item="\"ABC"
    expect(parser.parseLine('Item="\\\"ABC"')).toEqual({item: "\"ABC"});
    expect(parser.parseLine('Item')).toBe(false);
})

test("Configparser - parsing keyword values, especially escaped ones", () => {
    const parser = new ConfigParser();
    expect(parser.parseKeywordValue("root")).toEqual("root");
    expect(parser.parseKeywordValue("test maier")).toBe(false);
    expect(parser.parseKeywordValue('"\\\"ABC"')).toEqual("\"ABC");
    expect(parser.parseKeywordValue("ro\"ot")).toBe(false);
})