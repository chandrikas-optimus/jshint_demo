var Site = {
    /*
     activeProfile defines which environment to run tests against.
     By default, builds on master branch run against production, without preview.
     Builds on any other branch should use preview with local adaptive.js.

     $ACTIVE_PROFILE is automatically set in test.sh and should be sufficient
     for most use cases.

     Change activeProfile whenever you need to override the local behaviour.
    */
    activeProfile: process.env.ACTIVE_PROFILE || 'local',

    /*
     Define new profiles as needed for different URLs, eg. staging, prod.
    */
    profiles: {
        local: {
            bundleUrl: 'https://localhost:8443/adaptive.js',
            siteUrl: 'http://stagewcs.chasing-fireflies.com/'
        },
        production: {
            bundleUrl: '',
            siteUrl: 'http://www.chasing-fireflies.com',
            production: true
        }

    }
};

module.exports = Site;
