define(['$'], function ($) {
    var $paragraph1 = $('<p>Notice how the "Reveal Content" button disappeared and showed this content.</p>');
    var $paragraph2 = $('<p>While once again the button to reveal this content is hidden, notice now that below there is a "Hide Content" button now.</p>');

    return [
        {
            showLabel: false,
            hideLabel: false,
            content: $paragraph1
        },
        {
            showLabel: '+ Custom Show Label!',
            hideLabel: '- Hide Content!',
            content: $paragraph2
        }
    ];
});
