from fastapi import APIRouter, HTTPException
from app.api.schemas import SalaryRequest, SalaryResponse
from app.core.gemini import get_salary_from_gemini

router = APIRouter()

@router.post("/", response_model=SalaryResponse)
async def get_salary_insights(request: SalaryRequest):
    if not request.job_title or not request.location:
        raise HTTPException(status_code=400, detail="Job title and location are required.")
    
    salary_data = get_salary_from_gemini(request)
    
    if salary_data.error:
        raise HTTPException(status_code=500, detail=salary_data.error)
        
    return salary_data