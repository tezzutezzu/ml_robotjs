const ws = new WebSocket("ws://localhost:40510");
let sending = false;

let codeB = `
// Type "Hello World".
robot.typeString("Hello World");

// Press enter.
robot.keyTap("enter");
`;

let codeA = `

// Speed up the mouse.
robot.setMouseDelay(2);

var twoPI = Math.PI * 2.0;
var screenSize = robot.getScreenSize();
var height = (screenSize.height / 2) - 10;
var width = screenSize.width;

for (var x = 0; x < width; x++)
{
	y = height * Math.sin((twoPI * x) / width) + height;
	robot.moveMouse(x, y);
}

`;

function setup() {
  createClassInput("classA", "test A", codeA);
  createClassInput("classB", "test B", codeB);
}

function createClassInput(parent, label, value) {
  const input = createElement("textarea").parent(parent);
  input.size(200, 200);
  input.value(value);
  const br = createElement("br").parent(parent);
  const button = createButton(label).parent(parent);
  button.mousePressed(() => {
    sendWSMessage(input.value());
  });
}

function sendWSMessage(d) {
  if (!sending) {
    sending = true;
    ws.send(d);
    setTimeout(() => (sending = false), 1000);
  }
}
