angular.module("audio", [])

.factory("audio", function audioUtils () {
    var audioContext = new AudioContext();

    var applySettings = function (node, settings) {
        for (var setting in settings) {
            node[setting].value = settings[setting];
        }
        return node;
    };

    return {
        speakers: function () {
            return audioContext.destination;
        },
        currentTime: function () {
            return audioContext.currentTime;
        },
        createOscillator: function (type, frequency) {
            var node = audioContext.createOscillator();
            node.type = type || "sine";
            node.frequency.value = frequency || 440;
            return node;
        },
        createGain: function (gain) {
            var node = audioContext.createGain();
            node.gain.value = gain || node.gain.value;
            return node;
        },
        createAnalyser: function () {
            return audioContext.createAnalyser();
        },
        createFilter: function (type) {
            var node = audioContext.createBiquadFilter();
            node.type = type || node.type;
            return node;
        },
        createCompressor: function (settings) {
            var node = audioContext.createDynamicsCompressor();
            settings = angular.extend({ threshold: -24, knee: 30, ratio: 12, attack: 0.0030, release: 0.25 },
                                      settings);
            applySettings(node, settings);
            return node;
        },
        createNoise: function () {
            var node = audioContext.createScriptProcessor(1024, 0, 1);
            node.onaudioprocess = function (node) {
                var buffer = node.outputBuffer.getChannelData(0);
                for (var i = 0; i < 1024; i++) {
                    buffer[i] = 2 * Math.random() - 1;
                }
            };
            return node;
        },
        createWaveShaper: function () {
            var curve = new Float32Array(65536);
            for (var i = 0; i < 32768; i++) {
                curve[i] = i < 3E4 ? 0.1 : -1;
            }
            var node = audioContext.createWaveShaper();
            node.curve = curve;
            return node;
        },
        createLFO: function (settings) {
            var osc = createOscillator(),
                gain = createGain();
            settings = angular.extend({ frequency: 0, type: "triangle", depth: 1, target: null, autoStart: !1 },
                                      settings);
            osc.type = osc[settings.type];
            gain.gain.value = settings.depth;
            if (settings.autoStart) {
                osc.start(currentTime());
            }
            osc.modulate = function (node) {
                osc.connect(gain);
                gain.connect(node);
            };
            osc.setWaveType = function (type) {
                osc.type = osc[type.toUpperCase()];
            };
            osc.setDepth = function (depth) {
                gain.gain.value = depth;
            };
            osc.modulate(settings.target);
            return osc;
        },
        //createEnvelope: function (settings) {
        //    return null;
        //},
        connect: function () {
            for (var i = 0; i < arguments.length - 1; i++) {
                if (Array.isArray(arguments[i])) {
                    for (var j = 0; j < arguments[i].length; j++) {
                        this.connect(arguments[i][j], arguments[i + 1]);
                    }
                }
                else {
                    if (arguments[i].hasOwnProperty("output")) {
                        if (arguments[i + 1].hasOwnProperty("input")) {
                            arguments[i].output.connect(arguments[i + 1].input);
                        }
                        else {
                            arguments[i].output.connect(arguments[i + 1]);
                        }
                    }
                    else {
                        if (arguments[i + 1].hasOwnProperty("input")) {
                            arguments[i].connect(arguments[i + 1].input);
                        }
                        else {
                            arguments[i].connect(arguments[i + 1]);
                        }
                    }
                }
            }
        },
        disconnect: function (node) {
            node.disconnect();
        },

        //createbuffer
        //reverse
        getAudioStream: function () {
            // TODO return promise? (or equivalent)

            /*navigator.getUserMedia({ audio: true },
                function (stream) {
                    return audioContext.createMediaStreamSource(stream);
                },
                function (error) {
                    console.log(error);
                });*/
            return null;
        }
    };
})

;
