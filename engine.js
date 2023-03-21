// Define a function to generate a regular polygon with a given center and radius
function generateRegularPolygon(ctx, centerX, centerY, sides, radius, startAngle = 0) {
  // Calculate the angle between each vertex of the polygon
  const angle = Math.PI * 2 / sides;

  // Begin a new path
  ctx.beginPath();

  // Move to the first vertex of the polygon
  ctx.moveTo(centerX + radius * Math.cos(startAngle), centerY + radius * Math.sin(startAngle));

  // Loop through the remaining vertices of the polygon and draw lines between them
  for (let i = 1; i < sides; i++) {
    const x = centerX + radius * Math.cos(startAngle + angle * i);
    const y = centerY + radius * Math.sin(startAngle + angle * i);
    ctx.lineTo(x, y);
  }

  // Close the path to complete the polygon
  ctx.closePath();

  // Fill the polygon with a random color
  ctx.fillStyle = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
  ctx.fill();
}


