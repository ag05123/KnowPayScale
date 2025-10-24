from pydantic import BaseModel
from typing import Optional

class SalaryRequest(BaseModel):
    job_title: str
    company: str
    location: str

class SalaryResponse(BaseModel):
    low: Optional[int]
    high: Optional[int]
    currency: str = "INR"
    error: Optional[str] = None