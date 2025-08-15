from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import pandas as pd
import json
from datetime import datetime

from app.routers import market, leads, auth, analytics, intelligence, buy_box
from app.core.config import settings
from app.core.database import engine, Base
from app.models.buy_box import BuyBox

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Okapiq API",
    description="Bloomberg for Small Businesses - AI-powered deal sourcing and market intelligence",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://app.okapiq.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(market.router, prefix="/market", tags=["Market Intelligence"])
app.include_router(leads.router, prefix="/leads", tags=["Lead Management"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(intelligence.router, prefix="/intelligence", tags=["Intelligence"])
app.include_router(buy_box.router, tags=["Buy Box"])

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to Okapiq API",
        "version": "1.0.0",
        "description": "Bloomberg for Small Businesses",
        "docs": "/docs",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": "connected",
            "redis": "connected",
            "external_apis": "operational"
        }
    }

@app.get("/pricing")
async def get_pricing():
    """Get pricing tiers information"""
    return {
        "tiers": [
            {
                "name": "Explorer Pack",
                "price": 79,
                "currency": "USD",
                "period": "month",
                "features": [
                    "1,000+ unqualified business leads/month",
                    "Basic TAM/SAM estimates per market",
                    "City/ZIP demographic analysis",
                    "Suggested ad spend to dominate area",
                    "CSV export functionality"
                ],
                "add_ons": [
                    {"name": "Owner Age Estimation", "price": 19, "unit": "per 100 leads"},
                    {"name": "Advanced Market Analysis", "price": 39, "unit": "per report"},
                    {"name": "Custom Heatmap", "price": 199, "unit": "per region"}
                ]
            },
            {
                "name": "Professional",
                "price": 897,
                "currency": "USD",
                "period": "month",
                "features": [
                    "Up to 2,000 qualified business scans/month",
                    "HHI fragmentation scoring by ZIP/MSA",
                    "Roll-up opportunity identification",
                    "Market consolidation cost analysis",
                    "Succession risk indicators",
                    "CRM-ready lead exports"
                ]
            },
            {
                "name": "Elite Intelligence Suite",
                "price": 5900,
                "currency": "USD",
                "period": "month",
                "features": [
                    "2,500+ precision-qualified leads/month",
                    "Complete deal pipeline management",
                    "AI-generated CIMs & outreach templates",
                    "Real-time negotiation scoreboards",
                    "Full TAM/SAM/SOM analysis suite",
                    "API access & custom integrations"
                ]
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 