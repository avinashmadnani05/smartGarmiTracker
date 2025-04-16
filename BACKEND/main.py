
# import os
# import requests
# import string
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from fine_tuning import FINE_TUNING_MAP

# app = FastAPI()
# origins = ["http://localhost:3000", "http://localhost:5173"]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# class QuestionRequest(BaseModel):
#     question: str
# class LLMResponse(BaseModel):
#     response: str
# apikey = "AIzaSyAu_PNVM03Pu1o380ZI_TKU61FSDeDV1Ks"
# llm_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apikey}"
# @app.post("/ask", response_model=LLMResponse)
# def ask_question(request: QuestionRequest):
#     q = request.question.strip()
#     if not q:
#         raise HTTPException(status_code=400, detail="Question cannot be empty")
#     lower_q = q.lower()
#     norm_q = lower_q.translate(str.maketrans("", "", string.punctuation)).strip()
#     for key, value in FINE_TUNING_MAP.items():
#         if key in norm_q:
#             return {"response": value}
#     payload = {"contents": [{"parts": [{"text": q}]}]}
#     try:
#         llm_api_response = requests.post(llm_url, json=payload)
#         llm_api_response.raise_for_status()
#     except requests.RequestException as error:
#         raise HTTPException(status_code=500, detail="Error calling LLM API") from error
#     data = llm_api_response.json()
#     if data and "candidates" in data and len(data["candidates"]) > 0:
#         generated_text = data["candidates"][0].get("content", {}).get("parts", [{}])[0].get("text", "No response found")
#     else:
#         generated_text = "No response from LLM API"
#     return {"response": generated_text}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info", reload=True)
# main.py

from fastapi import FastAPI
from pydantic import BaseModel
from train_model import predict_uhi
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)
class UHIInput(BaseModel):
    avg_temp: float
    vegetation_index: float
    pollution_level: float

@app.post("/predict")
def get_prediction(data: UHIInput):
    """
    Endpoint to get UHI severity prediction.
    """
    prediction = predict_uhi(
        data.avg_temp,
        data.vegetation_index,
        data.pollution_level
    )
    return {"uhi_severity": prediction}

import uvicorn
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info", reload=True)
