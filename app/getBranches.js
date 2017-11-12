const BranchesResponse = require('./responses/BranchesResponse');

const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

const getBranches = function(simpleGit, logger) {
    return function() {
        logger.step('Getting branches');
        return new Promise(function(resolve, reject) {
            return simpleGit.branchLocal(
                function(error, branchSummary) {
                    if (error) {
                        reject(error.message);
                    }
    
                    let baseBranch = branchSummary.current;
                    let branches = [];
    
                    for (branch in branchSummary.branches) {
                        branches.push(branch);
                    }
    
                    shuffleArray(branches);
                    let targetBranch = branches[0];

                    logger.log("Initial branch: " + baseBranch);
                    logger.log("Target branch: " + targetBranch);                    
    
                    resolve(new BranchesResponse(baseBranch, targetBranch));
                }
            );
        });
    }
};

module.exports = getBranches;