const otpGenerator = require("otp-generator");

const generateOTP = () => {
    const OTP = otpGenerator.generate(4, {
        digits: true,           // Use only digits (numbers)
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });


    return OTP;
};

module.exports = generateOTP;