const fs = require('fs');

/**
 * Returns true if value is a path and should be checked
 */
const isPath = (value) => value.indexOf(process.cwd()) === 0;

/**
 * Validates projects and returns an array of errors encountered
 */
const validatePlatform = (platform, config) => {
  return Object.keys(config).reduce((errors, key) => {
    const value = config[key];

    if (isPath(value) && !fs.existsSync(value)) {
      errors.push({
        code: 'ENOENT',
        msg: `No ${key} found at ${value} for ${platform}. You can override it in your package.json`,
      });
    }

    return errors;
  }, []);
};

module.exports = function validateProjects(projects) {
  return Object.keys(projects).reduce((errors, platform) => {
    const platformErrors = validatePlatform(platform, projects[platform]);
    return errors.concat(platformErrors);
  }, []);
};
