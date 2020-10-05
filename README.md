# caesar-cipher-cli
***
### Install:
- Clone this repository to your machine
- Unzip archive (if U choose Download ZIP)
- Open terminal in the unzipped directory (caesar-cipher-cli)
- Go to the next caesar-cipher-cli directory (cd caesar-cipher-cli)
- Run "npm install" command and wait while process will finish.
***
### Commands:
#### For example you can use following commands:
- `node index.js -a encode -s 1` - enter symbols in the console, press enter and U can see converted result in the console. Press ctrl/command to exit program.
- `node index.js -a encode -s 1 -i "./files/input.txt"` - To see converted string from ""./files/input.txt" file in the console.
- `node index.js -a encode -s 1 -o "./files/output.txt"` - To see converted string from console in the ""./files/output.txt" file.
- `node index.js -a encode -s 1 -o "./files/output.txt` -i "./files/input.txt"" - To see converted string from ./files/input.txt file in the ""./files/output.txt" file.
***
### Parameters:
- You can use `-i/--input`, `-o/--output`, `-s/--shift`, `-a/--action` parameters.
- -a(action) and -s(shift) are requared parameters.
- "action" parameters may be or "encode" or "decode" value.
- "shift" parameter can be < 0 or 0 or > 0
- You can change only Latin symbols. Other symbols will ignore.
- You can use different files path you want. System will check files existing and file permissions and let you know if womething will wrong.