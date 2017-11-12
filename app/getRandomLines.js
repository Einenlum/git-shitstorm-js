const fs = require('fs');
const RandomLinesResponse = require('./responses/RandomLinesResponse');

const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

const getRandomLines = function(simpleGit, logger) {
    return function(filePath) {
        logger.step("Getting random lines of file " + filePath);

        return new Promise(function(resolve, reject) {
            fs.readFile(filePath, 'utf8', function(error, data) {  
                if (error) {
                    reject(error.message);
                    return;
                }
                if (!data) {
                    reject("Data is empty in this file");
                    return;
                }

                let dataArray = data.toString().split("\n");

                let getRandomInt = function(min, max) {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min)) + min;
                };
    
                var firstLine = getRandomInt(0, dataArray.length);
                var lastLine = getRandomInt(0, dataArray.length);
    
                if (firstLine > lastLine) {
                    var [firstLine, lastLine] = [lastLine, firstLine];
                }

                let selectedLines = dataArray.splice(firstLine, dataArray.length - lastLine);
                selectedLines = selectedLines.join("\n");

                logger.log("Selected lines to copy: \n");
                logger.log(selectedLines);
                logger.log("\n");

                resolve(new RandomLinesResponse(selectedLines));
            });
        });    
    };
};

module.exports = getRandomLines;