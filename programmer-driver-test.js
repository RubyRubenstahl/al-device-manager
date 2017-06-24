/**
 * Created by miket on 6/19/2017.
 */
const ProgrammerDriver = require('./ecue-programmer-driver');

let programmer = new ProgrammerDriver();

programmer.commands().PLAY_CUELIST.run();