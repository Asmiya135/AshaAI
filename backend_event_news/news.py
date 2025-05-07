from flask import Flask, request, jsonify
from newsapi import NewsApiClient
from flask_cors import CORS
import os
import re
from dotenv import load_dotenv


app = Flask(__name__)
# Enable CORS for all routes to allow requests from the React frontend
CORS(app)


# Load environment variables from .env file
load_dotenv()

# Get the API key
api_key = os.getenv("NEWS_API_KEY")


# Initialize the client
newsapi = NewsApiClient(api_key=api_key)



# Keywords related to women-focused topics
WOMEN_KEYWORDS = [
    # General identifiers
    'women', 'woman', 'female', 'girl', 'girls', 'ladies', 'womens', "women's", 'lady',

    # Gender equality & inclusion
    'gender equality', 'gender equity', 'gender justice', 'gender diversity',
    'gender gap', 'gender inclusion', 'gender rights', 'gender bias',

    # Empowerment & feminism
    'empowerment', 'female empowerment', 'women empowerment', 'nari shakti', 'shakti',
    'mahila sashaktikaran', 'feminism', 'feminist', 'women leaders', 'women leadership',
    'women achievers', 'women success', 'women-led', 'women-owned',

    # Education & social campaigns
    'beti bachao', 'beti padhao', 'ladli yojana', 'sukanya samriddhi yojana', 
    'savitribai phule', 'education for girls',

    # Health and well-being
    'maternal', 'maternity', 'maternal health', 'women health', 'menstrual hygiene',
    'nutrition for women', 'pregnancy care', 'janani suraksha', 'ujjwala scheme',

    # Women in professions & sectors
    'women in tech', 'women in business', 'women in politics', 'women in science', 
    'women in education', 'women in agriculture', 'women in defence', 'women in sports',
    'women in media', 'women entrepreneurs', 'nari sena', 'nari brigade',

    # Legal & safety
    'dowry', 'dowry act', 'domestic violence', 'sexual harassment', 'POSH Act',
    'maternity benefit act', 'mahila police', 'women helpline', 'one stop center',

    # Entrepreneurship & initiatives
    'startup india women', 'stand up india', 'women investors', 'women founders', 
    'women-led startups', 'self-help groups', 'SHGs for women', 'sabla scheme'
]


def is_women_related(text):
    """Check if the article is related to women's topics."""
    if not text:
        return False
    
    text = text.lower()
    
    # Check for any of the women-related keywords
    for keyword in WOMEN_KEYWORDS:
        if keyword.lower() in text:
            return True
    
    return False

def get_personalized_articles(query, articles):
    """Filter and rank articles based on women-focused content."""
    women_articles = []
    maybe_related = []
    
    # Enhanced query to focus on women-related news
    enhanced_query = f"{query} AND (women OR female OR gender OR empowerment OR leadership)"
    
    for article in articles:
        title = article.get("title", "")
        description = article.get("description", "")
        content = article.get("content", "")
        
        # Combine all text fields for comprehensive analysis
        full_text = f"{title} {description} {content}".lower()
        
        # Check if the article is strongly women-related
        if is_women_related(title) or sum(keyword.lower() in full_text for keyword in WOMEN_KEYWORDS) >= 2:
            women_articles.append(article)
        elif any(keyword.lower() in full_text for keyword in WOMEN_KEYWORDS):
            maybe_related.append(article)
    
    # Prioritize articles that are strongly women-related, then append maybe related
    prioritized_articles = women_articles + maybe_related
    
    # If we don't have enough articles after filtering, we'll use the original results
    if len(prioritized_articles) < 5 and articles:
        return articles
    
    return prioritized_articles

@app.route('/get-news', methods=['GET', 'POST'])
def get_news():
    if request.method == 'POST':
        data = request.get_json()
        query = data.get('jobTitle') if data else None
    else:
        query = request.args.get('query')
        
    if not query:
        return jsonify({"error": "Please provide a query"}), 400
    
    try:
        # First attempt: Try to get articles with the specific query plus women-related terms
        enhanced_query = f"{query} AND (women OR female OR gender OR empowerment)"
        response = newsapi.get_everything(
            q=enhanced_query,
            language='en',
            sort_by='relevancy',
            page_size=30  # Fetch more articles to have enough after filtering
        )
        
        articles = response.get('articles', [])
        
        # If we don't get enough articles with the enhanced query, try the original query
        if len(articles) < 10:
            response = newsapi.get_everything(
                q=query,
                language='en',
                sort_by='relevancy',
                page_size=30
            )
            articles = response.get('articles', [])
        
        # Apply our custom filtering to focus on women-related content
        filtered_articles = get_personalized_articles(query, articles)
        
        result = []
        
        for article in filtered_articles[:20]:  # Limit to 20 results
            result.append({
                "title": article.get("title"),
                "description": article.get("description") or "No description available.",
                "content": article.get("content") or "No content available.",
                "source": article.get("source", {}).get("name"),
                "publishedAt": article.get("publishedAt"),
                "url": article.get("url"),
                "urlToImage": article.get("urlToImage") or "No image available.",
                "relevanceScore": sum(1 for kw in WOMEN_KEYWORDS if kw.lower() in 
                                    f"{article.get('title', '')} {article.get('description', '')}".lower())
            })
        
        # Sort by relevance score as a final step
        result.sort(key=lambda x: x.get("relevanceScore", 0), reverse=True)
        
        # Remove the relevance score before sending to frontend if you don't need it there
        for article in result:
            if "relevanceScore" in article:
                del article["relevanceScore"]
        
        return jsonify({"query": query, "articles": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Use environment variable for port if available (for production deployments)
    # Set debug=True during development for auto-reloading
    app.run(debug=False, host='0.0.0.0', port=5002)