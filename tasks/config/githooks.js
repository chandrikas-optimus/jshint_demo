module.exports = function(grunt) {
    return {
        all: {
            options: {
                hashbang: '#!/bin/sh',
                template: './githooks/pre-push.sh',
                startMarker: '## GRUNT-GITHOOKS START',
                endMarker: '## GRUNT-GITHOOKS END'
            },
            'pre-push': './githooks/pre-push.sh'
        }
    };
};
