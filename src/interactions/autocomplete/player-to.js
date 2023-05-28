const { ComponentCommand } = require('../../classes/Commands');
const playerAutoCompleteHandler = require('./player');

module.exports = new ComponentCommand({ run: playerAutoCompleteHandler.run });
