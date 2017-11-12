const fs = require('fs');
const RandomLinesResponse = require('./responses/RandomLinesResponse');

const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

const setTextRandomly = function(simpleGit, logger) {
    return function(filePath, text) {
        logger.step("Pasting selected text to " + filePath);
        
        return new Promise(function(resolve, reject) {
            let data = fs.readFileSync(filePath).toString().split("\n");
    
            let getRandomInt = function(min, max) {
                  min = Math.ceil(min);
                  max = Math.floor(max);
                  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
            };
    
            let randomLine = getRandomInt(0, data.length);
            data.splice(randomLine, 0, ...text.split("\n"));
            var textToWrite = data.join("\n");
    
            fs.writeFile(filePath, textToWrite, function (error) {
              if (error) {
                  reject(error.message);
              }
            
              resolve();
            });
        });
    };
};

module.exports = setTextRandomly;