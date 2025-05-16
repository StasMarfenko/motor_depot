import { table } from 'table'
import readline from 'readline-sync';

class Driver {
    name: string;
    surname: string;
    age: number;
    experience: number;
  
    constructor(name: string, surname: string, age: number, experience: number) {
      if (age < 18) {
        console.log("Водитель должен быть старше 18 лет");
      }
  
      if (experience > (age - 18)) {
        console.log(`Опыт вождения не может превышать возраст. Опыт считается, начиная с 18 лет`);
      }
  
      this.name = name;
      this.surname = surname;
      this.age = age;
      this.experience = experience;
    }
  }

  abstract class TruckState {
    abstract getStateName(): string;
    abstract changeDriver(): string;
    abstract startRun(): string;
    abstract startRepair(): string;
  }

  class InBaseState extends TruckState {
    getStateName(): string {
      return "На базе";
    }
  
    changeDriver(): string {
      return "Водитель успешно сменён.";
    }
  
    startRun(): string {
      return "Грузовик отправлен в путь.";
    }
  
    startRepair(): string {
      return "Грузовик отправлен на ремонт.";
    }
  }
 
  class InRunState extends TruckState {
    getStateName(): string {
      return "В пути";
    }
  
    changeDriver(): string {
      return "Ошибка: Нельзя менять водителя в пути.";
    }
  
    startRun(): string {
      return "Ошибка: Грузовик уже в пути.";
    }
  
    startRepair(): string {
      return "Грузовик отправлен на ремонт.";
    }
  }

  class InRepairState extends TruckState {
    getStateName(): string {
      return "На ремонте";
    }
  
    changeDriver(): string {
      return "Ошибка: Нельзя менять водителя на ремонте.";
    }
  
    startRun(): string {
      const random = Math.random();
      if (random < 0.5) {
        return "Грузовик починен и отправлен в путь.";
      } else {
        return "Грузовик починен и возвращён на базу.";
      }
    }
  
    startRepair(): string {
      return "Ошибка: Грузовик уже на ремонте.";
    }
  }

  class Truck {
  id: number;
  name: string;
  driver: Driver;
  state: TruckState;
  stringState: string;

  constructor(id: number, name: string, driver: Driver) {
    this.id = id;
    this.name = name;
    this.driver = driver;
    this.state = new InBaseState();
    this.stringState = this.state.getStateName();
  }

  changeDriver(): void {
    console.log(this.state.changeDriver());
  }

  startRun(): void {
    if (this.driver.age < 18) {
        console.log(`Ошибка: Водитель ${this.driver.name} слишком молод, чтобы отправиться в путь.`);
        return;
      }
      const result = this.state.startRun();
      console.log(result);
    
      if (result.includes("путь")) {
        this.state = new InRunState();
        this.stringState = this.state.getStateName();
      } else if (result.includes("базу")) {
        this.state = new InBaseState();
        this.stringState = this.state.getStateName();
      }
  }

  startRepair(): void {
    const result = this.state.startRepair();
    console.log(result);

    if (result.includes("ремонт")) {
      this.state = new InRepairState();
      this.stringState = this.state.getStateName();
    }
  }
}
  
const john = new Driver("John", "Doe", 15, 10);
const jack = new Driver("Jack", "Rose", 55, 30);
const jane = new Driver("Jane", "McClien", 45, 15);

const renault = new Truck(1, "Renault Magnum", john);
const volvo = new Truck(2, "Volvo FH12", jack);
const daf = new Truck(3, "DAF XF", jane);

const trucks: Truck[] = [renault, volvo, daf];


function showTrucksTable(trucks: Truck[]): void {
  const data = [["№", "Грузовик", "Водитель", "Состояние"]];

  trucks.forEach(truck => {
    const driverName = `${truck.driver.name} ${truck.driver.surname}`;
    data.push([
      truck.id.toString(),
      truck.name,
      driverName,
      truck.stringState
    ]);
  });

  console.log(table(data));
}

function showTruckInfoById(trucks: Truck[]): void {
    let foundTruck: Truck | undefined;
  
    do {
     console.log("Введите номер (ID) грузовика: \n");
      const id = readline.questionInt("");
      foundTruck = trucks.find(truck => truck.id === id);
  
      if (!foundTruck) {
        console.log("Ошибка: Грузовик с таким номером не найден. Попробуйте еще раз.");
      }
    } while (!foundTruck);
  
    console.clear();
    console.log(`Марка: ${foundTruck.name}`);
    console.log(`Водитель: ${foundTruck.driver.name}`);
    console.log(`Состояние: ${foundTruck.stringState}`);
  }


  function updateTruckState(trucks: Truck[]): void {
    console.log("\nВведите номер грузовика и новое состояние (run, repair, base) через пробел (например: 1 run)");
    const input = readline.question("").trim();
    const [idString, newState] = input.split(" ");
  
    const id = Number(idString);
    const truck = trucks.find(t => t.id === id);
  
    if (!truck) {
      console.log("Ошибка: Грузовик с таким номером не найден.");
      return;
    }
  
    switch (newState) {
      case "run":
        truck.startRun();
        break;
      case "repair":
        truck.startRepair();
        break;
      case "base":
        truck.state = new InBaseState();
        truck.stringState = truck.state.getStateName();
        console.log(`Грузовик ${truck.name} возвращён на базу.`);
        break;
      default:
        console.log("Ошибка: Неверное состояние. Введите base, run или repair.");
    }
  }
  
  function startMenu(trucks: Truck[]): void {
    while (true) {
      console.clear();
      console.log("Меню:");
      console.log("1. Отобразить текущее состояние грузовиков");
      console.log("2. Показать данные грузовика по id");
      console.log("3. Обновить состояние грузовика");
      console.log("0. Выход");
  
      console.log("\n Выберите действие:");
      const choice = readline.questionInt("");
  
      switch (choice) {
        case 1:
          console.clear();
          showTrucksTable(trucks);
          console.log("\n Нажмите Enter для возврата в меню...");
          readline.question("");
          break;
        case 2:
          console.clear();
          showTruckInfoById(trucks);
          console.log("\n Нажмите Enter для возврата в меню...");
          readline.question("");
          break;
        case 3:
          console.clear();
          updateTruckState(trucks);
          console.log("\n Нажмите Enter для возврата в меню...");
          readline.question("");
          break;
        case 0:
          console.log("Выход из программы...");
          return;
        default:
          console.log("Ошибка: Неверный выбор. Попробуйте снова.");
          readline.question("");
      }
    }
  }
  startMenu(trucks)