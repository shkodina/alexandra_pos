/**
 * Created by Alex on 12.03.2016.
 */

var backuper = {
    init : function (){
        backuper.fs = require('fs');
        backuper.archiver = require('archiver');
        backuper.archive = backuper.archiver('zip');

    }
    , createBackup : function(confdata){
        var output = backuper.fs.createWriteStream(confdata.resultname);

        output.on('close', function() {
            console.log(backuper.archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });

        backuper.archive.on('error', function(err) {
            throw err;
        });

        backuper.archive.pipe(output);

        backuper.archive
            .append(backuper.fs.createReadStream(confdata.filepath), { name: confdata.filename })
           // .append(backuper.fs.createReadStream(file2), { name: 'checks.db' })
            .finalize();
    }
}

module.exports = backuper;

