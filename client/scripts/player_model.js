class PlayerModel {
  constructor(user_name) {
    this.user_name = user_name;
    this.display_name = user_name;
    this.position = new Vec2(0, 0);
    this.speed = 13.5;

    this.reach = 70;

    this.player_width = 0.8;
    this.player_height = 2;
    this.velocity = 0;
    this.gravity = -17.81;
    this.jump_height = 5.1;
    this.y_check = -0.05;
    this.should_jump = false;
    this.is_grounded = false;
    this.is_jumping = false;

    //Health
    this.max_health = 100;
    this.health = this.max_health;
  }
}
