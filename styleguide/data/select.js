define(['$'], function ($) {

    var $select = $('<select><option>Option 1</option><option>Option 2</option><option>Option 3</option></select>');

    return [
        {
            'select': $select.clone().attr('id','select-1')
        },
        {
            'select': $select.clone().attr('id','select-2').attr('disabled', 'true'),
            'isDisabled': true
        },
        {
            'select': $select.clone().attr('id','select-3').attr('disabled', 'true')
        },
    ];
});
