const crypto = require("crypto")
const { JWT_SECRET } = process.env

module.exports = {
    euclideanDistance: (featuresA, featuresB) => {
        return featuresA.map((x, i) => Math.abs(x - featuresB[i]) ** 2).reduce((sum, now) => sum + now) ** (1 / 2)
    },
    manhattanDistance: (featuresA, featuresB) => {
        return featuresA.map((x, i) => Math.abs(x - featuresB[i])).reduce((sum, now) => sum + now)
    },
    getInitializationVector: (len) => {
        return crypto.randomBytes(len)
    },
    encryptBiometrics: (descriptor, key) => {
        const message = descriptor.join('###');
        const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.alloc(16, 0)); // Use key and IV
        let encryptedData = cipher.update(message, 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        return encryptedData;
    },
    generateEncryptionKey: () => {
        return crypto.randomBytes(16); // 16 bytes for AES-256
    },
    decryptBiometrics: (descriptor, key) => {
        const decipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));
        console.log('decryptedData', decryptedData)
        let decryptedData = decipher?.update(descriptor, 'hex', 'utf-8');
        console.log('decryptedData', decryptedData)
        decryptedData += decipher?.final('utf8');
        console.log('decryptedData ++', decryptedData)
        return decryptedData?.split('###');
    }
}