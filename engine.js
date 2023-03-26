// Get the canvas and context
const canvas = document.getElementById("canvas");

// Define a function to generate a regular polygon with a given center and radius
function generateRegularPolygon(
  center,
  sides,
  radius,
  startAngle = 0,
  color = null
) {
  const ctx = canvas.getContext("2d");
  // Calculate the angle between each vertex of the polygon
  const angle = (Math.PI * 2) / sides;

  const centerX = center.x;
  const centerY = center.y;

  if (!color) {
    color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    })`;
  }
  console.log(color);
  ctx.strokeStyle = color;

  // Begin a new path
  ctx.beginPath();

  // Move to the first vertex of the polygon
  ctx.moveTo(
    centerX + radius * Math.cos(startAngle),
    centerY + radius * Math.sin(startAngle)
  );

  // Loop through the remaining vertices of the polygon and draw lines between them
  for (let i = 1; i < sides; i++) {
    const x = centerX + radius * Math.cos(startAngle + angle * i);
    const y = centerY + radius * Math.sin(startAngle + angle * i);
    ctx.lineTo(x, y);
  }

  // Close the path to complete the polygon
  ctx.closePath();

  // Draw the stroke (outline) of the polygon
  ctx.stroke();
}

class Polygon {
  constructor(center, sides, radius, strokeColor) {
    this.center = center;
    this.sides = sides;
    this.radius = radius;
    this.strokeColor = strokeColor;

    this._vertices = null;
  }

  computeVertices() {}
}

function generatePolygon() {
  // Get the side count dropdown and generate button
  const sideCountSelect = document.getElementById("sideCount");
  const generateButton = document.getElementById("generatePolygon");
  // Get the selected side count from the dropdown
  const sides = parseInt(sideCountSelect.value);

  // Calculate the radius of the polygon based on the size of the canvas
  const radius = Math.min(canvas.width, canvas.height) * 0.4;

  // Calculate the center of the canvas
  const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  // Call the generateRegularPolygon function to draw the polygon
  generateRegularPolygon(center, sides, radius, Math.PI / 3, "blue");
}
