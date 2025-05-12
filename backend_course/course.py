import os
import json
import re
import copy
from flask import Flask, request, jsonify
import google.generativeai as genai
import requests
from dotenv import load_dotenv
from flask_cors import CORS  # Add this import

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load API keys from environment variables ONLY
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

if not GEMINI_API_KEY:
    raise EnvironmentError("GEMINI_API_KEY not set in .env file or environment variables")

if not YOUTUBE_API_KEY:
    print("Warning: YOUTUBE_API_KEY not set in .env file or environment variables. YouTube video search will fail.")

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

VALID_LEVELS = ['beginner', 'intermediate', 'advanced']

@app.route('/generate-course', methods=['POST'])
def generate_course():
    data = request.get_json()
    title = data.get('title')
    level = data.get('level')
    goal = data.get('goal')
    current_state = data.get('currentState')

    # Validate input
    if not all([title, level, goal, current_state]):
        return jsonify({'error': 'Missing required fields: title, level, goal, and currentState are required'}), 400

    if level.lower() not in VALID_LEVELS:
        return jsonify({'error': 'Invalid course level. Must be beginner, intermediate, or advanced'}), 400

    try:
        course_structure = gen_course(title, level, goal, current_state)
        enhanced_course = add_youtube_videos(course_structure)
        return jsonify(enhanced_course), 200
    except Exception as e:
        print('Course generation error:', e)
        return jsonify({'error': 'Failed to generate course', 'message': str(e)}), 500

def gen_course(course_title, course_level, course_goal, user_current_state):
    prompt = f"""
Respond ONLY with a valid JSON object matching the structure below.
DO NOT include any explanations, markdown, or text outside the JSON.
If you cannot comply, return {{}}.

{{
  "courseTitle": "{course_title}",
  "courseLevel": "{course_level}",
  "courseGoal": "{course_goal}",
  "modules": [
    {{
      "moduleId": 1,
      "moduleTitle": "Module Title",
      "moduleDescription": "A concise description of what this module covers",
      "subsections": [
        {{
          "subsectionId": 1,
          "subsectionTitle": "Clear and specific subsection title",
          "content": "Detailed educational content in markdown format. Include examples, explanations, and practical applications. Minimum 300 words per subsection."
        }}
      ]
    }}
  ]
}}
IMPORTANT GUIDELINES:
1. Each subsection title should be specific and searchable (good for finding relevant YouTube videos)
2. Ensure logical progression of topics from basic to advanced within the course
3. Include practical exercises or challenges where appropriate
4. Maintain consistent depth across all subsections
5. DO NOT use markdown code blocks "```
6. Your response must be valid JSON only, with no additional text before or after.
"""

    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    llm_response = response.text.strip()
    # Remove code block markers if present
    # llm_response = llm_response.replace('```json', '').replace('```
    print("RAW LLM RESPONSE:\n", llm_response)  # Debugging

    # Try to parse as JSON, or extract JSON with regex if needed
    try:
        course_structure = json.loads(llm_response)
    except Exception:
        match = re.search(r'\{[\s\S]*\}', llm_response)
        if match:
            course_structure = json.loads(match.group(0))
        else:
            raise ValueError("Failed to extract JSON from LLM response")

    return course_structure

def add_youtube_videos(course_structure):
    enhanced_course = copy.deepcopy(course_structure)

    for module in enhanced_course.get('modules', []):
        for subsection in module.get('subsections', []):
            search_query = f"{enhanced_course['courseTitle']} {module['moduleTitle']} {subsection['subsectionTitle']}"
            keyword = get_proper_keyword(search_query, subsection['subsectionTitle'], module['moduleTitle'], enhanced_course['courseTitle'])
            print(f'Searching YouTube for: "{keyword}"')
            try:
                video_id = search_youtube_video(keyword, YOUTUBE_API_KEY)
                subsection['youtubeVideoId'] = video_id
            except Exception as e:
                print(f"Error finding YouTube video for '{keyword}':", e)
                subsection['youtubeVideoId'] = None
    return enhanced_course

def get_proper_keyword(search_query, subsection_title, module_title, course_title):
    prompt = f"""
Generate a short and effective keyword that can be searched for on YouTube for the following search query:
"{search_query}". In this query, give top priority to "{subsection_title}" followed by "{module_title}" and then "{course_title}".
The keyword should not be more than 4 words and should be a short phrase relevant to the topic.
"""
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        keyword = response.text.strip()
        return keyword
    except Exception as e:
        print("Error generating keyword:", e)
        return search_query

def search_youtube_video(query, api_key):
    url = 'https://www.googleapis.com/youtube/v3/search'
    params = {
        'part': 'snippet',
        'maxResults': 1,
        'q': query,
        'type': 'video',
        'key': api_key,
        'videoEmbeddable': 'true',
        'videoDuration': 'medium'
    }

    response = requests.get(url, params=params)
    data = response.json()

    if 'items' in data and len(data['items']) > 0:
        video_id = data['items'][0]['id']['videoId']
        video_url = f'https://www.youtube.com/watch?v={video_id}'
        return video_url
    else:
        raise ValueError('No videos found')
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)


