const CommitResponse = require('./responses/CommitResponse');

const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

const getRandomCommit = function(simpleGit, logger) {
    return function() {
        logger.step('Getting a random commit');
        
        return new Promise(function(resolve, reject) {
            simpleGit.log({}, function(error, listLogSummary) {
                if (error) {
                    reject(error.message);
                }

                let commitNames = listLogSummary.all.map(function(commit) {
                    return commit.message;
                });
    
                shuffleArray(commitNames);
                let commitName = commitNames[0];

                logger.log('Chosen commit name: "' + commitName + '"');
    
                resolve(new CommitResponse(commitName));
            });
        });           
    };
};

module.exports = getRandomCommit;