const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
// Connect to the MongoDB database
mongoose
  .connect(
    // "mongodb://localhost:27017/Plugin-Test"   //LOCALHOST
    "mongodb+srv://deodeepjuegostudio:qeLlbGcA8nXWOJx2@cluster0.il4zd2p.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to the MongoDB database");

    // Define the schema for the chat messages
    const chatSchema = new mongoose.Schema({
      access_token: { type: String, required: true },
      user_id: { type: String, required: true },
      chat_id: { type: String, required: true },
      message: { type: String, required: true },
      attachment_key: { type: String, required: true },
      attachment_type: { type: String, required: true },
    });

    // Create a model for the chat messages using the schema
    const ChatMessage = mongoose.model("ChatMessage", chatSchema);

    // Define the endpoint for the chat API
    app.post("/chat", async (req, res) => {
      console.warn(req.params);
      // Get the access token, user ID, chat ID, attachment key, and attachment type from the request body
      const {
        access_token,
        user_id,
        chat_id,
        message,
        attachment_key,
        attachment_type,
      } = req.query;

      // Validate the access token
      if (!access_token) {
        return res.status(401).json({ error: "Access token is missing" });
      }

      // Create a new chat message document using the model
      const chatMessage = new ChatMessage({
        user_id,
        access_token,
        chat_id,
        message,
        attachment_key,
        attachment_type,
      });

      try {
        // Save the chat message document to the database
        const addChat = await chatMessage.save();
        console.warn(addChat);
        // Return a success response
        res.json({
          responseCode: 200,
          responseMessage: "Success",
          responseData: {
            lastInsertedId: addChat._id,
          },
        });
      } catch (err) {
        // Return an error response
        res.status(500).json({ error: "Error saving chat message" });
      }
    });

    // Start the server
    app.listen(3001, () => {
      console.log("Chat API server started");
    });
  })
  .catch((err) => console.error(err));
