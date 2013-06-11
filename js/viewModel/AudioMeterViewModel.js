function AudioMeterViewModel(audioContext, audioInput) {
    var self = this;

    self.audioContext = audioContext;
    self.audioInput = audioInput;
    self.processor = null;

    self.leftLevel = ko.observable(0);
    self.rightLevel = ko.observable(0);

    self.onAudioProcess = function(e) {
        var getMaxDecibel = function(channelData) {
            var maxMagnitude = Math.max.apply(null, channelData);
            return 20 * Math.log(Math.max(maxMagnitude, Math.pow(10, -72 / 20))) / Math.LN10;
        };
        self.leftLevel(getMaxDecibel(e.inputBuffer.getChannelData(0)));
        self.rightLevel(getMaxDecibel(e.inputBuffer.getChannelData(1)));
    };

//    self.render = function() {
//
//    };
//
//
//
//    requestAnimFrame(self.render);

    // move into arm/disarm
    (function init() {
        self.processor = audioContext.createScriptProcessor(1024, 2, 2);
        audioInput.connect(self.processor);
        var muteNode = audioContext.createGain();
        muteNode.gain = 0;
        self.processor.connect(muteNode);
        muteNode.connect(audioContext.destination);
        self.processor.onaudioprocess = self.onAudioProcess;
    })();
}

ko.bindingHandlers.audioMeter = {
//    init: function(element, valueAccessor) {
//
//    },
    update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var top = 0;
        var width = 50;
        var height = value;
        element.style.height = (value * -1) + "px";
        //element.style.clipPath = "polygon(" + top + "px, 0px, " + width + "px, " + height + "px, 0, 0)";
    }
};