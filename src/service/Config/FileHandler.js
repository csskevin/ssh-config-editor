const fs = require('fs');

/**
 * The config editor writes and reads the config file over the Node's fs library
 */
class FileHandler {
  constructor(configPath) {
    this.configPath = configPath;
    this.createConfigFileIfNotExistent();
  }

  createConfigFileIfNotExistent() {
    if (!fs.existsSync(this.configPath)) {
      fs.writeFileSync(this.configPath, '');
    }
  }

  getConfigContent() {
    return fs.readFileSync(this.configPath, 'utf8');
  }

  writeConfigContent(content) {
    fs.writeFileSync(this.configPath, content);
  }
}

module.exports = FileHandler;
