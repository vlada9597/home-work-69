// home-work-69.js
// Скрипт для виконання домашнього завдання з Mongo Shell
// Виконує завдання з документами, агрегацією та індексами

// --- Завдання 1: Основні операції з документами ---

// Підключення до бази studentDB
db = db.getSiblingDB("studentDB");

// Якщо колекція assignments вже існує — видаляємо її для чистого старту
db.assignments.drop();

// Створення колекції assignments
db.createCollection("assignments");

// Додавання 5 документів
db.assignments.insertMany([
  { name: "Alice", subject: "Math", score: 92 },
  { name: "Bob", subject: "Physics", score: 78 },
  { name: "Charlie", subject: "Chemistry", score: 85 },
  { name: "David", subject: "Biology", score: 68 },
  { name: "Eva", subject: "History", score: 81 }
]);

// Пошук студентів з балом > 80
db.assignments.find({ score: { $gt: 80 } });

// Оновлення одного документа: збільшення балу на 5 для студента з балом < 85
db.assignments.updateOne(
  { score: { $lt: 85 } },
  { $inc: { score: 5 } }
);

// Видалення студента з найнижчим балом
let minScoreDoc = db.assignments.findOne({}, { sort: { score: 1 } });
if (minScoreDoc) {
  db.assignments.deleteOne({ _id: minScoreDoc._id });
}

// Виведення тільки імен та балів студентів
db.assignments.find({}, { _id: 0, name: 1, score: 1 });

// --- Завдання 2: Агрегаційні операції ---

// Групування за предметом та обчислення середнього балу
// Виведення тільки предметів, де середній бал > 75
db.assignments.aggregate([
  { $group: { _id: "$subject", avgScore: { $avg: "$score" } } },
  { $match: { avgScore: { $gt: 75 } } }
]);

// --- Завдання 3: Робота з індексами ---

// Створення унікального індексу для поля name
db.assignments.createIndex({ name: 1 }, { unique: true });

// Пошук студентів, імена яких починаються на 'A', з використанням індексу
db.assignments.find({ name: /^A/ }).explain("executionStats");
