from fastapi import APIRouter
from typing import Optional

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary")
async def get_summary():
    return {
        "total": 120,
        "resolved": 85,
        "open": 35,
        "sla_breaches": 5
    }

@router.get("/by-neighborhood")
async def get_by_neighborhood():
    return [
        {"name": "Nəsimi", "resolved": 20, "open": 5, "overdue": 1},
        {"name": "Xətai", "resolved": 15, "open": 10, "overdue": 2}
    ]

@router.get("/by-category")
async def get_by_category():
    return [
        {"name": "Yollar", "value": 40, "color": "#F59E0B"},
        {"name": "Zibil", "value": 60, "color": "#10B981"}
    ]

@router.get("/monthly-trend")
async def get_monthly_trend(year: Optional[int] = None):
    return [
        {"month": "Yan", "submitted": 50, "resolved": 45},
        {"month": "Fev", "submitted": 60, "resolved": 50}
    ]

@router.get("/agency-performance")
async def get_agency_performance():
    return [
        {"agency": "AAYDA", "compliance_pct": 95, "avg_resolution_hours": 24.5},
        {"agency": "MKTB", "compliance_pct": 88, "avg_resolution_hours": 12.0}
    ]

@router.get("/sla-breaches")
async def get_sla_breaches():
    return [
        {
            "report_id": "MR-0001",
            "title": "İşıqfor işləmir",
            "neighborhood": "Səbail",
            "assigned_to": "AYNA",
            "overdue_days": 2,
            "severity": "high"
        }
    ]