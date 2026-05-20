const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withAllowNonModularIncludes = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      if (fs.existsSync(podfilePath)) {
        let podfileContent = fs.readFileSync(podfilePath, 'utf8');

        const fix = `
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |cfg|
      cfg.build_settings['ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
    end
  end`;

        if (!podfileContent.includes('ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES')) {
          podfileContent = podfileContent.replace(
            'react_native_post_install(',
            `${fix.trim()}\n  react_native_post_install(`
          );
          fs.writeFileSync(podfilePath, podfileContent, 'utf8');
        }
      }
      return config;
    },
  ]);
};

module.exports = withAllowNonModularIncludes;