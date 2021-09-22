const EPS = 1e-9; // epsilon value used in computations

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  onLine = (line) => {
    return Math.abs(line.a * this.x + line.b * this.y + line.c) < EPS;
  };
}

export class Line {
  // creates Line objects defining the line satisfying
  // this.a * x + this.b * y + c = 0
  constructor(p, q) {
    this.a = p.y - q.y;
    this.b = q.x - p.x;
    this.c = p.x * q.y - q.x * p.y;
  }
}

export class Segment {
  constructor(x1, y1, x2, y2) {
    this.a = new Point(x1, y1);
    this.b = new Point(x2, y2);
  }

  getLine = () => {
    return new Line(this.a, this.b);
  };
}

export class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
}

const isBetween = (a, b, c) => {
  if (a > c) [a, c] = [c, a];
  return a - EPS <= b && b <= c + EPS;
};

export const isPointOnSegment = (point, segment) => {
  if (!point.onLine(segment.getLine())) return false;
  return (
    isBetween(segment.a.x, point.x, segment.b.x) &&
    isBetween(segment.a.y, point.y, segment.b.y)
  );
};

export const lineCircleIntersection = (line, circle) => {
  // returns 0, 1 or 2 points of intersection

  let a = line.a,
    b = line.b,
    c = line.c,
    r = circle.radius;

  // we translate the line and circle
  // s.t. the circle has the center at the origin
  const dx = -circle.x,
    dy = -circle.y; // vector by which we need to translate the plane
  c -= a * dx + b * dy;

  // (x0, y0) is the point on the line that is the closest to the origin
  const x0 = (-a * c) / (a * a + b * b);
  const y0 = (-b * c) / (a * a + b * b);

  const d0 = Math.sqrt(x0 * x0 + y0 * y0); // distance from (x0, y0) to origin

  let points = [];
  // if (Math.abs(d0 - r) < EPS) {
  if (Math.abs(c * c - r * r * (a * a + b * b)) < EPS) {
    // the line is tangent
    points = [Point(x0, y0)];
    // } else if (d0 + EPS < r) {
  } else if (c * c <= r * r * (a * a + b * b) + EPS) {
    // there are 2 intersection points
    const d = r * r - (c * c) / (a * a + b * b);
    const mult = Math.sqrt(d / (a * a + b * b));

    points = [
      new Point(x0 + b * mult, y0 - a * mult),
      new Point(x0 - b * mult, y0 + a * mult),
    ];
  }

  // we translate the points back
  for (let point of points) {
    point.x -= dx;
    point.y -= dy;
  }

  return points;
};

export const segmentCircleIntersection = (segment, circle) => {
  const line_points = lineCircleIntersection(
    new Line(segment.a, segment.b),
    circle
  );
  const segm_points = [];
  for (let point of line_points) {
    if (isPointOnSegment(point, segment)) segm_points.push(point);
  }
  console.assert(segm_points.length <= 1);
  return segm_points;
};
