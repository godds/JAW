(function() {
    // fix up for prefixing
    navigator.getUserMedia = ( navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia ||
                               navigator.msGetUserMedia );
    window.AudioContext = ( window.AudioContext ||
                            window.webkitAudioContext ||
                            window.mozAudioContext ||
                            window.msAudioContext );

    var viewModel = new ApplicationViewModel(new AudioContext());
    ko.applyBindings(viewModel);

    window.addEventListener("load", function() { viewModel.init(); });
})();

