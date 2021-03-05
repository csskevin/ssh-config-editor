const _ = require('lodash');

class Modifier {
  static transpileConfigToFile(configuration) {
    const configContent = _.flatten(configuration).filter((entry) => !!entry).map((entry) => {
      if (entry.type === 'comment') {
        return entry.value;
      }
      if (entry.type === 'keyword') {
        return this.buildLineFromKeyword(entry);
      }
      return false;
    }).join('\n');
    return configContent;
  }

  static buildLineFromKeyword(entry, userSpaceIdent) {
    let spaceIdent = 2;
    if (userSpaceIdent) {
      spaceIdent = userSpaceIdent;
    }
    const preparedValue = entry.value.replace(/"/, '\\"');
    const surroundedValue = `"${preparedValue}"`;
    const line = `${entry.keyword} ${surroundedValue}`;
    if (entry.keyword === 'host') {
      return `\n${line}`;
    }
    return (spaceIdent) ? `${' '.repeat(spaceIdent)}${line}` : line;
  }
}

module.exports = Modifier;
