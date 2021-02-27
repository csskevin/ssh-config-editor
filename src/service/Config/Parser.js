const _ = require('lodash');

/**
 * Parses an OpenSSH client configuration file (See https://linux.die.net/man/5/ssh_config for file specification)
 */
class Parser {
  static getSections(configContent) {
    // Each section is seperated by Host
    const sections = [];
    const lines = configContent.split('\n');
    let currentIndex = false;
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      const parsedLine = this.parseLine(trimmedLine);
      if (parsedLine.keyword === 'host') {
        currentIndex = currentIndex === false ? 0 : currentIndex + 1;
        sections[currentIndex] = [];
        sections[currentIndex].push(parsedLine);
      } else if (trimmedLine.startsWith('#') || trimmedLine.length === 0) {
        // Lines starting with # and empty lines are ignored
      } else {
        sections[currentIndex].push(parsedLine);
      }
    });
    return sections;
  }

  static parseLine(keywordArgument) {
    const matchedElements = keywordArgument.match(/(.*?) *[=| ] *(.*?)$/);
    if (matchedElements && matchedElements.length >= 3) {
      const key = matchedElements[1].toLowerCase().trim();
      const value = matchedElements[2].trim();
      const parsedValue = this.parseKeywordValue(value);
      if (key.length === 0 || !parsedValue || parsedValue.length === 0) return false;
      return {
        keyword: key,
        value: parsedValue,
      };
    }
    return false;
  }

  static parseKeywordValue(keywordValue) {
    if (keywordValue.match(/"(.*)"/)) {
      try {
        const parsedValue = JSON.parse(keywordValue);
        return _.isString(parsedValue) ? parsedValue : false;
      } catch (e) {
        return false;
      }
    } else {
      if (_.includes(keywordValue, ' ') || _.includes(keywordValue, '"')) return false;
      return keywordValue;
    }
  }
}

module.exports = Parser;
