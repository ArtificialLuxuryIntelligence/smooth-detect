// takes a slow promise and allows it to be run quickly with values interpolated (using any function) when slow promise  has yet to return

// slowPromise :FUNCTION returns a promise that takes some time to resolve
// stepToward : FUNCTION called on previous calculated value and resolved value of promise
// fps : frames per second for slowPromise to be called (leave as false if max fps for promise is desired)

export default class Interpolator {
  constructor(slowPromise, stepToward, fps = false) {
    this.slowPromise = slowPromise;
    this.stepToward = stepToward;
    this.fast = null; //updated every iteration call (note: here it is the whole prediction object -  see defaults)
    this.slow = null; //updated only when promise resolves
    this.resolved = true;
    this.fps = fps;
  }

  interpolate(val) {
    this.__updateSlow(val);
    this.__updateFast();
    return this.fast;
  }
  __updateFast() {
    if (!this.fast) {
      this.fast = this.slow;
    } else {
      this.fast = this.stepToward(this.fast, this.slow); // current val, target val, 
    }
  }
  async __updateSlow(val) {
    if (!this.resolved) {
      return;
    }
    if (this.resolved) {
      this.resolved = false;
      let v;

      if (this.fps) {
        /**
         note: if the slowPromise resolves much more quickly than the timeout(fps) then
         there there is a delay and what is returned can be 'stale'
         i.e. here the detection will be from too many frames ago and be delayed
         difficult to solve as we don't know how long slow promise will take
         */
        //
        const [p1, p2] = [this.slowPromise(val), this.__timeoutPromise()];
        let p = await Promise.all([p1, p2]);
        v = p[0];
        this.resolved = true;
        v && (this.slow = v);
      } else {
        v = await this.slowPromise(val);
        this.resolved = true;
        v && (this.slow = v);
      }
    }
  }

  // helper to enforce fps minimum
  async __timeoutPromise() {
    // console.log('calling TO');
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000 / this.fps);
    }).then(() => {
      // console.log('resolved TO');
      return null;
    });
  }
}
