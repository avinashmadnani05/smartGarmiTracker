import os
import requests
import string
import re  # For parsing the query pattern
import json
import ipfshttpclient  # Ensure this package is installed: pip install ipfshttpclient
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from train_model import predict_uhi

# --- Load Fine-Tuning Map from IPFS ---
def load_fine_tuning_map_from_ipfs(cid: str) -> dict:
    """
    Attempt to load the fine tuning map from IPFS using the provided CID.
    If unsuccessful, fall back to the local fine_tuning.py file.
    """
    try:
        # Connect to the local IPFS daemon (ensure it's running)
        client = ipfshttpclient.connect()  # Defaults to /ip4/127.0.0.1/tcp/5001/http
        file_bytes = client.cat(cid)
        fine_tuning_map = json.loads(file_bytes.decode("utf-8"))
        print("Loaded fine tuning map from IPFS.")
        return fine_tuning_map
    except Exception as e:
        print("Error loading fine tuning map from IPFS:", e)
        # Fallback: load from local file.
        from fine_tuning import FINE_TUNING_MAP as local_fine_tuning_map
        return local_fine_tuning_map

# Replace with your actual IPFS CID for the fine tuning JSON.
FT_CID = "QmYourCIDHere"
FINE_TUNING_MAP = load_fine_tuning_map_from_ipfs(FT_CID)
# --- End of IPFS Section ---

app = FastAPI()
origins = ["http://localhost:3000", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

class LLMResponse(BaseModel):
    response: str

apikey = "AIzaSyAu_PNVM03Pu1o380ZI_TKU61FSDeDV1Ks"
llm_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apikey}"

@app.post("/ask", response_model=LLMResponse)
def ask_question(request: QuestionRequest):
    q = request.question.strip()
    if not q:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    lower_q = q.lower()
    norm_q = lower_q.translate(str.maketrans("", "", string.punctuation)).strip()
    
    # First, check for direct fine-tuning keys (non-heat)
    for key, value in FINE_TUNING_MAP.items():
        # Exclude the 'heat' key from this general check
        if key != "heat" and key in norm_q:
            return {"response": value}
    
    # Next, check if query is in the "City, UHI" format
    # Example query: "Mumbai, 3" or "pune,2"
    heat_pattern = re.compile(r"^([a-zA-Z\s]+),\s*([0-5])$")
    match = heat_pattern.match(q)
    if match:
        city = match.group(1).strip().title()
        try:
            uhi_level = int(match.group(2))
        except ValueError:
            return {"response": "Invalid UHI value. Please provide an integer between 0 and 5."}
        
        heat_data = FINE_TUNING_MAP.get("heat", {})
        if city in heat_data and uhi_level in heat_data[city]:
            return {"response": heat_data[city][uhi_level]}
        else:
            return {"response": f"No fine-tuned heat data available for {city} with UHI level {uhi_level}."}
    
    # Fallback: Call external LLM API if no fine-tuning pattern is matched.
    payload = {"contents": [{"parts": [{"text": q}]}]}
    try:
        llm_api_response = requests.post(llm_url, json=payload)
        llm_api_response.raise_for_status()
    except requests.RequestException as error:
        raise HTTPException(status_code=500, detail="Error calling LLM API") from error
    
    data = llm_api_response.json()
    if data and "candidates" in data and len(data["candidates"]) > 0:
        generated_text = data["candidates"][0].get("content", {}).get("parts", [{}])[0].get("text", "No response found")
    else:
        generated_text = "No response from LLM API"
    return {"response": generated_text}

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info", reload=True)
