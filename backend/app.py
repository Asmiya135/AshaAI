from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from datetime import datetime
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# LinkedIn API configuration
API_KEY = "680479f50addec451d932417"  # In production, store this in environment variables
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

if __name__ == '__main__':
    # Get port from environment variable or use 5000 as default
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
