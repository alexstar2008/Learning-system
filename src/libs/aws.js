'use strict';

const { S3 } = require('aws-sdk');
//
const { aws } = require('../../config');


function uploadImg(picture, bucketName, id, prefix = '') {
    const Bucket = aws.buckets[bucketName];
    const bucket = new S3({ ...aws.credentials, params: { Bucket } });
    const extensionRegex = /(?:\.([^.]+))?$/;
    const extension = extensionRegex.exec(picture.name)[1];
    const uploadParams = {
        Key: `${id + prefix}.${extension}`,
        Body: picture,
        ContentType: picture.mimetype,
        ACL: 'public-read'
    };
    return new Promise((resolve, reject) => {
        bucket.upload(uploadParams, (err, data) => {
            if (err) {
                return reject(err);
            }
            const { Location: picture } = data;
            resolve(picture);
        });
    });
}

module.exports = {
    uploadImg
};