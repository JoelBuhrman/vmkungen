const rand = function() {
    return Math.random().toString(36).substr(2)
};

const generateToken = function() {
    return rand() + rand()
};


module.exports = {
	generateToken: generateToken
}
