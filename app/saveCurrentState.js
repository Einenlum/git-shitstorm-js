const saveCurrentState = function(simpleGit, logger) {
    return function(filePath, text) {
        logger.step("Saving current state (stashing)");

        return new Promise(function(resolve, reject) {
            simpleGit.stash([], function(error) {
                if (error) {
                    reject(error.message);
                }

                resolve();
            });
        });
    };
};

module.exports = saveCurrentState;