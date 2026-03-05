class Pokemon {
  constructor() {
    this.id        = null;
    this.name      = '';
    this.types     = [];
    this.mainType  = '';
    this.photo     = '';
    this.height    = 0;
    this.weight    = 0;
    this.stats     = [];
    this.abilities = [];
    this.baseExperience = null;
    this.speciesUrl = '';
  }

  get totalPower() {
    return this.stats.reduce((sum, s) => sum + s.base_stat, 0);
  }

  get formattedNumber() {
    return `#${String(this.id).padStart(3, '0')}`;
  }

  get formattedHeight() {
    return `${(this.height / 10).toFixed(1)} m`;
  }

  get formattedWeight() {
    return `${(this.weight / 10).toFixed(1)} kg`;
  }
}
