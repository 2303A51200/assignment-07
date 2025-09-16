// Observer Pattern
class DeliveryAgent {
  constructor(name) {
    this.name = name;
  }

  update(order) {
    const msg = `${this.name} notified: New order #${order.id} - ${order.items.join(", ")}`;
    displayNotification(msg);
  }
}

class Restaurant {
  constructor() {
    this.agents = [];
  }

  attach(agent) {
    this.agents.push(agent);
  }

  notify(order) {
    this.agents.forEach(agent => agent.update(order));
  }
}

// Strategy Pattern
class DeliveryStrategy {
  calculateFee(distance) {
    return 0;
  }
}

class StandardDelivery extends DeliveryStrategy {
  calculateFee(distance) {
    return distance * 5;
  }
}

class ExpressDelivery extends DeliveryStrategy {
  calculateFee(distance) {
    return distance * 10;
  }
}

class FreeDelivery extends DeliveryStrategy {
  calculateFee(distance) {
    return 0;
  }
}

class DeliveryService {
  constructor(strategy) {
    this.strategy = strategy;
  }

  getFee(distance) {
    return this.strategy.calculateFee(distance);
  }
}

// Command Pattern
class OrderService {
  placeOrder(order) {
    displayNotification(`Order #${order.id} placed.`);
  }

  cancelOrder(order) {
    displayNotification(`Order #${order.id} canceled.`);
  }
}

class Command {
  execute() {}
  undo() {}
}

class PlaceOrderCommand extends Command {
  constructor(service, order) {
    super();
    this.service = service;
    this.order = order;
  }

  execute() {
    this.service.placeOrder(this.order);
  }

  undo() {
    this.service.cancelOrder(this.order);
  }
}

class CancelOrderCommand extends Command {
  constructor(service, order) {
    super();
    this.service = service;
    this.order = order;
  }

  execute() {
    this.service.cancelOrder(this.order);
  }
}

// UI Logic
let orderId = 1;
const restaurant = new Restaurant();
const agent1 = new DeliveryAgent("Agent A");
const agent2 = new DeliveryAgent("Agent B");
restaurant.attach(agent1);
restaurant.attach(agent2);

const orderService = new OrderService();

document.getElementById("placeOrderBtn").addEventListener("click", () => {
  const items = document.getElementById("orderItems").value.split(",").map(i => i.trim());
  const deliveryType = document.getElementById("deliveryType").value;
  const order = { id: orderId++, items };

  // Observer
  restaurant.notify(order);

  // Strategy
  const distance = 5; // fixed for demo
  let strategy;
  if (deliveryType === "standard") strategy = new StandardDelivery();
  else if (deliveryType === "express") strategy = new ExpressDelivery();
  else strategy = new FreeDelivery();

  const deliveryService = new DeliveryService(strategy);
  const fee = deliveryService.getFee(distance);
  document.getElementById("feeDisplay").innerText = `Delivery Fee: ₹${fee}`;

  // Command
  const placeCommand = new PlaceOrderCommand(orderService, order);
  placeCommand.execute();
});

document.getElementById("cancelOrderBtn").addEventListener("click", () => {
  const lastOrderId = orderId - 1;
  if (lastOrderId < 1) return;
  const order = { id: lastOrderId, items: [] };
  const cancelCommand = new CancelOrderCommand(orderService, order);
  cancelCommand.execute();
});

function displayNotification(message) {
  const container = document.getElementById("notifications");
  const msg = document.createElement("div");
  msg.innerText = message;
  container.appendChild(msg);
}
