const express = require('express');
const multer = require('multer');
const next = require('next');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');


const dev = process.env.NODE_ENV !== 'production';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const app = next({dev});
const handle = app.getRequestHandler();

const multerConfig = {

    storage: multer.diskStorage({
        //Setup where the user's file will go
        destination: function (req, file, next) {
            next(null, './static/image/storage');
        },

        //Then give the file a unique name
        filename: function (req, file, next) {
            console.log(file);
            const ext = file.mimetype.split('/')[1];
            next(null, file.fieldname + '-' + Date.now() + '.' + ext);
        }
    }),

    fileFilter: function (req, file, next) {
        if (!file) {
            next();
        }
        const image = file.mimetype.startsWith('image/');
        if (image) {
            console.log('photo uploaded');
            next(null, true);
        } else {
            console.log("file not supported");
            return next();
        }
    }
};

app.prepare().then(() => {

    const server = express();

    server.use(cookieSession({
        name: 'session',
        keys: ['123'],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }));
    server.use(bodyParser.json());

    server.all('/api/:service', (req, res) => {
        if (req.params.service) {
            const moduleName = `./api/${req.params.service.split('.').join('/')}`;
            const module = require(moduleName);
            module.call(null, req, res);
            delete require.cache[require.resolve(moduleName)];
        }
    });

    server.post('/upload', multer(multerConfig).single('photo'), function (req, res) {
        res.send('Complete!');
    });

    server.get('*', (req, res) => {
        return handle(req, res)
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Read on http://localhost:3000')
    })
});