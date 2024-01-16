import { Router } from "express";
import { ObjectId } from "mongodb";
import { db } from "../utils/db.js";

const questionRouter = Router();

questionRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const limit = Number(req.query.limit) ?? 10;
    const keywords = req.query.keywords; // Query Parameter ค้นหาข้อมูลจากหัวข้อ
    const category = req.query.category; // Query Parameter ค้นหาข้อมูลจาก category

    const query = {};

    if (category) {
      query.category = new RegExp(category, "i");
    }
    if (keywords) {
      query.question = new RegExp(keywords, "i"); // คำสั่งที่ทำให้ค้นหาได้โดยที่ไม่สนใจว่าเป็นตัวอักษรพิมพ์ใหญ่หรือเล็ก
    }
    const questions = await collection.find(query).limit(limit).toArray();
    return res.json({ data: questions });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

questionRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionId = new ObjectId(req.params.id);
    const getQuestionById = await collection.findOne({ _id: questionId });
    return res.json({ data: getQuestionById });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

questionRouter.post("/", async (req, res) => {
  try {
    const questionData = { ...req.body };
    const collection = db.collection("questions");
    await collection.insertOne(questionData);
    return res.json({ message: `Question has been created successfully` });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

questionRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionId = new ObjectId(req.params.id);
    const updateQuestionData = { ...req.body };
    await collection.updateOne(
      { _id: questionId },
      { $set: updateQuestionData }
    );
    return res.json({ message: `Question has been updated successfully` });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

questionRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionId = new ObjectId(req.params.id);
    await collection.deleteOne({ _id: questionId });
    return res.json({ message: `Question has been deleted successfully` });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

export default questionRouter;
