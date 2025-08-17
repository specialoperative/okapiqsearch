from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.core.database import get_db
from app.models.buy_box import BuyBox
from app.routers.auth import get_current_user
from app.core.database import User
import json

router = APIRouter(prefix="/buy-box", tags=["buy-box"])

# Pydantic models
class BuyBoxCreate(BaseModel):
    name: str
    industries: Optional[List[str]] = None
    location_type: str = "us_only"
    allowed_locations: Optional[List[str]] = None
    min_ebitda: Optional[float] = None
    min_revenue: Optional[float] = None
    min_ebitda_multiple: Optional[float] = None
    min_purchase_price: Optional[float] = None
    max_purchase_price: Optional[float] = None
    requires_management: bool = False
    remote_ownable: bool = False
    overseas_outsourcing: bool = False
    recurring_revenue: bool = False
    low_customer_concentration: bool = False
    max_customer_concentration: Optional[float] = None
    asset_purchase: bool = True
    stock_purchase: bool = True
    seller_financing: bool = True
    sba_guidelines: bool = False
    contact_emails: Optional[List[str]] = None
    contact_phones: Optional[List[str]] = None
    contact_notes: Optional[str] = None

class BuyBoxUpdate(BaseModel):
    name: Optional[str] = None
    industries: Optional[List[str]] = None
    location_type: Optional[str] = None
    allowed_locations: Optional[List[str]] = None
    min_ebitda: Optional[float] = None
    min_revenue: Optional[float] = None
    min_ebitda_multiple: Optional[float] = None
    min_purchase_price: Optional[float] = None
    max_purchase_price: Optional[float] = None
    requires_management: Optional[bool] = None
    remote_ownable: Optional[bool] = None
    overseas_outsourcing: Optional[bool] = None
    recurring_revenue: Optional[bool] = None
    low_customer_concentration: Optional[bool] = None
    max_customer_concentration: Optional[float] = None
    asset_purchase: Optional[bool] = None
    stock_purchase: Optional[bool] = None
    seller_financing: Optional[bool] = None
    sba_guidelines: Optional[bool] = None
    contact_emails: Optional[List[str]] = None
    contact_phones: Optional[List[str]] = None
    contact_notes: Optional[str] = None
    is_active: Optional[bool] = None

class BuyBoxResponse(BaseModel):
    id: int
    user_id: int
    name: str
    industries: Optional[List[str]]
    location_type: str
    allowed_locations: Optional[List[str]]
    min_ebitda: Optional[float]
    min_revenue: Optional[float]
    min_ebitda_multiple: Optional[float]
    min_purchase_price: Optional[float]
    max_purchase_price: Optional[float]
    requires_management: bool
    remote_ownable: bool
    overseas_outsourcing: bool
    recurring_revenue: bool
    low_customer_concentration: bool
    max_customer_concentration: Optional[float]
    asset_purchase: bool
    stock_purchase: bool
    seller_financing: bool
    sba_guidelines: bool
    contact_emails: Optional[List[str]]
    contact_phones: Optional[List[str]]
    contact_notes: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Create buy box
@router.post("/", response_model=BuyBoxResponse)
async def create_buy_box(
    buy_box: BuyBoxCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_buy_box = BuyBox(
        user_id=current_user.id,
        name=buy_box.name,
        industries=buy_box.industries,
        location_type=buy_box.location_type,
        allowed_locations=buy_box.allowed_locations,
        min_ebitda=buy_box.min_ebitda,
        min_revenue=buy_box.min_revenue,
        min_ebitda_multiple=buy_box.min_ebitda_multiple,
        min_purchase_price=buy_box.min_purchase_price,
        max_purchase_price=buy_box.max_purchase_price,
        requires_management=buy_box.requires_management,
        remote_ownable=buy_box.remote_ownable,
        overseas_outsourcing=buy_box.overseas_outsourcing,
        recurring_revenue=buy_box.recurring_revenue,
        low_customer_concentration=buy_box.low_customer_concentration,
        max_customer_concentration=buy_box.max_customer_concentration,
        asset_purchase=buy_box.asset_purchase,
        stock_purchase=buy_box.stock_purchase,
        seller_financing=buy_box.seller_financing,
        sba_guidelines=buy_box.sba_guidelines,
        contact_emails=buy_box.contact_emails,
        contact_phones=buy_box.contact_phones,
        contact_notes=buy_box.contact_notes
    )
    
    db.add(db_buy_box)
    db.commit()
    db.refresh(db_buy_box)
    return db_buy_box

# Get user's buy boxes
@router.get("/", response_model=List[BuyBoxResponse])
async def get_buy_boxes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(BuyBox).filter(BuyBox.user_id == current_user.id).all()

# Get specific buy box
@router.get("/{buy_box_id}", response_model=BuyBoxResponse)
async def get_buy_box(
    buy_box_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    buy_box = db.query(BuyBox).filter(
        BuyBox.id == buy_box_id,
        BuyBox.user_id == current_user.id
    ).first()
    
    if not buy_box:
        raise HTTPException(status_code=404, detail="Buy box not found")
    
    return buy_box

# Update buy box
@router.put("/{buy_box_id}", response_model=BuyBoxResponse)
async def update_buy_box(
    buy_box_id: int,
    buy_box_update: BuyBoxUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    buy_box = db.query(BuyBox).filter(
        BuyBox.id == buy_box_id,
        BuyBox.user_id == current_user.id
    ).first()
    
    if not buy_box:
        raise HTTPException(status_code=404, detail="Buy box not found")
    
    update_data = buy_box_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(buy_box, field, value)
    
    db.commit()
    db.refresh(buy_box)
    return buy_box

# Delete buy box
@router.delete("/{buy_box_id}")
async def delete_buy_box(
    buy_box_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    buy_box = db.query(BuyBox).filter(
        BuyBox.id == buy_box_id,
        BuyBox.user_id == current_user.id
    ).first()
    
    if not buy_box:
        raise HTTPException(status_code=404, detail="Buy box not found")
    
    db.delete(buy_box)
    db.commit()
    return {"detail": "Buy box deleted"}

# Create Avila Peak Partners template
@router.post("/template/avila-peak", response_model=BuyBoxResponse)
async def create_avila_peak_template(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a buy box template based on Avila Peak Partners criteria"""
    avila_buy_box = BuyBox(
        user_id=current_user.id,
        name="Avila Peak Partners Acquisition Criteria",
        industries=["Business Services", "Consumer Services", "Distribution"],
        location_type="us_only",
        min_ebitda=300000,  # $300K+ EBITDA
        min_revenue=1500000,  # $1.5M+ revenue
        min_ebitda_multiple=3.0,  # 3x EBITDA multiples or higher
        min_purchase_price=1500000,  # $1.5M minimum
        max_purchase_price=7000000,  # $7M maximum
        requires_management=True,  # Strong second-level management
        remote_ownable=True,  # Remotely ownable operations
        overseas_outsourcing=True,  # Overseas outsourcing capabilities appealing
        recurring_revenue=True,  # Recurring revenue models preferred
        low_customer_concentration=True,  # Low customer concentration preferred
        asset_purchase=True,
        stock_purchase=True,
        seller_financing=True,
        sba_guidelines=True,
        contact_emails=["juanmendoza@avilapeakpartners.com", "marcomendoza@avilapeakpartners.com"],
        contact_phones=["+1 (555) 123-4567", "+1 (555) 987-6543"],
        contact_notes="Entrepreneurial investment firm seeking high-quality U.S.-based businesses with strong fundamentals and growth potential."
    )
    
    db.add(avila_buy_box)
    db.commit()
    db.refresh(avila_buy_box)
    return avila_buy_box

# Match businesses to buy box criteria
@router.get("/{buy_box_id}/matches")
async def get_buy_box_matches(
    buy_box_id: int,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get businesses that match the buy box criteria"""
    from app.core.database import Business
    
    # Get the buy box
    buy_box = db.query(BuyBox).filter(
        BuyBox.id == buy_box_id,
        BuyBox.user_id == current_user.id
    ).first()
    
    if not buy_box:
        raise HTTPException(status_code=404, detail="Buy box not found")
    
    # Start with all businesses
    query = db.query(Business)
    
    # Filter by industries if specified
    if buy_box.industries:
        query = query.filter(Business.industry.in_(buy_box.industries))
    
    # Filter by revenue if specified
    if buy_box.min_revenue:
        query = query.filter(Business.estimated_revenue >= buy_box.min_revenue)
    
    # Calculate estimated EBITDA (assume 15% margin) and filter
    if buy_box.min_ebitda:
        min_revenue_for_ebitda = buy_box.min_ebitda / 0.15
        query = query.filter(Business.estimated_revenue >= min_revenue_for_ebitda)
    
    # Filter by purchase price range (assume 3x revenue multiple for estimation)
    if buy_box.min_purchase_price:
        min_revenue_for_price = buy_box.min_purchase_price / 3.0
        query = query.filter(Business.estimated_revenue >= min_revenue_for_price)
    
    if buy_box.max_purchase_price:
        max_revenue_for_price = buy_box.max_purchase_price / 3.0
        query = query.filter(Business.estimated_revenue <= max_revenue_for_price)
    
    # Order by lead score and limit results
    businesses = query.order_by(Business.lead_score.desc()).limit(limit).all()
    
    # Calculate match scores and add estimated financials
    matches = []
    for business in businesses:
        estimated_ebitda = business.estimated_revenue * 0.15 if business.estimated_revenue else 0
        estimated_purchase_price = business.estimated_revenue * 3.0 if business.estimated_revenue else 0
        
        # Calculate match score based on criteria alignment
        match_score = 0.0
        total_criteria = 0.0
        
        # Industry match (30% weight)
        if buy_box.industries:
            total_criteria += 30
            if business.industry in buy_box.industries:
                match_score += 30
        
        # Revenue match (25% weight)
        if buy_box.min_revenue and business.estimated_revenue:
            total_criteria += 25
            if business.estimated_revenue >= buy_box.min_revenue:
                match_score += 25
        
        # EBITDA match (25% weight)
        if buy_box.min_ebitda:
            total_criteria += 25
            if estimated_ebitda >= buy_box.min_ebitda:
                match_score += 25
        
        # Purchase price range (20% weight)
        if buy_box.min_purchase_price and buy_box.max_purchase_price:
            total_criteria += 20
            if buy_box.min_purchase_price <= estimated_purchase_price <= buy_box.max_purchase_price:
                match_score += 20
        
        final_match_score = (match_score / total_criteria * 100) if total_criteria > 0 else 0
        
        matches.append({
            "business": business,
            "match_score": round(final_match_score, 1),
            "estimated_ebitda": estimated_ebitda,
            "estimated_purchase_price": estimated_purchase_price,
            "match_reasons": [
                f"Industry: {business.industry}" if business.industry in (buy_box.industries or []) else None,
                f"Revenue: ${business.estimated_revenue:,.0f}" if business.estimated_revenue and business.estimated_revenue >= (buy_box.min_revenue or 0) else None,
                f"Est. EBITDA: ${estimated_ebitda:,.0f}" if estimated_ebitda >= (buy_box.min_ebitda or 0) else None,
                f"Est. Price: ${estimated_purchase_price:,.0f}" if buy_box.min_purchase_price and buy_box.max_purchase_price and buy_box.min_purchase_price <= estimated_purchase_price <= buy_box.max_purchase_price else None
            ]
        })
    
    # Filter out None reasons and sort by match score
    for match in matches:
        match["match_reasons"] = [r for r in match["match_reasons"] if r is not None]
    
    matches.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {
        "buy_box": buy_box,
        "total_matches": len(matches),
        "matches": matches
    }
