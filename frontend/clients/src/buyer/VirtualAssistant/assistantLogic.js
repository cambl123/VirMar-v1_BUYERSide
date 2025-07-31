// src/buyer/components/VirtualAssistant/assistantLogic.js

export function getAssistantReply(userInput) {
  const input = userInput.toLowerCase();

  if (input.includes("track")) {
    return "You can track your order in the 'Orders' section.";
  }
  if (input.includes("cart")) {
    return "Click the cart icon to view items you've added.";
  }
  if (input.includes("suggest") || input.includes("best")) {
    return "Sure! I recommend checking out the trending products section.";
  }
  if (input.includes("hello") || input.includes("hi")) {
    return "Hello! 👋 I'm your shopping assistant. How can I help?";
  }

  return "Sorry, I didn’t quite get that. Try asking about 'tracking', 'suggestions', or 'cart'.";
}
