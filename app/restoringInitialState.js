const restoringInitialState = function(simpleGit, logger) {
    return function(baseBranch) {
        logger.step("Restoring initial state");

        if (baseBranch) {
            logger.log("Checkout to initial branch " + baseBranch);
            
            simpleGit.checkout(baseBranch);
        }

        simpleGit.stash(['pop'], function(error) {
            if (error) {
                logger.error(error);
            }
        });
    };
};

module.exports = restoringInitialState;