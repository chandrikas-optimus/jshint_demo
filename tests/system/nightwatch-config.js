var reportsPath = process.env.CIRCLE_TEST_REPORTS || './tests/reports';
var screenshotsPath = process.env.CIRCLE_ARTIFACTS || './tests/screenshots';

module.exports = {
    'src_folders': ['./tests/system'],
    'output_folder': reportsPath,
    'custom_commands_path': './node_modules/nightwatch-commands/commands',
    'custom_assertions_path': './node_modules/nightwatch-commands/assertions',

    'selenium': {
        'start_process': true,
        'server_path': './node_modules/nightwatch-commands/selenium/selenium-server.jar',
        'log_path': './node_modules/nightwatch-commands/selenium/',
        'host': '127.0.0.1',
        'port': 4445,
        'cli_args': {
            'webdriver.chrome.driver': './node_modules/nightwatch-commands/selenium/drivers/chromedriver'
        }
    },

    'test_settings': {
        'default': {
            'globals' : {
                'waitForConditionTimeout' : 60000,
                'waitForConditionPollInterval': 500
            },
            'end_session_on_fail': false,
            'launch_url': 'http://localhost',
            'selenium_host': '127.0.0.1',
            'selenium_port': 4445,
            'silent': true,
            'output': true,
            'screenshots': {
                'enabled': true,
                'path': screenshotsPath,
                'on_failure': true
            },
            'desiredCapabilities': {
                'browserName': 'chrome',
                'chromeOptions': {
                    'mobileEmulation': { 'deviceName' : 'Apple iPhone 6'},
                    'args': [
                        '--allow-running-insecure-content',
                        '--test-type'
                    ]
                },
                'javascriptEnabled': true,
                'acceptSslCerts': true
            },
            'exclude': ['pageObjects']
        }
    }
};
