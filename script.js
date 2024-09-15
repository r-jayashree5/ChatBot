// Chatbot toggler, close button, and input elements
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

// API configuration
const API_KEY = "AIzaSyBYb7Kq0wLCf4Jp1zWhrv8rloeDLikZ0Qw"; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// Function to create chat message HTML
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" 
    ? '<p></p>' 
    : '<span class="material-symbols-outlined">smart_toy</span><p></p>';
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

// Function to generate and append chatbot response
const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector("p");

  // Define the properties and message for the API request
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      contents: [{ 
        role: "user", 
        parts: [{ text: userMessage }] 
      }] 
    }),
  };

  // Send POST request to API, get response, and set the response as paragraph text
  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    
    // Get the API response text and update the message element
    messageElement.textContent = data.candidates[0].content.parts[0].text.replace(/\\(.?)\\*/g, '$1');
  } catch (error) {
    // Handle error
    messageElement.classList.add("error");
    messageElement.textContent = "Error: " + error.message;
  } finally {
    chatbox.scrollTo(0, chatbox.scrollHeight); // Scroll to the latest message
  }
};

// Handle sending of the chat message
const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user-entered message and remove extra whitespace
  if (!userMessage) return; // Prevent sending empty messages

  // Clear the input textarea and set its height to default
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

// Auto-adjust the height of the input textarea based on its content
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Handle the Enter key press to send a message
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Prevent the default behavior of adding a new line
    handleChat(); // Trigger message sending
  }
});

// Handle chat button click to send message
sendChatBtn.addEventListener("click", handleChat);

// Close the chatbot window
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// Toggle chatbot visibility
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

// Initialize chatbot toggler after document load
document.addEventListener('DOMContentLoaded', () => {
  const chatbot = document.querySelector(".chatbot");
  // Any additional initialization can be done here if needed
});
