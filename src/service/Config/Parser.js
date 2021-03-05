const _ = require('lodash');

/**
 * Parses an OpenSSH client configuration file (See https://linux.die.net/man/5/ssh_config for file specification)
 */
class Parser {
  static getSections(configContent) {
    const sections = [];
    const lines = configContent.split('\n');
    let currentIndex = false;
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex];
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('#')) {
        if (currentIndex === false) {
          currentIndex = 0;
          sections[currentIndex] = [];
        }
        sections[currentIndex].push({
          type: 'comment',
          value: trimmedLine,
        });
      }
      const parsedLine = this.parseLine(trimmedLine);
      if (parsedLine) {
        parsedLine.type = 'keyword';
        if (parsedLine.keyword === 'host') {
          currentIndex = currentIndex === false ? 0 : currentIndex + 1;
          sections[currentIndex] = [];
          sections[currentIndex].push(parsedLine);
        } else {
          sections[currentIndex].push(parsedLine);
        }
      }
    }
    return sections;
  }

  static parseLine(keywordArgument) {
    /**
     * TODO: Prevent that element ends with =
     */
    const matchedElements = keywordArgument.trim().match(/(.*?) *[=| ] *(.*?)$/);
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
