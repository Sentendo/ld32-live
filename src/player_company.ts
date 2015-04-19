class PlayerCompany extends Company {
  static startingMoney = 10000; // 10k

  protected bulletKey = "player_bullet";
  protected bulletDuration = 1000; // 1 second

  constructor(gameplay: Gameplay) {
    super(gameplay, PlayerCompany.startingMoney);
  }

  get hitTarget(): Phaser.Point {
    return new Phaser.Point(this.group.x + 130, this.group.y + 250);
  }

  preload() {
    var load = this.gameplay.load;

    load.image("building", "/images/player/building.png");
    load.image("large_growth_up", "/images/player/growth_up.png");
    load.image("large_growth_down", "/images/player/growth_down.png");
    load.image("player_bullet", "/images/player/bullet.png");
  }

  create(game: Phaser.Game) {
    this.group = game.make.group();

    this.group.add(game.make.image(80, 190, "building"));
    this.group.add(game.make.text(
      0, 0,
      "Your Company",
      { font: "24px Arial", fill: "#fff", align: "center" }
    ));

    this.budgetDisplay = game.make.text(
      260, 70,
      "XXX.XXX",
      { font: "24px Arial", fill: "#fff", align: "center" }
    );
    this.budgetDisplay.anchor.set(1, 0);
    this.group.add(this.budgetDisplay);

    this.growthDisplay = game.make.text(
      180, 370,
      "XX %",
      { font: "20px Arial", fill: "#fff", align: "center" }
    );
    this.growthDisplay.anchor.set(1, 0);
    this.group.add(this.growthDisplay);

    this.growthIndicator = game.make.image(
      180, 370, "growth_up"
    );
    this.group.add(this.growthIndicator);

    return this.group;
  }

  update(time: Phaser.Time) {
    this.adjustBudget(60);
  }

  render() {
    this.budgetDisplay.text = Math.floor(this.budget).toString();
    this.growthDisplay.text = Math.floor(this.growth*100*10)/10 + " %";

    if(this.growth > 0) {
      this.growthIndicator.loadTexture("large_growth_up", 0);
    } else {
      this.growthIndicator.loadTexture("large_growth_down", 0);
    }
  }
}
