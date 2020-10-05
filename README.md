# caesar-cipher-cli
***
### Install:
- 1) Clone this repository to your machine
- 2) Unzip archive (if U choose Download ZIP)
- 3) Open terminal in the unzipped directory (caesar-cipher-cli)
- 4) Go to the next caesar-cipher-cli directory (cd caesar-cipher-cli)
- 5) Run "npm install" command and wait while process will finish.
***
### Commands:
#### U can use following commands:
- 1) "node index.js -a encode -s 1" - enter symbols in the console, press enter and U can see converted result in the console. Press ctrl/command to exit program.
- 2) "node index.js -a encode -s 1 -i "./files/input.txt"" - To see converted string from ""./files/input.txt" file in the console.
- 3) "node index.js -a encode -s 1 -o "./files/output.txt"" - To see converted string from console in the ""./files/output.txt" file.
- 4) "node index.js -a encode -s 1 -o "./files/output.txt" -i "./files/input.txt"" - To see converted string from ./files/input.txt file in the ""./files/output.txt" file.
***
### Parameters:
- 1) U can use -i/--input, -o/--output, -s/--shift, -a/--action parameters.
- 2) -a(action) and -s(shift) are requared parameters.
- 3) "action" parameters may be or "encode" or "decode" value.
- 4) "shift" parameter can be < 0 or 0 or > 0
- 5) U can change only Latin symbols. Other symbols will ignore.