const fs = require('fs');


module.exports = (req, res) => {
    fs.readdir('./static/image/storage', (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        const result = [];
        files.forEach(file => {
            result.push(file);
        });
        res.send(result);
    });
};