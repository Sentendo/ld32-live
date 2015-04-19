class Company {
  static costPerAttack = 10;
  static budgetDamagePerAttack = 10;
  static minDamage = 0.001;
  static maxDamage = 0.01;

  protected bulletKey: String; // to be defined on the subclasses
  protected bulletDuration: number; // to be defined on the subclasses

  growth: number = 0.02;

  protected group: Phaser.Group;
  protected budgetDisplay: Phaser.Text;
  protected growthDisplay: Phaser.Text;
  protected growthIndicator: Phaser.Image;

  constructor(protected gameplay: Gameplay, public budget: number) {}

  get hitTarget(): Phaser.Point {
    return new Phaser.Point(this.group.x + 50, this.group.y + 40);
  }

  attack(otherCompany: Company) {
    if(!this.canAttack()) return;

    var rnd = this.gameplay.rnd;
    var damage = rnd.realInRange(Company.minDamage, Company.maxDamage);

    var newBullet = this.instantiateBullet(rnd, otherCompany.hitTarget, () => {
      otherCompany.takeDamage(damage);
      newBullet.destroy();
    });

    this.budget -= Company.costPerAttack;
    this.gameplay.world.add(newBullet);
  }

  private instantiateBullet(
    rnd: Phaser.RandomDataGenerator,
    hitTarget: Phaser.Point,
    onComplete: () => void
  ) {
    var bullet = this.gameplay.make.image(
      this.hitTarget.x + rnd.realInRange(-20,20),
      this.hitTarget.y + rnd.realInRange(-20,20),
      this.bulletKey
    );
    bullet.anchor.setTo(0.5, 0.5);
    bullet.rotation = rnd.realInRange(0,3);

    var movingX = this.gameplay.make.tween(bullet);
    movingX.to(
      { x: hitTarget.x + rnd.realInRange(-20,20) },
      this.bulletDuration
    );
    movingX.onComplete.add(onComplete);

    var movingY = this.gameplay.make.tween(bullet);
    movingY.to(
      { y: hitTarget.y + rnd.realInRange(-20,20) },
      this.bulletDuration,
      Phaser.Easing.Cubic.Out
    );

    var rotating = this.gameplay.make.tween(bullet);
    rotating.to({rotation: rnd.realInRange(10,20)}, this.bulletDuration);

    var growing = this.gameplay.make.tween(bullet.scale);
    growing.from(
      {x: 0.2, y: 0.2},
      this.bulletDuration,
      Phaser.Easing.Cubic.Out
    );

    movingX.start();
    movingY.start();
    rotating.start();
    growing.start();

    return bullet;
  }

  takeDamage(damage) {
    this.growth -= damage;
    this.budget -= Company.budgetDamagePerAttack;
  }

  canAttack() {
    return this.budget >= Company.costPerAttack;
  }

  adjustBudget(fps) {
    this.budget *= (1 + this.growth/fps);
  }
}
