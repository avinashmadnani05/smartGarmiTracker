# backend/app.py

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from transformers import pipeline, Conversation
from colorama import Fore, Style, init

# Initialize colorama (this will auto-reset colors after each print)
init(autoreset=True)

app = FastAPI()

# Set up CORS to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up the conversational pipeline using Hugging Face's DialoGPT
conversational_pipeline = pipeline("conversational", model="microsoft/DialoGPT-medium")

# Dictionary to hold conversation objects per WebSocket connection
conversations = {}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    # Create a new conversation instance (using Conversation from transformers)
    conv = Conversation("")
    conversations[websocket] = conv
    print(Fore.YELLOW + "Client connected. Conversation started.")
    
    try:
        while True:
            # Receive text message from the client
            data = await websocket.receive_text()
            print(Fore.CYAN + "User: " + Style.BRIGHT + data)
            
            # Update the conversation with the new user input
            conversations[websocket].add_user_input(data)
            
            # Process the conversation through the conversational pipeline.
            conversations[websocket] = conversational_pipeline(conversations[websocket])
            
            # Get the latest generated response from the conversation object.
            response = conversations[websocket].generated_responses[-1]
            # Print the bot response in blue (you can change to any color you prefer)
            print(Fore.BLUE + "Bot: " + Style.BRIGHT + response)
            
            # Simulate processing delay if needed
            await asyncio.sleep(0.3)
            
            # Send the AI-generated response back to the client
            await websocket.send_text(response)
    except WebSocketDisconnect:
        print(Fore.RED + "Client disconnected.")
        conversations.pop(websocket, None)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
