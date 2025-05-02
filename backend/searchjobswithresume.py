

# from flask import Flask, request, jsonify
# import os
# import uuid
# import json
# from tempfile import NamedTemporaryFile
# from presidio_analyzer import AnalyzerEngine
# from presidio_anonymizer import AnonymizerEngine
# import google.generativeai as genai
# import requests
# from mistralai import Mistral
# from tempfile import NamedTemporaryFile
# from flask_cors import CORS  # Import CORS


# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Environment variables (replace with your actual keys in production)

# # MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY")
# GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
# SCRAPINGDOG_API_KEY = os.environ.get("SCRAPINGDOG_API_KEY")
# api_key = os.environ.get("MISTRAL_API_KEY")
# mistral_client = Mistral(api_key=api_key)

# # mistral_client = MistralClient(api_key=MISTRAL_API_KEY)
# # Initialize Gemini
# genai.configure(api_key=GEMINI_API_KEY)
# gemini_model = genai.GenerativeModel('gemini-2.0-flash')

# def redact_pii(text):
#     """Apply PII masking to the text to protect sensitive information."""
#     analyzer = AnalyzerEngine()
#     anonymizer = AnonymizerEngine()
    
#     # Analyze the text for PII
#     analyzer_results = analyzer.analyze(text=text, language="en")
    
#     # Entities we want to mask
#     sensitive_entities = ["NAME", "EMAIL_ADDRESS", "PHONE_NUMBER", "CREDIT_CARD", "US_SSN", 
#                           "US_BANK_NUMBER", "US_DRIVER_LICENSE", "US_PASSPORT"]
    
#     # Filter only sensitive entities
#     filtered_results = [result for result in analyzer_results 
#                         if result.entity_type in sensitive_entities]
    
#     # Anonymize the text
#     anonymized_result = anonymizer.anonymize(
#         text=text,
#         analyzer_results=filtered_results
#     )
    
#     return anonymized_result.text

# def get_job_suggestions_from_gemini(resume_text):
#     """Get job position suggestions from Gemini based on the resume content."""
#     prompt = f"""
#     Based on the following resume text, suggest 5 job positions that would be a good match for this person's skills and experience.
#     For each position, provide:
#     1. The job title
#     2. A brief explanation (1-2 sentences) why this job matches their skills
    
#     Resume text:
#     {resume_text}
    
#     Format your response as a JSON array of objects, where each object has 'title' and 'reason' properties.
#     """
    
#     try:
#         response = gemini_model.generate_content(prompt)
        
#         # Process the response text to extract valid JSON
#         response_text = response.text
#         # Find JSON content between ```json and ``` if it exists
#         if "```json" in response_text and "```" in response_text.split("```json")[1]:
#             json_content = response_text.split("```json")[1].split("```")[0].strip()
#         else:
#             # Try to find any JSON array in the text
#             import re
#             match = re.search(r'\[\s*{.*}\s*\]', response_text, re.DOTALL)
#             if match:
#                 json_content = match.group(0)
#             else:
#                 json_content = response_text
        
#         try:
#             suggestions = json.loads(json_content)
#             return suggestions
#         except json.JSONDecodeError:
#             # If we can't parse JSON, create a structured response from the text
#             return [{"title": "General position based on resume", 
#                     "reason": "Could not automatically determine positions. Please review the resume manually."}]
    
#     except Exception as e:
#         print(f"Error getting suggestions from Gemini: {e}")
#         return [{"title": "Error processing resume", 
#                 "reason": "An error occurred while analyzing the resume content."}]

# # def search_linkedin_jobs(job_title, geo_id='', sort_by='', job_type='', exp_level='', work_type='', filter_by_company=''):
# #     """Search for LinkedIn jobs based on a specific job title and optional parameters."""
# #     url = "https://api.scrapingdog.com/linkedinjobs"
# #     params = {
# #         "api_key": SCRAPINGDOG_API_KEY,
# #         "field": job_title,  # Job title (required)
# #         "geoid": geo_id,  # Geo location (optional)
# #         "page": 1,  # Page number (default 1)
# #         "sortBy": sort_by,  # Sort by (optional)
# #         "jobType": job_type,  # Job type (optional)
# #         "expLevel": exp_level,  # Experience level (optional)
# #         "workType": work_type,  # Work type (optional)
# #         "filterByCompany": filter_by_company  # Filter by company (optional)
# #     }

# #     try:
# #         response = requests.get(url, params=params)
# #         if response.status_code == 200:
# #             return response.json()
# #         else:
# #             return {"error": f"LinkedIn scraping failed with status code: {response.status_code}"}
# #     except Exception as e:
# #         return {"error": f"Exception occurred: {str(e)}"}
 

# @app.route('/api/process-resume', methods=['POST'])
# def process_resume():
#     if 'resume' not in request.files:
#         return jsonify({"error": "No resume file provided"}), 400

#     resume_file = request.files['resume']

#     if resume_file.filename == '':
#         return jsonify({"error": "No resume file selected"}), 400

#     try:
#         # Save the uploaded resume temporarily
#         with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
#             resume_file.save(temp_file.name)
#             temp_filename = temp_file.name

#         # Upload file to Mistral for OCR
#         with open(temp_filename, "rb") as f:
#             uploaded_pdf = mistral_client.files.upload(
#                 file={
#                     "file_name": resume_file.filename,
#                     "content": f,
#                 },
#                 purpose="ocr"
#             )

#         # Get signed URL
#         signed_url = mistral_client.files.get_signed_url(file_id=uploaded_pdf.id)

#         # Process with OCR
#         ocr_response = mistral_client.ocr.process(
#             model="mistral-ocr-latest",
#             document={
#                 "type": "document_url",
#                 "document_url": signed_url.url,
#             }
#         )
#         print(ocr_response)
#         # Access the 'text' attribute of the OCR response instead of subscripting
#                 # Inspecting the first page's markdown text
#         if ocr_response.pages and len(ocr_response.pages) > 0:
#             resume_text = ocr_response.pages[0].markdown
#         else:
#             return jsonify({"error": "OCR response does not contain any text"}), 500
#   # Assuming 'text' is an attribute

#         # Apply PII masking
#         masked_text = redact_pii(resume_text)

#         # Get job suggestions
#         job_suggestions = get_job_suggestions_from_gemini(masked_text)

#         # Get LinkedIn job results for the first suggestion
#         linkedin_jobs = []
#         if job_suggestions:
#             first_title = job_suggestions[0]["title"]
#             linkedin_jobs = search_linkedin_jobs(first_title)

#         # Return the results
#         return jsonify({
#             "ocr_text": resume_text,
#             "masked_text": masked_text,
#             "job_suggestions": job_suggestions,
#             "linkedin_jobs": linkedin_jobs
#         })

#     except Exception as e:
#         return jsonify({"error": f"Error processing resume: {str(e)}"}), 500
    




# @app.route('/api/search-linkedin-jobs', methods=['POST', 'GET'])
# def api_search_linkedin_jobs():
#     try:
#         # Handle both GET and POST requests
#         if request.method == 'POST':
#             data = request.get_json()
#             if not data or 'jobTitle' not in data:
#                 return jsonify({"error": "No job title provided"}), 400
            
#             job_title = data['jobTitle']
#             geo_id = data.get('geoId', '')
#             sort_by = data.get('sortBy', '')
#             job_type = data.get('jobType', '')
#             exp_level = data.get('expLevel', '')
#             work_type = data.get('workType', '')
#             filter_by_company = data.get('filterByCompany', '')
#         else:  # GET request
#             job_title = request.args.get('jobTitle')
#             if not job_title:
#                 return jsonify({"error": "No job title provided"}), 400
                
#             geo_id = request.args.get('geoId', '')
#             sort_by = request.args.get('sortBy', '')
#             job_type = request.args.get('jobType', '')
#             exp_level = request.args.get('expLevel', '')
#             work_type = request.args.get('workType', '')
#             filter_by_company = request.args.get('filterByCompany', '')
        
#         # Search for jobs using the search function
#         jobs = search_linkedin_jobs(
#             job_title, 
#             geo_id, 
#             sort_by, 
#             job_type, 
#             exp_level, 
#             work_type, 
#             filter_by_company
#         )
        
#         return jsonify(jobs)

#     except Exception as e:
#         print(f"Error in API route: {str(e)}")
#         return jsonify({"error": f"Server error processing job search: {str(e)}"}), 500
# @app.route('/api/test', methods=['GET'])
# def test_api():
#     return jsonify({"status": "success", "message": "API is working!"})

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
import os
import uuid
import json
from tempfile import NamedTemporaryFile
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
import google.generativeai as genai
import requests
from mistralai import Mistral
from flask_cors import CORS  # Import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Environment variables (replace with your actual keys in production)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
SCRAPINGDOG_API_KEY = os.environ.get("SCRAPINGDOG_API_KEY")
api_key = os.environ.get("MISTRAL_API_KEY")
mistral_client = Mistral(api_key=api_key)

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.0-flash')

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
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    resume_file = request.files['resume']

    if resume_file.filename == '':
        return jsonify({"error": "No resume file selected"}), 400

    try:
        # Save the uploaded resume temporarily
        with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            resume_file.save(temp_file.name)
            temp_filename = temp_file.name

        # Upload file to Mistral for OCR
        with open(temp_filename, "rb") as f:
            uploaded_pdf = mistral_client.files.upload(
                file={
                    "file_name": resume_file.filename,
                    "content": f,
                },
                purpose="ocr"
            )

        # Get signed URL
        signed_url = mistral_client.files.get_signed_url(file_id=uploaded_pdf.id)

        # Process with OCR
        ocr_response = mistral_client.ocr.process(
            model="mistral-ocr-latest",
            document={
                "type": "document_url",
                "document_url": signed_url.url,
            }
        )
        print(ocr_response)
        
        # Access the 'text' attribute of the OCR response
        if ocr_response.pages and len(ocr_response.pages) > 0:
            resume_text = ocr_response.pages[0].markdown
        else:
            return jsonify({"error": "OCR response does not contain any text"}), 500

        # Apply PII masking
        masked_text = redact_pii(resume_text)

        # Get job suggestions
        job_suggestions = get_job_suggestions_from_gemini(masked_text)

        # Get LinkedIn job results for the first suggestion
        linkedin_jobs = []
        if job_suggestions:
            first_title = job_suggestions[0]["title"]
            linkedin_jobs = search_linkedin_jobs(first_title)

        # Return the results
        return jsonify({
            "ocr_text": resume_text,
            "masked_text": masked_text,
            "job_suggestions": job_suggestions,
            "linkedin_jobs": linkedin_jobs
        })

    except Exception as e:
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
    app.run(debug=False,host='0.0.0.0',port=5001)