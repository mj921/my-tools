export enum CorruptState {
  None = 1,
  Corrupt1 = 2,
  Corrupt2 = 3,
  Corrupt3 = 4,
}

const ArmyUseRate = 1;
const ArmyWarUseRate = 2;
const ArmyPeopleNum = 3000;
const CorruptMax = 99;

const HarvestProbability: Record<string, number> = {
  dazai: 3,
  xiaozai: 12,
  dashou: 3,
  xiaoshou: 12,
  normal: 70,
};
const WarHarvestProbability: Record<string, number> = {
  dazai: 6,
  xiaozai: 24,
  dashou: 1,
  xiaoshou: 6,
  normal: 63,
};

const HarvestRate: Record<string, number> = {
  dazai: 0,
  xiaozai: 50,
  dashou: 150,
  xiaoshou: 130,
  normal: 100,
};

export default class Country {
  name: string = '';
  peopleMax: number = 100000;
  people: number = 10000;
  corruptState: CorruptState = CorruptState.None;
  armyNum: number = 1;
  money: number = 10000;
  corruptPercent: number = 0;
  isWar: boolean = false;

  constructor({ isWar = false }: { isWar?: boolean } = {}) {
    this.isWar = isWar;
  }
  update() {
    const armyPeopleNum = this.armyNum * ArmyPeopleNum;
    const baixing = this.people - armyPeopleNum;
    let harvestR = Math.random() * 100;
    let harvestRate = 100;
    const harvest = this.isWar ? WarHarvestProbability : HarvestProbability;
    for (const k in harvest) {
      if (harvestR < harvest[k]) {
        harvestRate = HarvestRate[k];
        break;
      } else {
        harvestR -= harvest[k];
      }
    }
    const createMoney = Math.floor(
      baixing * (harvestRate - this.corruptPercent) * 0.01 -
        armyPeopleNum * (this.isWar ? ArmyWarUseRate : ArmyUseRate),
    );
    this.money += createMoney;
    if (this.corruptPercent <= CorruptMax && (100 - this.corruptPercent) * 0.007 > Math.random()) {
      this.corruptPercent++;
    }
    if (this.corruptPercent >= 10 && Math.random() < (0.01 * (100 - this.corruptPercent)) / 100) {
      this.corruptPercent -= 10;
    }
    if (this.money > 0 && this.people < this.peopleMax) {
      this.people = Math.min(
        this.peopleMax,
        this.people +
          Math.floor(this.peopleMax / 100) * (0.1 + 0.9 * (1 - this.corruptPercent / 100)),
      );
    }
  }
}
