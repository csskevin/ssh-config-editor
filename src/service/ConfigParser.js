const _ = require("lodash");

/**
 * Parses an OpenSSH client configuration file (See https://linux.die.net/man/5/ssh_config for file specification)
 */
class ConfigParser {
    constructor() {
        this.config_content = null;
    }

    loadConfigContent(config_content) {
        this.config_content = config_content;
    }

    getSections() {
        // Each section is seperated by Host
        const sections = [];
        const lines = this.config_content.split('\n');
        let current_index = false;
        lines.forEach(line => {
            let trimmed_line = line.trim();
            if (trimmed_line.split(' ')[0].toLowerCase() === 'host') {
                current_index = current_index === false ? 0 : current_index + 1;
                sections[current_index] = [];
                sections[current_index].push(trimmed_line);
            } else if(trimmed_line.startsWith('#') || trimmed_line.length === 0) {
                // Lines starting with # and empty lines are ignored
            } else {
                sections[current_index].push(trimmed_line);
            }
        });
        return sections;
    }

    parseLine(keyword_argument) {
        const matched_elements = keyword_argument.match(/(.*?)\ *[\=|\ ]\ *(.*?)$/);
        if(matched_elements && matched_elements.length >= 3) {
            const key = matched_elements[1].toLowerCase().trim();
            const value = matched_elements[2].trim();
            const parsed_value = this.parseKeywordValue(value);
            if(key.length === 0 || !parsed_value || parsed_value.length === 0)
                return false;
            return {[key]: parsed_value};
        } else {
            return false;
        }
    }

    parseKeywordValue(keyword_value) {
        if(keyword_value.match(/\"(.*)\"/)) {
            try {
                const parsed_value = JSON.parse(keyword_value);
                return _.isString(parsed_value) ? parsed_value : false;
            } catch(e) {
                return false;
            }    
        } else {
            if(_.includes(keyword_value, " ") || _.includes(keyword_value, "\""))
                return false;
            return keyword_value;
        }
    }
}

module.exports = ConfigParser;