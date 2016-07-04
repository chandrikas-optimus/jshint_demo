define(['$'], function ($) {
    var $multiLine = $('<div>Icon: Pink Butterfly</div><div>Name: Vivian</div><div>Font Color: White</div>');

    return [
        {
            class: 'u-padding u--none c--borderless',
            href: '#',
            label: 'Personalize Your Item'
        },
        {
            href: '#',
            label: 'Personalize Your Item'
        },
        {
            href: '#',
            label: $multiLine
        }
    ];
});
