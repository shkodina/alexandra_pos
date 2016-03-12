/**
 * Created by Alex on 12.03.2016.
 */

var backuper = {
    init : function (){
        backuper.fs = require('fs');
        backuper.archiver = require('archiver');

    }

    , createBackup : function(confdata){
        var archive = backuper.archiver('zip');

        archive.on('error', function(err) {
            throw err;
        });

        var output = backuper.fs.createWriteStream(confdata.resultname);

        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });

        archive.pipe(output);

        for (var i in confdata.files){
            archive
                .append(backuper.fs.createReadStream(confdata.files[i].path),
                    { name: confdata.files[i].name })
            ;
        };
        archive .finalize();
    }
}

module.exports = backuper;

