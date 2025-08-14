from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/okapiq")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # API Keys
    YELP_API_KEY: Optional[str] = os.getenv("YELP_API_KEY")
    GOOGLE_MAPS_API_KEY: Optional[str] = os.getenv("GOOGLE_MAPS_API_KEY")
    GLENCOCO_API_KEY: Optional[str] = os.getenv("GLENCOCO_API_KEY")
    CENSUS_API_KEY: Optional[str] = os.getenv("CENSUS_API_KEY")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    SERPAPI_KEY: Optional[str] = os.getenv("SERPAPI_KEY")
    FIRECRAWL_API_KEY: Optional[str] = os.getenv("FIRECRAWL_API_KEY")
    APIFY_TOKEN: Optional[str] = os.getenv("APIFY_TOKEN")
    CRIMEOMETER_API_KEY: Optional[str] = os.getenv("CRIMEOMETER_API_KEY")
    # LeanGenius
    LEANGENIUS_API_KEY: Optional[str] = os.getenv("LEANGENIUS_API_KEY")
    LEANGENIUS_BASE_URL: str = os.getenv("LEANGENIUS_BASE_URL", "https://api.leangenius.ai")
    
    # Stripe
    STRIPE_SECRET_KEY: Optional[str] = os.getenv("STRIPE_SECRET_KEY")
    STRIPE_PUBLISHABLE_KEY: Optional[str] = os.getenv("STRIPE_PUBLISHABLE_KEY")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # App Settings
    APP_NAME: str = "Okapiq"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    RELOAD: bool = os.getenv("RELOAD", "True").lower() == "true"
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001")
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: str = "uploads"
    
    # External APIs
    YELP_BASE_URL: str = "https://api.yelp.com/v3"
    CENSUS_BASE_URL: str = "https://api.census.gov/data"
    
    # Pricing
    EXPLORER_PRICE: int = 79
    PROFESSIONAL_PRICE: int = 897
    ELITE_PRICE: int = 5900
    
    # Trial Settings
    TRIAL_DAYS: int = 14
    ETALAUNCH_TRIAL_DAYS: int = 90
    ETALAUNCH_CODE: str = "ETALAUNCH100"
    
    class Config:
        env_file = ".env"

settings = Settings() 