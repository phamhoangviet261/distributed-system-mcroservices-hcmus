const express = require('express');
const router = express.Router();
const axios = require('axios');
const registry = require('./registry.json');
const fs = require('fs');

router.post('/register', async (req, res, next) => {
    try {
        const resgistration = req.body;

        resgistration.url = resgistration.protocol + '://' + resgistration.host + ':' + resgistration.port + '/';
        registry.services[resgistration.apiName] = {...resgistration};

        fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
            if (error) {
                throw `Could not register ${resgistration.apiName} \n${error.message}`;
            } else {
                res.send('Successfully registered ' + resgistration.apiName);
            }
        });
    } catch (error) {
        console.log('error: ', error.message);
        return res.status(400).json({success: false, message: error.message});
    }
});

router.post('/unregister', async (req, res, next) => {
    try {
        const {apiName} = req.body;
        if (!registry.services[apiName]) {
            throw `Service name [${apiName}] does not exist`;
        }

        delete registry.services[apiName];

        fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
            if (error) {
                res.send('Could not register ' + apiName + '\n' + error);
            } else {
                res.send('Successfully registered ' + apiName);
            }
        });
    } catch (error) {
        console.log('error: ', error.message);
        return res.status(400).json({success: false, message: error.message});
    }
});

router.use('/:apiName', async (req, res, next) => {
    try {
        const {apiName} = req.params;
        const {path} = req;
        if (!registry.services[apiName]) {
            throw `Service name [${apiName}] does not exist`;
        }
        console.log(`Service [${apiName}] has been called`);
        const options = {
            method: req.method,
            url: registry.services[apiName].url + path,
            data: req.body,
            headers: {'content-type': req.headers['content-type']}
        };

        const axiosRespond = await axios(options);
        res.send(axiosRespond.data);
    } catch (error) {
        console.log('error: ', error.message);
        return res.status(400).json({success: false, message: error.message});
    }
});

module.exports = router;
