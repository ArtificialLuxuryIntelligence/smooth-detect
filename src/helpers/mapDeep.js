// TESTER FILE - FN AT BOTTOM

console.clear();

let o1 = {
  val: [0, 1],
  val2: [0.4, 0.2],
  val3: [
    [0.4, 0.2],
    [0.4, 0.2],
    [0.4, 0.2],
  ],
  val4: 3,
  val5: 'string',
  val6: {
    val: [1, 0, 2],
  },
};

let o2 = {
  val: [0, 0.8],
  val2: [0.1, 0.1],
  val3: [
    [0.4, 0.3],
    [0.5, 0.2],
    [0.4, 0.2],
  ],
  val4: 4,
  val5: 'straang',

  val6: {
    val: [1, 0, 1],
  },
};

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}
function mapDeep(mapper, mapperArgs, target, source) {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mapDeep(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: mapper(mapperArgs, key, target[key], source[key]),
        });
      }
    }
  }

  return target;
}

// slightly confusing way around o1, o2 but I might be dumb
// let o3 = mapDeep(mapper, o1, o2);
// console.log(o3);

// this is what user will enter in config
//optional key arg for picking out specific keys if wanted (otherwise just use array length)
function mapper(val1, val2, key) {
  // console.log(key);
  if (Array.isArray(val1)) {
    if (val1.length === 2) {
      return stepToward2D(val1, val2, 0.1);
    }
    // if /...
    // handle long array of arrays,
    // 3d array
    else return val2; // or 1?
  }
  if (typeof val1 === 'number') {
    return stepToward1D(val1, val2, 0.1);
  }
  return val2; // if none of the above are satisfied
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

export default mapDeep;
