from fastapi import FastAPI
from app.api.endpoints import salary
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="BKL Salary Insights API")

# You MUST configure CORS to allow your extension to call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "chrome-extension://indnemagdmlcbnbpfmmgokfiadjgfaon", # Your extension ID
        "https://www.linkedin.com"  # <-- ADD THIS LINE
    ], #<-- IMPORTANT
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(salary.router, prefix="/api/v1/salary", tags=["salary"])

@app.get("/")
def read_root():
    return {"message": "BKL API is running."}