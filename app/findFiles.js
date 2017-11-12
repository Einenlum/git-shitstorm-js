const glob = require('glob-fs')({gitignore: true});
const fileExtension = require('file-extension');
const FilesResponse = require('./responses/FilesResponse');

const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

const findFiles = function(simpleGit, folder, logger) {
    return function() {
        logger.step('Finding files');
        
        return new Promise(function(resolve, error) {
            var files = glob.readdirSync('**/*', {cwd: folder});

            shuffleArray(files);
            
            let baseFile = files[0];
            let extension = fileExtension(baseFile);

            var regexPattern = '.*\\.' + extension ;
            let filesToShuffle = files.filter(function(file) {
                return file.match(new RegExp(regexPattern, 'g'));
            });
            if (filesToShuffle.length <= 1) {
                filesToShuffle = files;
            }

            shuffleArray(filesToShuffle);
            let targetFile = filesToShuffle[0];

            resolve(new FilesResponse(baseFile, targetFile));
        });      
    };
};

module.exports = findFiles;