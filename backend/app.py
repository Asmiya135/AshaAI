from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime  # Enable CORS for all routes
import uuid
import json
from tempfile import NamedTemporaryFile
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
import google.generativeai as genai
import requests
from mistralai import Mistral
from flask_cors import CORS  # Import CORS
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# LinkedIn API configuration
API_KEY = os.getenv('API_KEY')#API key from environment variable
  # In production, store this in environment variables
LINKEDIN_API_URL = "https://api.scrapingdog.com/linkedinjobs"

# Mapping of frontend filter values to LinkedIn API parameters
JOB_TYPE_MAPPING = {
    "fullTime": "F",
    "partTime": "P",
    "contract": "C",
    "internship": "I",
    "": None
}

WORK_LOCATION_MAPPING = {
    "remote": "R",
    "onsite": "O",
    "hybrid": "H",
    "": None
}

EXPERIENCE_MAPPING = {
    # Map experience years to LinkedIn experience levels
    # 0-2: Entry level, 3-5: Associate, 6-10: Mid-Senior, 10+: Director
    "0-2": "1",
    "3-5": "2",
    "6-10": "3",
    "10+": "4",
    "": None
}

LOCATION_MAPPING = {
    # Common locations with their LinkedIn geoIds
    "new york": "103644278",
    "san francisco": "102277331",
    "chicago": "102183082", 
    "seattle": "103679156",
    "boston": "101835590",
    "austin": "100025064",
    "india" : "102713980",
    "bangalore": "102105699",
    "mumbai": "102083659",
    "hyderabad": "102089132",
    "chennai": "102093119",
    "delhi": "102090883",
    "pune": "102179709",
    "kolkata": "102200003",
    "ahmedabad": "102096753",
    "gurgaon": "102115891",
    "noida": "102180291",
    "jaipur": "102103260",
    "chandigarh": "102115878",
    "kochi": "102100620",
    "nagpur": "102113739",
    "indore": "102111733",
    "bhopal": "102108184",
    "lucknow": "102113183",
    "bhubaneswar": "102106297",
    "surat": "102116134",
    "vadodara": "102116323",
    "thiruvananthapuram": "102119642",
    "patna": "102112594",
    "guwahati": "102110667",
    "remote": "103644278",
        # Default to US-wide for remote
    "": None
}
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "API is working!"}),200

@app.route('/api/search-jobs', methods=['POST'])
def search_jobs():
    try:
        # Get search filters from request
        filters = request.json
        
        # Extract filter values
        position = filters.get('position', '')
        company = filters.get('company', '')
        location = filters.get('location', '').lower() if filters.get('location') else ''
        experience_range = filters.get('experience', [0, 10])
        work_location_type = filters.get('workLocationType', '')
        job_type = filters.get('jobType', '')
        
        # Map experience range to LinkedIn experience level
        exp_level = None
        if experience_range:
            min_exp, max_exp = experience_range
            if max_exp <= 2:
                exp_level = "1"  # Entry level
            elif max_exp <= 5:
                exp_level = "2"  # Associate
            elif max_exp <= 10:
                exp_level = "3"  # Mid-Senior level
            else:
                exp_level = "4"  # Director and above
        
        # Convert location to geoId
        geo_id = None
        for key, value in LOCATION_MAPPING.items():
            if key in location:
                geo_id = value
                break
        
        # Configure LinkedIn API parameters
        params = {
            "api_key": API_KEY,
            "field": position,  # Job position/title
            "geoid": geo_id,  # Location ID
            "page": 1,  # First page of results
            "sortBy": "R",  # Sort by relevance
            "jobType": JOB_TYPE_MAPPING.get(job_type),  # Job type
            "expLevel": exp_level,  # Experience level
            "workType": WORK_LOCATION_MAPPING.get(work_location_type),  # Remote/Onsite/Hybrid
            "filterByCompany": company if company else None  # Company filter
        }
        
        # Remove None values from parameters
        params = {k: v for k, v in params.items() if v is not None}
        
        # Call LinkedIn API
        response = requests.get(LINKEDIN_API_URL, params=params)
        
        if response.status_code == 200:
            linkedin_jobs = response.json()
            print(linkedin_jobs)

            # Transform LinkedIn jobs to match your frontend JobListing format
            transformed_jobs = transform_linkedin_jobs(linkedin_jobs, experience_range)
            
            return jsonify({"jobs": transformed_jobs})
        else:
            return jsonify({
                "error": f"LinkedIn API request failed: {response.status_code}",
                "message": response.text
            }), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# def transform_linkedin_jobs(linkedin_jobs, experience_range):
#     """Transform LinkedIn API jobs to match frontend JobListing format"""
#     transformed_jobs = []
    
#     for i, job in enumerate(linkedin_jobs):
#         # Extract relevant fields from LinkedIn job data
#         job_id = job.get('jobId', f'job-{i+1}')
#         title = job.get('title', '')
#         company = job.get('companyName', '')
#         location = job.get('location', '')
        
#         # Map job type and location type
#         job_type = "Full-time"  # Default
#         if 'jobType' in job:
#             if 'part' in job['jobType'].lower():
#                 job_type = "Part-time"
#             elif 'contract' in job['jobType'].lower():
#                 job_type = "Contract"
#             elif 'intern' in job['jobType'].lower():
#                 job_type = "Internship"
        
#         location_type = "On-site"  # Default
#         if 'workplaceType' in job:
#             if 'remote' in job['workplaceType'].lower():
#                 location_type = "Remote"
#             elif 'hybrid' in job['workplaceType'].lower():
#                 location_type = "Hybrid"
        
#         # Extract salary if available
#         salary = None
#         if 'compensation' in job and job['compensation']:
#             salary = job['compensation']
        
#         # Convert description if available
#         description = job.get('description', f"Exciting opportunity for a {title} role at {company}.")
        
#         # Use the LinkedIn post date or default to recent
#         posted_date = job.get('postDate', '')
        
#         # Create transformed job object
#         transformed_job = {
#             "id": job_id,
#             "title": title,
#             "company": company,
#             "location": location,
#             "jobType": job_type,
#             "locationType": location_type,
#             "salary": salary,
#             "description": description,
#             "requirements": f"{experience_range[0]}-{experience_range[1]} years of experience",
#             "postedDate": posted_date,
#             "applyUrl": job.get('applyUrl', "#")
#         }
        
#         transformed_jobs.append(transformed_job)
    
#     # If no jobs found from API, return empty list
#     if not transformed_jobs:
#         return []
        
#     return transformed_jobs

def transform_linkedin_jobs(linkedin_jobs, experience_range):
    transformed_jobs = []

    for i, job in enumerate(linkedin_jobs):
        job_id = job.get('job_id', f'job-{i+1}')
        title = job.get('job_position') or 'Unknown Role'
        company = job.get('company_name') or 'Unknown Company'
        location = job.get('job_location') or 'Unknown Location'

        job_type = "Full-time"
        location_type = "On-site"

        salary = None
        description = f"Exciting opportunity for a {title} role at {company}."

        # Handle posting date formatting
        raw_posted = job.get('job_posting_date')
        try:
            date_obj = datetime.strptime(raw_posted, "%Y-%m-%d")
            posted_date = date_obj.isoformat()
        except:
            posted_date = datetime.now().isoformat()

        apply_url = job.get('job_link', '#')

        transformed_job = {
            "id": job_id,
            "title": title,
            "company": company,
            "location": location,
            "jobType": job_type,
            "locationType": location_type,
            "salary": salary,
            "description": description,
            "requirements": f"{experience_range[0]}-{experience_range[1]} years of experience",
            "postedDate": posted_date,
            "applyUrl": apply_url
        }

        transformed_jobs.append(transformed_job)

    return transformed_jobs





# Environment variables (replace with your actual keys in production)
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
genai.configure(api_key=MISTRAL_API_KEY)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
print("GEMINI_API_KEY:", GEMINI_API_KEY)
SCRAPINGDOG_API_KEY = os.environ.get("SCRAPINGDOG_API_KEY")
mistral_client = Mistral(api_key=MISTRAL_API_KEY)

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.0-flash')
print("GEMINI_API_KEY:", GEMINI_API_KEY)

def redact_pii(text):
    """Apply PII masking to the text to protect sensitive information."""
    analyzer = AnalyzerEngine()
    anonymizer = AnonymizerEngine()
    
    # Analyze the text for PII
    analyzer_results = analyzer.analyze(text=text, language="en")
    
    # Entities we want to mask
    sensitive_entities = ["NAME","PERSON", "EMAIL_ADDRESS", "PHONE_NUMBER", "CREDIT_CARD", "US_SSN", 
                          "US_BANK_NUMBER", "US_DRIVER_LICENSE", "US_PASSPORT"]
    
    # Filter only sensitive entities
    filtered_results = [result for result in analyzer_results 
                        if result.entity_type in sensitive_entities]
    
    # Anonymize the text
    anonymized_result = anonymizer.anonymize(
        text=text,
        analyzer_results=filtered_results
    )
    
    return anonymized_result.text

def get_job_suggestions_from_gemini(resume_text):
    """Get job position suggestions from Gemini based on the resume content."""
    prompt = f"""
    Based on the following resume text, suggest 5 job positions that would be a good match for this person's skills and experience.
    For each position, provide:
    1. The job title
    2. A brief explanation (1-2 sentences) why this job matches their skills
    
    Resume text:
    {resume_text}
    
    Format your response as a JSON array of objects, where each object has 'title' and 'reason' properties.
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        
        # Process the response text to extract valid JSON
        response_text = response.text
        # Find JSON content between ```json and ``` if it exists
        if "```json" in response_text and "```" in response_text.split("```json")[1]:
            json_content = response_text.split("```json")[1].split("```")[0].strip()
        else:
            # Try to find any JSON array in the text
            import re
            match = re.search(r'\[\s*{.*}\s*\]', response_text, re.DOTALL)
            if match:
                json_content = match.group(0)
            else:
                json_content = response_text
        
        try:
            suggestions = json.loads(json_content)
            return suggestions
        except json.JSONDecodeError:
            # If we can't parse JSON, create a structured response from the text
            return [{"title": "General position based on resume", 
                    "reason": "Could not automatically determine positions. Please review the resume manually."}]
    
    except Exception as e:
        print(f"Error getting suggestions from Gemini: {e}")
        return [{"title": "Error processing resume", 
                "reason": "An error occurred while analyzing the resume content."}]

def search_linkedin_jobs(job_title, geo_id='', sort_by='', job_type='', exp_level='', work_type='', filter_by_company=''):
    """Search for LinkedIn jobs based on a specific job title and optional parameters."""
    # Use the general scraping endpoint
    url = "https://api.scrapingdog.com/scrape"
    
    # Format the job title for URL usage
    formatted_job_title = job_title.replace(' ', '%20')
    
    # Construct the LinkedIn search URL
    linkedin_url = f"https://www.linkedin.com/jobs/search/?keywords={formatted_job_title}"
    
    # Add optional parameters if provided
    if geo_id:
        linkedin_url += f"&location={geo_id}"
    if job_type:
        linkedin_url += f"&f_JT={job_type}"
    if exp_level:
        linkedin_url += f"&f_E={exp_level}"
    if work_type:
        linkedin_url += f"&f_WT={work_type}"
    if filter_by_company:
        linkedin_url += f"&f_C={filter_by_company}"
        
    # Set up parameters for ScrapingDog API
    params = {
        "api_key": SCRAPINGDOG_API_KEY,
        "url": linkedin_url,
        "dynamic": "true"  # Enable JavaScript rendering
    }

    try:
        print(f"Scraping URL: {linkedin_url}")
        print(f"Using ScrapingDog API: {url}")
        
        # Make the request to ScrapingDog
        response = requests.get(url, params=params)
        
        print(f"ScrapingDog Status Code: {response.status_code}")
        
        if response.status_code == 200:
            # For HTML responses, you'll need to parse the HTML to extract job listings
            # This is a simplified version - you may need to use BeautifulSoup for proper parsing
            return {
                "status": "success",
                "url_scraped": linkedin_url,
                "raw_html_length": len(response.text),
                "sample_content": response.text[:500]  # First 500 characters as sample
            }
        else:
            # Return error information with full details
            return {
                "error": f"LinkedIn scraping failed with status code: {response.status_code}",
                "url_used": linkedin_url,
                "response_text": response.text[:500] if hasattr(response, 'text') else "No response text"
            }
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}

@app.route('/api/process-resume', methods=['POST'])
def process_resume():
    print("Received request to /api/process-resume")
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    resume_file = request.files['resume']

    if resume_file.filename == '':
        return jsonify({"error": "No resume file selected"}), 400

    try:
        # Save the uploaded resume temporarily
        print("Saving resume temporarily...")
        with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            resume_file.save(temp_file.name)
            temp_filename = temp_file.name

        # Upload file to Mistral for OCR
        print("Uploading to Mistral OCR...")
        with open(temp_filename, "rb") as f:
            uploaded_pdf = mistral_client.files.upload(
                file={
                    "file_name": resume_file.filename,
                    "content": f,
                },
                purpose="ocr"
            )

        # Get signed URL
        print("Getting signed URL...")
        signed_url = mistral_client.files.get_signed_url(file_id=uploaded_pdf.id)

        # Process with OCR
        print("Sending to OCR model...")
        ocr_response = mistral_client.ocr.process(
            model="mistral-ocr-latest",
            document={
                "type": "document_url",
                "document_url": signed_url.url,
            }
        )
        print(ocr_response)
        
        # Access the 'text' attribute of the OCR response
        print("OCR response received.")
        if ocr_response.pages and len(ocr_response.pages) > 0:
            resume_text = ocr_response.pages[0].markdown
        else:
            return jsonify({"error": "OCR response does not contain any text"}), 500

        # Apply PII masking
        print("Masking PII...")
        masked_text = redact_pii(resume_text)

        # Get job suggestions
        print("Generating job suggestions...")
        job_suggestions = get_job_suggestions_from_gemini(masked_text)

        # Get LinkedIn job results for the first suggestion
        print("Searching LinkedIn jobs...")
        linkedin_jobs = []
        if job_suggestions:
            first_title = job_suggestions[0]["title"]
            linkedin_jobs = search_linkedin_jobs(first_title)

        # Return the results
        print("Returning results.")
        return jsonify({
            "ocr_text": resume_text,
            "masked_text": masked_text,
            "job_suggestions": job_suggestions,
            "linkedin_jobs": linkedin_jobs
        })

    except Exception as e:
        print(f"Exception: {str(e)}")
        return jsonify({"error": f"Error processing resume: {str(e)}"}), 500
    
@app.route('/api/search-linkedin-jobs', methods=['POST', 'GET'])
def api_search_linkedin_jobs():
    try:
        # Handle both GET and POST requests
        if request.method == 'POST':
            data = request.get_json()
            if not data or 'jobTitle' not in data:
                return jsonify({"error": "No job title provided"}), 400
            
            job_title = data['jobTitle']
            geo_id = data.get('geoId', '')
            sort_by = data.get('sortBy', '')
            job_type = data.get('jobType', '')
            exp_level = data.get('expLevel', '')
            work_type = data.get('workType', '')
            filter_by_company = data.get('filterByCompany', '')
        else:  # GET request
            job_title = request.args.get('jobTitle')
            if not job_title:
                return jsonify({"error": "No job title provided"}), 400
                
            geo_id = request.args.get('geoId', '')
            sort_by = request.args.get('sortBy', '')
            job_type = request.args.get('jobType', '')
            exp_level = request.args.get('expLevel', '')
            work_type = request.args.get('workType', '')
            filter_by_company = request.args.get('filterByCompany', '')
        
        # Search for jobs using the search function
        jobs = search_linkedin_jobs(
            job_title, 
            geo_id, 
            sort_by, 
            job_type, 
            exp_level, 
            work_type, 
            filter_by_company
        )
        
        return jsonify(jobs)

    except Exception as e:
        print(f"Error in API route: {str(e)}")
        return jsonify({"error": f"Server error processing job search: {str(e)}"}), 500

@app.route('/api/test', methods=['GET'])
def test_api():
    return jsonify({"status": "success", "message": "API is working!"})

@app.route('/api/test-scraping', methods=['GET'])
def test_scraping_api():
    """Test if the ScrapingDog API key is working."""
    url = "https://api.scrapingdog.com/scrape"
    params = {
        "api_key": SCRAPINGDOG_API_KEY,
        "url": "https://www.google.com"
    }
    
    try:
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            return jsonify({
                "status": "API key is working", 
                "code": response.status_code,
                "sample_data": response.text[:500]
            })
        else:
            return jsonify({
                "status": "API key issue", 
                "code": response.status_code, 
                "message": response.text
            })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })


if __name__ == '__main__':
    # Get port from environment variable or use 5000 as default
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
