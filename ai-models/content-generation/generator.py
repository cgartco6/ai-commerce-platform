import openai
import json
from typing import Dict, List
from langchain import OpenAI, PromptTemplate, LLMChain

class ContentGenerator:
    def __init__(self, api_key: str):
        openai.api_key = api_key
        self.llm = OpenAI(temperature=0.7, openai_api_key=api_key)
    
    def generate_product_description(self, product_info: Dict) -> Dict:
        """Generate AI-powered product description"""
        
        prompt_template = PromptTemplate(
            input_variables=["product_name", "features", "target_audience", "tone"],
            template="""
            Create an engaging product description for: {product_name}
            
            Key Features: {features}
            Target Audience: {target_audience}
            Tone: {tone}
            
            The description should be SEO-optimized, compelling, and highlight the key benefits.
            Include a call to action. Keep it between 150-200 words.
            """
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt_template)
        
        response = chain.run(
            product_name=product_info['name'],
            features=", ".join(product_info['features']),
            target_audience=product_info.get('target_audience', 'general'),
            tone=product_info.get('tone', 'professional')
        )
        
        return {
            'description': response.strip(),
            'word_count': len(response.split()),
            'seo_score': self._calculate_seo_score(response)
        }
    
    def generate_marketing_copy(self, campaign_info: Dict) -> Dict:
        """Generate marketing copy for campaigns"""
        
        prompt_template = PromptTemplate(
            input_variables=["product", "platform", "goal", "target_audience"],
            template="""
            Create compelling {platform} marketing copy for: {product}
            
            Marketing Goal: {goal}
            Target Audience: {target_audience}
            
            Create 3 variations with different angles. Each should be platform-appropriate.
            Include relevant hashtags if applicable.
            """
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt_template)
        
        response = chain.run(
            product=campaign_info['product'],
            platform=campaign_info['platform'],
            goal=campaign_info['goal'],
            target_audience=campaign_info['target_audience']
        )
        
        return self._parse_marketing_response(response)
    
    def _calculate_seo_score(self, text: str) -> float:
        """Calculate basic SEO score for generated content"""
        # Simple SEO scoring - in practice, this would be more sophisticated
        words = text.lower().split()
        score = 0
        
        # Check for keyword density, length, etc.
        if len(words) >= 150:
            score += 0.3
        if any(keyword in text.lower() for keyword in ['buy', 'shop', 'order', 'get']):
            score += 0.3
        if len(text) > 500:
            score += 0.4
            
        return min(score, 1.0)
    
    def _parse_marketing_response(self, response: str) -> Dict:
        """Parse the AI response into structured data"""
        # This would parse the AI response into structured variations
        variations = response.split('\n\n')
        
        return {
            'variations': [
                {
                    'text': var.strip(),
                    'character_count': len(var.strip()),
                    'platform_optimized': True
                }
                for var in variations if var.strip()
            ]
        }

# Usage example
if __name__ == "__main__":
    generator = ContentGenerator("your-openai-api-key")
    
    product_info = {
        'name': 'Wireless Bluetooth Headphones',
        'features': ['Noise cancellation', '30-hour battery', 'Comfort fit'],
        'target_audience': 'Tech-savvy professionals',
        'tone': 'Professional yet approachable'
    }
    
    description = generator.generate_product_description(product_info)
    print(json.dumps(description, indent=2))
