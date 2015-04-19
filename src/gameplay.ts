enum GameplayState {
  Idle, IntroducingCompetitor
}

class Gameplay extends Phaser.State {
  public player: PlayerCompany;
  public competitors: Array<Competitor> = [];

  private competitorSlots: Array<CompetitorSlot> = [null, null, null];
  private competitorData = [
    {bulletDelay: 2500, startingBudget: 100},
    {bulletDelay: 4000, startingBudget: 200},
    {bulletDelay: 3000, startingBudget: 500},
  ]

  private state = GameplayState.Idle;

  init() {
    this.player = new PlayerCompany(this);
  }

  preload() {
    this.player.preload();
  }

  create() {
    this.game.stage.backgroundColor = "#666";

    for (let i = 0; i < this.competitorSlots.length; i++) {
      var slot = new CompetitorSlot(this.game);
      slot.position.setTo(600, 100 + i*160);
      this.world.add(slot);
      this.competitorSlots.push(slot);
    }

    var playerCompanyGroup = this.player.create(this.game);
    playerCompanyGroup.position.setTo(0, 0);
    this.world.add(playerCompanyGroup);
  }

  update() {
    for (let i = 0; i < this.competitorSlots.length; i++) {
      var slot = this.competitorSlots[i];
      if(slot.competitor)
        slot.competitor.update(this.time);
    }
    this.player.update(this.time);

    this.maybeIntroduceNewCompetitors();
  }

  private maybeIntroduceNewCompetitors() {
    if(this.state == GameplayState.IntroducingCompetitor)
      return;
    if(this.competitorData.length == 0)
      return;

    var emptySlots = [];
    for (let i = 0; i < this.competitorSlots.length; i++) {
      var slot = this.competitorSlots[i];
      if(!slot.competitor)
        emptySlots.push(slot);
    }

    if(emptySlots.length == this.competitorSlots.length) {
      this.introduceNewCompetitor(emptySlots[0]);
    }
  }

  private introduceNewCompetitor(slot: CompetitorSlot) {
    console.debug("Introducing a new competitor");

    var data = this.competitorData.shift();
    var competitor = new Competitor(this, this.player, data.bulletDelay, data.startingBudget);

    competitor.preload(this.load);
    this.load.onLoadComplete.addOnce(() => {
      competitor.create(this.game);
      slot.competitor = competitor;
      this.state = GameplayState.Idle;
    })
    this.load.start();

    console.debug("--- done");
  }

  render() {
    for (let i = 0; i < this.competitorSlots.length; i++) {
      var slot = this.competitorSlots[i];
      if(slot.competitor)
        slot.competitor.render();
    }
    this.player.render();
  }
}
