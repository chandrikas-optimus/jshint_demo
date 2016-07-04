define(['$'], function ($) {
    var $table = [
        {
            label: 'Color',
            value: 'Lavendar',
        }, {
            label: 'Size',
            value: '4-6',
        }, {
            label: 'Qty',
            value: '2',
        }
    ];

    var $image = {
        src: 'http://chasingfireflies.resultspage.com/thumb.php?base=http://chasingfireflies.scene7.com/is/image/ChasingFireflies/T_WithoutZoom?$&sizeType=SLI_GridView&mfpart=53143&sale=&defAtt=main',
        alt: 'Photo of the Jumbo Bunny'
    };

    return [
        {
            image: $image,
            heading: 'Girls Personalized Patent Leather Sandals',
            table: $table
        },
        {
            image: $image,
            heading: 'Personalized Jr. Lab Coat Kids Costume',
            table: $table
        }
    ];
});
