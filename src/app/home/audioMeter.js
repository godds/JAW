angular.module("jaws.home.audiometer", [])
// TODO show meter for each channel in buffer
.directive("audioMeter", function(audio) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            input: "=",
            armed: "="
        },
        template: "<div class=\"audio-meter\">" +
                      "<div class=\"overlay\"></div>" +
                  "</div>",
        link: function(scope, element, attrs) {
            var processor,
                armed = false,
                mute = audio.createGain(0);

            function onAudioProcess(e) {
                var getMaxDecibel = function(channelData) {
                    var maxMagnitude = Math.max.apply(null, channelData);
                    return 20 * Math.log(Math.max(maxMagnitude, Math.pow(10, -72 / 20))) / Math.LN10;
                };
                var value = getMaxDecibel(e.inputBuffer.getChannelData(0));
                element.children()[0].style.height = (value * -1) + "px";
            }

            function toggleProcessor() {
                processor.onaudioprocess = armed ? onAudioProcess : null;
            }

            scope.$watch("input", function(value) {
                if (processor) {
                    audio.disconnect(processor);
                    audio.disconnect(mute);
                }
                if (!value) {
                    return;
                }
                processor = audio.createScriptProcessor(1024, 2, 2);
                // have to connect through to speakers for processing to occur
                audio.connect(value, processor, mute, audio.speakers());
                toggleProcessor();
            });

            scope.$watch("armed", function(value) {
                armed = value;
                toggleProcessor();
            });
        }
    };
})

;
