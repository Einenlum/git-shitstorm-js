const VERBOSE_MODES = {
    NONE: 'NONE',
    ERROR: 'ERROR',
    NOTICE: 'NOTICE'
};

class Logger {
    constructor (verboseMode) {
        this.verboseMode = verboseMode;
    }

    step (message) {
        this.log('*** ' + message + ' ***');
    }

    log (message) {
        if (this.verboseMode === VERBOSE_MODES.NOTICE) {
            console.log(message);
        }
    }

    error (message) {        
        if (this.verboseMode === VERBOSE_MODES.NOTICE
            || this.verboseMode === VERBOSE_MODES.ERROR
        ) {
            console.error(message);
        }
    }
}

module.exports = Logger;
module.exports.VERBOSE_MODES = VERBOSE_MODES;