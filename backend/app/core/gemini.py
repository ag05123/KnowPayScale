import google.generativeai as genai
import json
from app.core.config import GEMINI_API_KEY
from app.api.schemas import SalaryRequest, SalaryResponse

genai.configure(api_key="GEMINI_API_KEY")
model = genai.GenerativeModel('gemini-2.5-flash')

def get_salary_from_gemini(details: SalaryRequest) -> SalaryResponse:
    
    prompt = f"""
    You are a salary estimation assistant. Your goal is to provide a realistic 
    salary range for a job role in a specific location, based on public data 
    from AmbitionBox and Glassdoor.

    Analyze the following job details:
    Job Title: "{details.job_title}"
    Company: "{details.company}"
    Location: "{details.location}"

    Please provide the estimated annual salary range.
    
    Respond ONLY with a valid JSON object in the following format:
    {{"low": number, "high": number, "currency": "INR"}}

    If you cannot find a reliable range, respond with:
    {{"low": null, "high": null, "currency": "INR"}}
    """

    try:
        response = model.generate_content(prompt)
       
        json_str = response.text.strip().replace("```json", "").replace("```", "")
        
        data = json.loads(json_str)
        
        return SalaryResponse(
            low=data.get('low'),
            high=data.get('high'),
            currency=data.get('currency', 'INR')
        )

    except Exception as e:
        print(f"Gemini or JSON parse error: {e}")
        return SalaryResponse(error="Failed to parse salary data from AI.")
