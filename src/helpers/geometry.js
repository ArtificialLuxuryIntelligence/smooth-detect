// not quite the same as normal tween functions? - we don't track the intial value..

//   // step size range [0,1] (percent of total dist)
function stepToward(prevPos, actualPos, stepSize = 0.1) {
  let x, y;
  let [x1, y1] = [...prevPos];
  let [x2, y2] = [...actualPos];

  let d_x = x2 - x1;
  let d_y = y2 - y1;

  x = x1 + d_x * stepSize;
  y = y1 + d_y * stepSize;
  return [x, y];
}

// rename stepToward1D and above stepToward2D
function stepTowardLinear(prevVal, actualVal, stepSize = 0.1) {
  let d_x = actualVal - prevVal;

  return prevVal + d_x * stepSize;
}

function averageCoordinate(array) {
  let l = array.length;
  let c = array
    .reduce(
      (acc, curr) => {
        let [x, y, z] = acc;
        let [xc, yc, zc] = curr;
        return [x + xc, y + yc, z + zc];
      },
      [0, 0, 0]
    )
    .map((v) => v / l);
  return c;
}

function distanceCoordinates(c1, c2) {
  if (c1.length === 2) {
    return Math.sqrt((c2[0] - c1[0]) ** 2 + (c2[1] - c1[1]) ** 2);
  } else if (c1.length === 3) {
    return Math.sqrt(
      (c2[0] - c1[0]) ** 2 + (c2[1] - c1[1]) ** 2 + (c2[2] - c1[2]) ** 2
    );
  } else {
    throw new Error('please enter 2d or 3d vectors');
  }
}

// This maths is absolutely terrible
function angleCoordinatesXY(c1, c2) {
  let [x1, y1] = c1;
  let [x2, y2] = c2;
  let d_x = x2 - x1;
  let d_y = y2 - y1;
  let angle = Math.atan(d_y / d_x);
  let a;
  a = angle < 0 ? angle + Math.PI : angle;
  return Math.PI - a;
}

function stepToward3D(prevPos, actualPos, stepSize = 0.1) {
  let x, y, z;
  let [x1, y1, z1] = [...prevPos];
  let [x2, y2, z2] = [...actualPos];

  let d_x = x2 - x1;
  let d_y = y2 - y1;
  let d_z = z2 - z1;

  x = x1 + d_x * stepSize;
  y = y1 + d_y * stepSize;
  z = z1 + d_z * stepSize;
  return [x, y, z];
}

function stepToward2D(prevPos, actualPos, stepSize = 0.1) {
  let x, y;
  let [x1, y1] = [...prevPos];
  let [x2, y2] = [...actualPos];

  let d_x = x2 - x1;
  let d_y = y2 - y1;

  x = x1 + d_x * stepSize;
  y = y1 + d_y * stepSize;
  return [x, y];
}

function stepToward1D(prevVal, actualVal, stepSize = 0.1) {
  let d_x = actualVal - prevVal;
  return prevVal + d_x * stepSize;
}

export {
  stepToward1D,
  stepToward2D,
  stepToward3D,
  stepToward,
  stepTowardLinear,
  averageCoordinate,
  distanceCoordinates,
  angleCoordinatesXY,
};
