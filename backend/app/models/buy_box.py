from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class BuyBox(Base):
    __tablename__ = "buy_boxes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)  # e.g., "Avila Peak Partners Criteria"
    
    # Industries (JSON array)
    industries = Column(JSON, nullable=True)  # ["Business Services", "Consumer Services", "Distribution"]
    
    # Location criteria
    location_type = Column(String(50), default="us_only")  # us_only, specific_states, specific_cities
    allowed_locations = Column(JSON, nullable=True)  # States/cities if specific
    
    # Financial criteria
    min_ebitda = Column(Float, nullable=True)  # 300000
    min_revenue = Column(Float, nullable=True)  # 1500000
    min_ebitda_multiple = Column(Float, nullable=True)  # 3.0
    min_purchase_price = Column(Float, nullable=True)  # 1500000
    max_purchase_price = Column(Float, nullable=True)  # 7000000
    
    # Operational criteria
    requires_management = Column(Boolean, default=False)  # Strong second-level management
    remote_ownable = Column(Boolean, default=False)  # Remotely ownable operations
    overseas_outsourcing = Column(Boolean, default=False)  # Overseas outsourcing capabilities
    
    # Preferred attributes
    recurring_revenue = Column(Boolean, default=False)  # Recurring revenue models
    low_customer_concentration = Column(Boolean, default=False)  # Low customer concentration
    max_customer_concentration = Column(Float, nullable=True)  # % (e.g., 0.25 for 25%)
    
    # Deal types
    asset_purchase = Column(Boolean, default=True)
    stock_purchase = Column(Boolean, default=True)
    seller_financing = Column(Boolean, default=True)
    sba_guidelines = Column(Boolean, default=False)
    
    # Contact information
    contact_emails = Column(JSON, nullable=True)  # ["juanmendoza@avilapeakpartners.com"]
    contact_phones = Column(JSON, nullable=True)  # ["+1 (415) 234-3984"]
    contact_notes = Column(Text, nullable=True)
    
    # Status and metadata
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="buy_boxes")

# Add to User model
# buy_boxes = relationship("BuyBox", back_populates="user")
