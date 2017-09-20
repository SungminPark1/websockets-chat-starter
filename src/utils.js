const invalidCommand = `Invalid Command
/help for a list of commands`;
const commands = `
List of Comands:
/dog -annoying dog
/roll -to roll a die &#10;/time -get the time
/users -get number of users
/changeuser (new name) -changes username`;
const dog = `
.....__...________...__.........................
....|  |_|        |_|  |........Bark............
....|                  |___.........Bark........
..._|                      |_..............__...
..|      |#|    |#|          |__..........|  |..
..|                             |___......|  |..
..|         |##|                    |_____|  |..
..|    |#|  |#|  |#|                         |..
..|       |#####|                            |..
..|                                          |..
..|                                          |..
..|                                          |..
..|                                         _|..
..|__                                      |....
.....|    ____     ________       ____     |....
.....|   |...|    |........|    _|....|    |....
.....|  _|...|  _|.........|  _|......|  _|.....
.....|_|.....|_|...........|_|........|_|.......`;

module.exports = {
  invalidCommand,
  commands,
  dog,
};
