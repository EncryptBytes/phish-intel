from fastapi import APIRouter
from services.mongo_service import get_taxonomy

router = APIRouter()

@router.get("/taxonomy")
def get_all_taxonomy():
    return get_taxonomy()
