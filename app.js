function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      buyButton: true,
      playerGold: 5,
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      render: false,
      battleLogs: [],
      isSwordBought: "",
    };
  },
  computed: {
    monsterBarStyles() {
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      return { width: this.playerHealth + "%" };
    },
    mayUseSpeacialAttack() {
      return this.currentRound % 3 !== 0;
    },
    buyButtonCheck() {
      if (this.playerGold >= 20) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    buySword() {
      this.isSwordBought = "swordBought";
    },
    playerSurrender() {
      this.winner = "monster";
    },
    gameRestart() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.battleLogs = [];
    },
    playerAttack() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth = this.monsterHealth - attackValue;
      this.battleLog("player", attackValue);
      this.monsterAttack();
      if (this.isSwordBought === "swordBought") {
        this.monsterHealth = this.monsterHealth - 3;
      }
    },
    monsterAttack() {
      const isCritical = Math.random() <= 0.1;
      const attackValue = isCritical
        ? getRandomValue(15, 22)
        : getRandomValue(8, 15);
      this.playerHealth = this.playerHealth - attackValue;
      this.battleLog("monster", attackValue);
    },
    playerSpecialAttack() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth = this.monsterHealth - attackValue;
      this.monsterAttack();
    },
    playerHeal() {
      this.currentRound++;
      const healValue = getRandomValue(8, 20);

      this.monsterAttack();
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth = this.playerHealth + healValue;
      }
    },
    battleLog(name, attackValue) {
      this.battleLogs.push({
        name: name,
        attackValue: attackValue,
      });
    },
  },
  watch: {
    winner(value) {
      if (value === "player") {
        this.playerGold = this.playerGold + 10;
      } else if (value === "monster") {
        this.playerGold = this.playerGold - 5;
      }
    },
    winner(value) {
      if (value === "draw" || value === "player" || value === "monster") {
        return (this.render = true);
      } else {
        return (this.render = false);
      }
    },
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
      this.battleLog("player heal", value);
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
      this.battleLog("monster heal", value);
    },
  },
});
app.mount("#game");
