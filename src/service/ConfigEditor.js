const fs = require("fs");

/**
 * The config editor writes and reads the config file over the Node's fs library
 */
class ConfigEditor {
    constructor(config_path) {
        this.config_path = config_path;
        this.createConfigFileIfNotExistent();
    }

    createConfigFileIfNotExistent() {
        if(!fs.existsSync(this.config_path)) {
            fs.writeFileSync(this.config_path, "");
        }
    }

    getConfigContent() {
        return fs.readFileSync(this.config_path, "utf8");
    }

    writeConfigContent(content) {
        fs.writeFileSync(this.config_path, content);
    }
}

module.exports = ConfigEditor;