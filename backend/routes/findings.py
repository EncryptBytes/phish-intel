from fastapi import APIRouter
from services.mongo_service import get_all_findings, get_stats

router = APIRouter()

@router.get("/findings")
def list_findings():
    return get_all_findings()

@router.get("/stats")
def dashboard_stats():
    return get_stats()
