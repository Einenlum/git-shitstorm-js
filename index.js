const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'ultraverbose', alias: 'V', type: Boolean, defaultValue: false },
    { name: 'verbose', alias: 'v', type: Boolean, defaultValue: false },    
    { name: 'dir', alias: 'd', type: String, defaultValue: process.cwd() },
    { name: 'chance', alias: 'c', type: Number, defaultValue: 10 },
    { name: 'executable', alias: 'e', type: String, defaultValue: 'git' }
];

var options = commandLineArgs(optionDefinitions);

const sanitizeOptions = function(options) {
    if (options.chance < 1) {
        options.chance = 1;
    } else if (options.chance > 100) {
        options.chance = 100;
    }

    return options;
}

options = sanitizeOptions(options);

const shouldIShitStorm = function(chance) {
    return chance >= Math.random() * 100;
};

const Logger = require('./app/Logger');

var verboseMode = Logger.VERBOSE_MODES.NONE;
if (options.ultraverbose) {
    verboseMode = Logger.VERBOSE_MODES.NOTICE;
} else if (options.verbose) {
    verboseMode = Logger.VERBOSE_MODES.ERROR;
}
const logger = new Logger(verboseMode);

try {
    if (!shouldIShitStorm(options.chance)) {
        logger.log("Sorry. Not this time.");

        return;
    }
    
    logger.log("Let's have some fun. Shall we?")

    const folder = options.dir;
    const simpleGit = require('simple-git')(folder);
    const getBranches = require('./app/getBranches')(simpleGit, logger);
    const findFiles = require('./app/findFiles')(simpleGit, folder, logger);
    const getRandomCommit = require('./app/getRandomCommit')(simpleGit, logger);
    const getRandomLines = require('./app/getRandomLines')(simpleGit, logger);
    const setTextRandomly = require('./app/setTextRandomly')(simpleGit, logger);
    const saveCurrentState = require('./app/saveCurrentState')(simpleGit, logger);
    const restoringInitialState = require('./app/restoringInitialState')(simpleGit, logger);

    simpleGit.silent(true);
    simpleGit._command = options.executable;

    var state = {
        baseBranch: null,
        targetBranch: null,
        commitName: null,
        baseFile: null,
        targetFile: null,
        selectedCode: null
    };

    saveCurrentState()
        .then(function() {
            return getRandomCommit();
        })
        .then(function(commitResponse) {
            state.commitName = commitResponse.name;

            return getBranches();
        })
        .then(function(branchesResponse) {
            state.baseBranch = branchesResponse.baseBranch;
            state.targetBranch = branchesResponse.targetBranch;

            simpleGit.checkout(state.targetBranch);

            return findFiles();
        }).then(function(filesResponse) {
            state.baseFile = filesResponse.baseFile;
            state.targetFile = filesResponse.targetFile;

            return getRandomLines(state.baseFile);
        }).then(function(randomLinesResponse) {
            state.selectedCode = randomLinesResponse.text;

            return setTextRandomly(state.targetFile, state.selectedCode);
        }).then(function() {
            logger.step("Commiting the changes");
            simpleGit.add(state.targetFile);
            simpleGit.commit(state.commitName, function() {});
            simpleGit.checkout(state.baseBranch);

            return restoringInitialState(state.baseBranch);       
        }).catch(function(error) {
            logger.error(error);

            if (state && state.baseBranch) {
                return restoringInitialState(state.baseBranch);
            }
            
            restoringInitialState();
        })
    ;
} catch (error) {
    logger.error(error.message);
}
