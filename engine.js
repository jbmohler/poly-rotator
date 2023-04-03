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

function barycentric_uvw(p, a, b, c) {
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

  const w = 1 - u - v;

  return { u, v, w };
}

function isPointInTriangle(p, a, b, c) {
  const bary = barycentric_uvw(p, a, b, c);

  console.log(bary.u.toFixed(2), " -- A-B");
  console.log(bary.v.toFixed(2), " -- A-C");
  console.log(bary.w.toFixed(2), " -- B-C");

  return bary.u >= 0 && bary.v >= 0 && bary.w >= 0;
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

function expand(poly, enclosed) {
  let radDelta = [];
  for (let e1 of enclosed.vertices()) {
    for (const [v1, v2] of iterateCircularPairs(poly.vertices())) {
      const bary = barycentric_uvw(e1, v1, v2, poly.center);

      radDelta.push(bary.u);
    }
  }

  const factor = Math.min(...radDelta);

  return new Polygon(
    poly.center,
    poly.sides,
    poly.radius - poly.radius * factor,
    poly.rotation
  );
}

// Define a function to generate a regular polygon with a given center and radius
function strokePolygon(poly, color = null) {
  const ctx = canvas.getContext("2d");
  // Calculate the angle between each vertex of the polygon
  const angle = (Math.PI * 2) / poly.sides;

  if (!color) {
    color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    })`;
  }
  ctx.strokeStyle = color;

  // Begin a new path
  ctx.beginPath();

  const verts = poly.vertices();

  // Move to the first vertex of the polygon
  ctx.moveTo(verts[0].x, verts[0].y);

  // Loop through the remaining vertices of the polygon and draw lines between them
  for (let i = 1; i < poly.sides; i++) {
    ctx.lineTo(verts[i].x, verts[i].y);
  }

  // Close the path to complete the polygon
  ctx.closePath();

  // Draw the stroke (outline) of the polygon
  ctx.stroke();
}

function generatePolygon() {
  // Get the side count dropdown and generate button
  const sideCountSelect = document.getElementById("polyCircum");
  // Get the selected side count from the dropdown
  const sides = parseInt(sideCountSelect.value);

  // Calculate the radius of the polygon based on the size of the canvas
  const radius = Math.min(canvas.width, canvas.height) * 0.4;

  // Calculate the center of the canvas
  const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  const reg = new Polygon(center, sides, radius, Math.PI / 3);

  // Call the strokePolygon function to draw the polygon
  strokePolygon(reg, "blue");
}

function testExpansion() {
  const sideCountSelect = document.getElementById("polyCircum");
  const sidesCircum = parseInt(sideCountSelect.value);

  const xx = document.getElementById("polyInscribedSides");
  const sidesIn = parseInt(xx.value);

  // Calculate the radius of the polygon based on the size of the canvas
  const radius = Math.min(canvas.width, canvas.height) * 0.4;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate the center of the canvas
  const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  const p1 = new Polygon(
    center,
    sidesIn,
    40 + Math.random() * 50,
    Math.random() * 2 * Math.PI
  );
  const p2 = new Polygon(
    center,
    sidesCircum,
    40 + Math.random() * 50,
    Math.random() * 2 * Math.PI
  );

  strokePolygon(p1, "red");
  strokePolygon(p2, "red");

  const p3 = expand(p2, p1);
  strokePolygon(p3, "black");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var rotatingLive = null;

function testRotation() {
  const sideCountSelect = document.getElementById("polyCircum");
  const sidesCircum = parseInt(sideCountSelect.value);

  const xx = document.getElementById("polyInscribedSides");
  const sidesIn = parseInt(xx.value);

  const bracketed = document.getElementById("bracketed").checked;
  console.log(bracketed);

  // Calculate the radius of the polygon based on the size of the canvas
  const factor = sidesCircum === 3 || sidesIn === 3 ? 0.25 : 0.4;
  const radius = Math.min(canvas.width, canvas.height) * 0.3;

  // Calculate the center of the canvas
  const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  const p1 = new Polygon(center, sidesIn, radius, Math.random() * 2 * Math.PI);
  const ctx = canvas.getContext("2d");

  const myInstance = (Math.random() * 10000).toFixed(0);
  rotatingLive = myInstance;

  async function spin() {
    for (let i = 0; i < 1000; i++) {
      const p2 = new Polygon(
        center,
        sidesCircum,
        radius,
        (i / 100) * 2 * Math.PI
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      strokePolygon(p1, "red");
      //strokePolygon(p2, "red");

      const p3 = expand(p2, p1);
      strokePolygon(p3, "black");

      if (bracketed) {
        const p4 = expand(p1, p3);
        strokePolygon(p4, "red");
      }

      await sleep(0.25 * 1000);
      if (rotatingLive !== myInstance) {
        break;
      }
    }
    if (rotatingLive === myInstance) {
      rotatingLive = null;
    }
  }

  spin();
}

var triangle = null;

function get_barycentric_coords(event) {
  var elemLeft = canvas.offsetLeft;
  var elemTop = canvas.offsetTop;
  var xVal = event.pageX - elemLeft;
  var yVal = event.pageY - elemTop;

  var p = { x: xVal, y: yVal };

  isPointInTriangle(p, triangle[0], triangle[1], triangle[2]);
}

function examine() {
  canvas.addEventListener("click", get_barycentric_coords, false);

  triangle = [];
  triangle.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
  });
  triangle.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
  });
  triangle.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
  });

  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "red";

  // Begin a new path
  ctx.beginPath();

  // Move to the first vertex of the polygon
  ctx.moveTo(triangle[0].x, triangle[0].y);

  // Loop through the remaining vertices of the polygon and draw lines between them
  for (let i = 1; i < 3; i++) {
    ctx.lineTo(triangle[i].x, triangle[i].y);
  }
  for (let i = 0; i < 3; i++) {
    ctx.fillText(["A", "B", "C"][i], triangle[i].x, triangle[i].y);
  }

  // Close the path to complete the polygon
  ctx.closePath();

  // Draw the stroke (outline) of the polygon
  ctx.stroke();
}
