define(['$', 'translator'],
function($, translator) {
    var _capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    var getStepInfo = function(stepKey, index, isHalfStep) {
        var title = _capitalize(stepKey);
        var stepClass = 'c--' + stepKey;
        return {
            stepClass: isHalfStep ? stepClass + ' c--half-completed' : stepClass,
            stepCurrent: index,
            stepTitle: title
        };
    };

    var getReviewStep = function(index) {
        return {
            stepClass: 'c--review',
            stepCurrent: index,
            stepTitle: 'Review'
        };
    };

    return {
        context: {
            logoLink: function() {
                return $('#logo1 a').attr('href');
            },
            phoneNumber: function() {
                return $('#phoneNumber img').attr('alt');
            },
            progressBarTitle: function() {
                return 'You are on step...';
            },
            progressBar: function() {
                // The content here will be the same across all checkout steps
                // Modify this key within a template to match the correct progress for that template
                return {
                    stepCount: '3',
                    steps:[
                        getStepInfo('shipping', '1'),
                        getReviewStep('2'),
                        getStepInfo('confirmation', '3')
                    ]
                };
            },
            progressBarWithGift: function() {
                return {
                    stepCount: '3',
                    steps:[
                        getStepInfo('gift', '1', true),
                        getReviewStep('2'),
                        getStepInfo('confirmation', '3')
                    ]
                };
            }
        }
    };
});
