const { withDangerousMod, withXcodeProject } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withAllowNonModularIncludes = (config) => {
  // 1. First, modify the root Xcode Project configuration blocks
  config = withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;
    const buildConfigurations = xcodeProject.pbxXCBuildConfigurationSection();
    for (const key in buildConfigurations) {
      const buildConfig = buildConfigurations[key];
      if (buildConfig.buildSettings) {
        buildConfig.buildSettings['ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES';
      }
    }
    return config;
  });

  // 2. Second, inject a persistent post_install block right into the generated Podfile for EAS
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      if (fs.existsSync(podfilePath)) {
        let podfileContent = fs.readFileSync(podfilePath, 'utf8');

        const postInstallHook = `
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
    end
  end
end
`;

        // Safely append to the end of the dynamically generated Podfile
        if (!podfileContent.includes('ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES')) {
          podfileContent += postInstallHook;
          fs.writeFileSync(podfilePath, podfileContent, 'utf8');
        }
      }
      return config;
    },
  ]);
};

module.exports = withAllowNonModularIncludes;