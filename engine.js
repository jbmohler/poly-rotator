// Get the canvas and context
const canvas = document.getElementById("canvas");

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  scale(factor) {
    return new Vector(factor * this.x, factor * this.y);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }
}

function isPointInTriangle(p, a, b, c) {
  p = new Vector(p.x, p.y);
  a = new Vector(a.x, a.y);
  b = new Vector(b.x, b.y);
  c = new Vector(c.x, c.y);

  const v0 = c.subtract(a);
  const v1 = b.subtract(a);
  const v2 = p.subtract(a);

  const dot00 = v0.dot(v0);
  const dot01 = v0.dot(v1);
  const dot02 = v0.dot(v2);
  const dot11 = v1.dot(v1);
  const dot12 = v1.dot(v2);

  const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  return u >= 0 && v >= 0 && u + v < 1;
}

class Polygon {
  constructor(center, sides, radius, rotation) {
    this.center = center;
    this.sides = sides;
    this.radius = radius;
    this.rotation = rotation;

    this._vertices = null;
  }

  vertices() {
    if (this._vertices === null) {
      const angle = (Math.PI * 2) / this.sides;
      this._vertices = [];
      for (let i = 0; i < this.sides; i++) {
        const x =
          this.center.x + this.radius * Math.cos(this.rotation + angle * i);
        const y =
          this.center.y + this.radius * Math.sin(this.rotation + angle * i);

        this._vertices.push({ x, y });
      }
    }

    return this._vertices;
  }
}

function iterateCircularPairs(array) {
  const n = array.length;
  const pairs = [];

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    pairs.push([array[i], array[j]]);
  }

  return pairs;
}

function s(v) {
  return `(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`;
}

function isInterior(p1, p2) {
  for (let ip2 of p2.vertices()) {
    for (const [v1, v2] of iterateCircularPairs(p1.vertices())) {
      console.log(`Testing ${s(ip2)} is in side ${s(v1)}, ${s(v2)}`);

      if (isPointInTriangle(ip2, p1.center, v1, v2)) {
        console.log(`Point ${s(ip2)} is in side ${s(v1)}, ${s(v2)}`);
      }
    }
  }
}

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

  const p1 = new Polygon(center, 4, 5, Math.PI / 3);
  const p2 = new Polygon(center, 3, 10, Math.PI / 2.95);

  isInterior(p2, p1);
}
