function Player() {
  this.color = 'color';
  if (!Player.total) {
    Player.total = 0;
  }
  Player.total++;
}

const p1 = new Player();
console.log(Player.total);
const p2 = new Player();
console.log(Player.total);
const p3 = new Player();
console.log(Player.total);