const prompt = require('prompt-sync')({
    sigint: true
});
const clear = require('clear-screen')

// Set variable to set field ,hat and charactor
const hat = '⛺';
const hole = '⬛';
const fieldCharacter = '⬜';
const pathCharacter = '🐌';

// Create Field
class Field {
    constructor(field = [
        []
    ]) {
        this.field = field;
        this.locationX = 0;
        this.locationY = 0;
        this.fieldHeight = field.length;
        this.fieldWidth = field[0].length;

        

        do {
            this.locationX = Math.floor(Math.random() * this.fieldWidth); // Random X coordinate
            this.locationY = Math.floor(Math.random() * this.fieldHeight); // Random Y coordinate
            console.log("Do field before", this.field)
        } while (!this.isValidStart()); // Ensure a valid starting position
        this.field[this.locationY][this.locationX] = pathCharacter;
    }

    isValidStart() {
        // Check if the player character is surrounded by valid positions 
        for (let y = this.locationY - 1; y <= this.locationY + 1; y++) {
            for (let x = this.locationX - 1; x <= this.locationX + 1; x++) {
                if (
                    y >= 0 && y < this.fieldHeight && x >= 0 && x < this.fieldWidth &&
                    (y !== this.locationY || x !== this.locationX) && // Exclude the current position
                    this.field[y][x] === hole
                ) {
                    return false;
                }
            }
        }
        return this.hasPathToHat(this.locationX, this.locationY);
    }

    // Creat function for path to go find hat
    hasPathToHat(startX, startY) {
        const visited = Array.from({
            length: this.fieldHeight
        }, () => Array(this.fieldWidth).fill(false));
        const queue = [{
            x: startX,
            y: startY
        }];

        while (queue.length > 0) {
            const {
                x,
                y
            } = queue.shift();
            if (x < 0 || x >= this.fieldWidth || y < 0 || y >= this.fieldHeight || visited[y][x] || this.field[y][x] === hole) {
                continue;
            }
            if (this.field[y][x] === hat) {
                return true;
            }
            visited[y][x] = true;
            queue.push({
                x: x - 1,
                y
            }, {
                x: x + 1,
                y
            }, {
                x,
                y: y - 1
            }, {
                x,
                y: y + 1
            });
        }
        return false;
    }


    // Generate field and get params for set field size and set rate hole
    static generateField(height, width, percentage = 0.2) {
        let field = new Array(height);

        // Loop to create 2D array using 1D array
        for (let i = 0; i < field.length; i++) {
            field[i] = new Array(width);
        }

        // Loop to initilize 2D array elements.
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                const rand = Math.random();
                field[i][j] = rand > percentage ? fieldCharacter : hole;
            }
        }

        const hatLocation = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height),
        };

        field[hatLocation.y][hatLocation.x] = hat;
        return field;
    }
    // Create mode for player select 
    static challenge() {
        console.log("Choose difficulty level:");
        console.log("1. Newbie");
        console.log("2. Child");
        console.log("3. A little older than a child");
        console.log("***If another level you must contact developer!!");
        let fieldSize = [];

        // and can choose mode 
        const choice = prompt("Select your ways : ");
        switch (choice) {
            case '1':
                return fieldSize = [10,10,0.1]
            case '2':
                return fieldSize = [20,20,0.2]
            case '3':
                return fieldSize = [30,30,0.3]
            default:
                console.log("Invalid choice. Using default difficulty.");
                return this.challenge();
        }
    }

    // Ceate function for clear terminal and replace same posittion
    clearField(){
        clear();
        this.instructions();
        this.field.forEach(e => console.log(e.join("")))
        
    }

    // Create check Playing each condition
    play() {
        let playing = true;
        while (playing) {
            this.clearField();
            this.askQuestion();
            if (!this.isInBounds()) {
                console.log("Whoops. Out of bounds!");
                playing = false;
                break;
            } else if (this.isHole()) {
                console.log("Sorry, you fell down a hole!");
                playing = false;
                break;
            } else if (this.isHat()) {
                console.log("Yay, you found your house!");
                playing = false;
                break;
            }
            // Update the current location on the map
            this.field[this.locationY][this.locationX] = pathCharacter;
        }
    }

    // intro and guide how to play this game
    instructions() {
        console.log(
            "\n**INSTRUCTIONS:**\nFIND THE HOUSE! \nType W, S, A, D, (Up, Down, Left, Right) and hit enter to find the house --> ^\nPress control + c to exit.\n"
        );
    }

    // Queston every time before and after player select turn
    askQuestion() {
        const answer = prompt("Which way do you want to go? --> ").toLowerCase();
        switch (answer) {
            case "w":
                this.locationY -= 1;
                break;
            case "s":
                this.locationY += 1;
                break;
            case "a":
                this.locationX -= 1;
                break;
            case "d":
                this.locationX += 1;
                break;
            default:
                console.log("Invalid. Enter W, S, D or A.");
                this.askQuestion();
                break;
        }
    }

    isInBounds() {
        return (
            this.locationY >= 0 &&
            this.locationX >= 0 &&
            this.locationY < this.field.length &&
            this.locationX < this.field[0].length
        );
    }

    isHat() {
        return this.field[this.locationY][this.locationX] === hat;
    }

    isHole() {
        return this.field[this.locationY][this.locationX] === hole;
    }

}

const challenge = Field.challenge();
const newField = new Field(Field.generateField(challenge[0], challenge[1], challenge[2]));
newField.play();