const TuyAPI = require('tuyapi');

class BulbService {
  constructor(bulbId, bulbKey, bulbIp) {
    this._bulb = new TuyAPI({
      id: bulbId,
      key: bulbKey,
      ip: bulbIp
    });
  }

  BulbProperties = {
    1: 'POWER_ON', // true,false
    2: 'COLOUR_MODE', // "white","colour"
    3: 'WHITE_BRIGHTNESS', // 0-255
    4: 'WHITE_COLOUR_TEMP', // 0-255
    5: 'COLOUR_BRIGHTNESS_SATURATION' // a combination of hex codes
  };

  _processResult(result) {
    return Object.entries(result.dps).reduce((acc, [k, v]) => {
      const key = this.BulbProperties[k];
      acc[key] = v;
      return acc;
    }, {});
  }

  _invalid(value) {
    return {
      error: `${value} is invalid.`
    };
  }

  _error(err) {
    console.log(err);
    return {
      error: 'Nah bro.'
    };
  }

  async connect() {
    if (!(await this._bulb.find({ timeout: 20 }))) {
      console.log('Cannot find device');
      return false;
    }
    return await this._bulb.connect();
  }

  async disconnect() {
    await this._bulb.disconnect();
  }

  async toggle() {
    try {
      const status = await this._bulb.get({ dps: 1 });
      const result = await this._bulb.set({ dps: 1, set: !status });
      return this._processResult(result);
    } catch {
      return this._error();
    }
  }

  async colour() {
    try {
      const result = await this._bulb.set({ dps: 2, set: 'colour' });
      return this._processResult(result);
    } catch {
      return this._error();
    }
  }

  async white() {
    try {
      const result = await this._bulb.set({ dps: 2, set: 'white' });
      return this._processResult(result);
    } catch {
      return this._error();
    }
  }

  async whiteBrightness(levelStr) {
    try {
      const level = parseInt(levelStr);
      if (level < 0 || level > 255) {
        return this._invalid(level);
      }
      const result = await this._bulb.set({ dps: 3, set: level });
      return this._processResult(result);
    } catch {
      return this._error();
    }
  }

  async getInfo() {
    // my bulb only has 10 props, you may want to check if yours has more...
    return await [...Array(10).keys()].reduce(async (promisedAcc, key) => {
      const acc = await promisedAcc;
      const status = await this._bulb.get({ dps: key });
      if (status === undefined) return acc;
      if (this.BulbProperties[key]) {
        acc[this.BulbProperties[key]] = status;
      } else {
        acc[key] = status;
      }
      return acc;
    }, {});
  }
}

module.exports = BulbService;
